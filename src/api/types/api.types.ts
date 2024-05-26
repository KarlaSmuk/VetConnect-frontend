import { PetStatus } from "../../enums/petStatus.enum";

export interface WorkingHours {
    id: string;
    day: number;
    openingTime: string;
    closingTime: string;
    specialNotes: string;
}

export interface Clinic {
    oib: string;
    name: string;
    address: string;
    county: string;
    phoneNumber: string;
    email: string;
    webAddress: string;
    id: string;
    isDeleted: boolean;
    deletedAt: null | string;
    workingHours: WorkingHours[];
}

export type ClinicsDto = Clinic[];

export interface User {
    id: string;
    user: any;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    photo: string;
}

export type UsersDto = User[];

export interface Pet {
    id: string;
    name: string;
    gender: string;
    color: string;
    dateOfBirth: string;
    neutered: boolean;
    photo: string;
    status: PetStatus;
    species: {
        id: string;
        name: string;
    },
    breed:{
        id: string;
        name: string;
    }
}

export interface SpeciesBreed{
    id: string;
    name: string;
}

export type PetsDto = Pet[];

export interface Supply {
    id: string;
    name: string;
    description?: string;
    stockQuantity: number;
    minimumRequired: number;
    updated: string;
}

export type SuppliesDto = Supply[];

export interface Treatment {
    id: string;
    name: string;
    description?: string;
    price: number;
}

export type TreatmentsDto = Treatment[];