import { createContext, useState, useContext, PropsWithChildren } from "react";
import { loginUser, registerUser, verifyOTP } from "../api/auth.service";


interface AuthContextType {
  user: UserAuth | null;
  isLoggedIn: boolean;
  currentUser: UserAuth | null;
  login: (userData: LoginRegisterDto) => Promise<void>; 
  verifyOtp: (userData: VerifyOTPDto) => Promise<boolean>;
  register: (userData: LoginRegisterDto) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);


export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<UserAuth | null>(null);

  const login = async (userData: LoginRegisterDto) => {
    try {
      const loggedUser = await loginUser(userData);
      const userLoggedData = loggedUser.message.user;
      let userRole: UserAuth = { user: userLoggedData };
  
      if (loggedUser.message.owner) {
        userRole.owner = loggedUser.message.owner;
      }
  
      if (loggedUser.message.vet) {
        userRole.vet = loggedUser.message.vet;
      }
  
      setUser(userRole);
      window.localStorage.setItem("user", JSON.stringify(userRole));
      } catch (err) {
        console.error(err);
      }
  };

  //add password
  const register = async (userData: LoginRegisterDto) => {
    try {
        const registered = await registerUser(userData);

        return registered.success

      } catch (err) {
        console.error(err);
      }
  };

  const verifyOtp = async (userData: VerifyOTPDto) => {
    try {
      console.log(userData)
      const verifyUser = await verifyOTP(userData);

      return verifyUser.success
      } catch (err) {
        console.error(err);
      }
  };

  const logout = () => {
    window.localStorage.removeItem("user")
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        currentUser: user,
        verifyOtp,
        register,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};