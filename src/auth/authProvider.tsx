import { createContext, useState, useContext, PropsWithChildren, useEffect } from "react";
import { loginUser, registerUser, verifyOTP } from "../api/auth.service";
import { UserAuth, LoginRegisterDto, VerifyOTPDto } from "../api/types/auth.types";


interface AuthContextType {
  user: UserAuth | null;
  currentUser: UserAuth | null;
  login: (userData: LoginRegisterDto) => Promise<boolean>; 
  verifyOtp: (userData: VerifyOTPDto) => Promise<boolean>;
  register: (userData: LoginRegisterDto) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);


export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<UserAuth | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

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
      localStorage.setItem("user", JSON.stringify(userRole));
      return loggedUser.success
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

  function getCurrentUser(): UserAuth | null {
    try {
      const userString = localStorage.getItem("user");
      return JSON.parse(userString!);
    } catch (e) {
      console.error("Error parsing user from localStorage", e);
      return null;
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        currentUser: getCurrentUser(),
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