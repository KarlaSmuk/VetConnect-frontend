type CreateUserDto = {
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    phoneNumber: string;
}

type UpdateUserDto = {
    id: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    phoneNumber?: string;
}

type CreateWorkingHours = {
    day: number;
    openingTime: string;
    closingTime: string;
    specialNotes?: string;
}

type CreateClinicDto = {
    oib: string;
    name: string;
    address: string;
    county: string;
    phoneNumber: string;
    email: string;
    webAddress?: string;
    workingHours: CreateWorkingHours[];
}