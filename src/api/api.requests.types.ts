type CreateOwnerDto = {
    firstName: string;
    lastName: string;
    email: string;
    role:string;
    phoneNumber: string;
}

interface CreateWorkingHours {
    dayOfWeek: number;
    openingTime: string;
    closingTime: string;
    specialNotes?: string;
}

interface CreateClinicDto{
    oib: string;
    name: string;
    address: string;
    county: string;
    phoneNumber: string;
    email: string;
    webAddress?: string;
    workingHours: CreateWorkingHours[];
}