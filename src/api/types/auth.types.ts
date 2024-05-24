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

export interface UserData {
    id: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    role: ROLE;
    photo: string | null;
}

interface VetAuth {
    id: string;
    clinicId: string;
}

interface OwnerAuth {
    id: string; 
}