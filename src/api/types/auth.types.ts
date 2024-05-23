type LoginRegisterDto = {
    email: string;
    password: string;
}

type VerifyOTPDto = {
    email: string;
    otp: string;
}


type UserAuth = {
    user: UserData;
    owner?: OwnerAuth;
    vet?: VetAuth;
}

interface UserData {
    id: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    role: string;
    photo: string | null;
}

interface VetAuth {
    vet: {
        id: string;
        clinicId: string;
    }
}

interface OwnerAuth {
    owner: {
        id: string;
    }
}
