import { ROLE } from "../../enums/roles.enum";

export type LoginRegisterDto = {
    email: string;
    password: string;
}

export type VerifyOTPDto = {
    email: string;
    otp: string;
}


export type UserAuth = {
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
    role: ROLE;
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