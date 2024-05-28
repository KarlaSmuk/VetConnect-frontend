import { PetStatus } from "../../enums/petStatus.enum";

export type CreateUserDto = {
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    phoneNumber: string;
}

export type UpdateUserDto = {
    id: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    phoneNumber?: string;
}

export type CreateWorkingHours = {
    day: number;
    openingTime: string;
    closingTime: string;
    specialNotes?: string;
}

export type CreateClinicDto = {
    oib: string;
    name: string;
    address: string;
    county: string;
    phoneNumber: string;
    email: string;
    webAddress?: string;
    workingHours: CreateWorkingHours[];
}

export type UpdateClinicInfoDto = {
    id: string;
    oib?: string;
    name?: string;
    address?: string;
    county?: string;
    phoneNumber?: string;
    email?: string;
    webAddress?: string;
}

export type UpdateWorkingHours = {
    day: number;
    openingTime?: string;
    closingTime?: string;
    specialNotes?: string;
}

export type UpdateWorkingHoursDto = {
    clinicId: string;
    workingHours: CreateWorkingHours[];
}

export type CreatePetDto = {
    name: string;
    dateOfBirth: Date;
    neutered: boolean;
    gender: string;
    color: string;
    breedName: string;
    speciesName: string;
}

export type UpdatePetStatusDto = {
    petId: string;
    status: PetStatus;
}

export type CreateSupplyDto = {
    name: string;
    description?: string;
    stockQuantity: number;
    minimumRequired: number;
}

export type CreateTreatmentDto = {
    name: string;
    description?: string;
    price: number;
}

export type CreateVisitDto = {
    weight: number;
    temperature: number;
    diagnosis: string;
    notes?: string;
}

export type CreateInvoiceItemDto = {
    treatmentId: string;
    quantity: number;
}

export type CreateInvoiceDto = {
    visitId: string;
    treatments: CreateInvoiceItemDto[];
}