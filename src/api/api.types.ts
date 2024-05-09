interface WorkingHours {
    id: string;
    dayOfWeek: number;
    openingTime: string;
    closingTime: string;
    specialNotes: string;
}

interface Clinic {
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

type ClinicsDto = Clinic[];

interface Owner {
    user: any;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    id: string;
    photo: string;
}

type OwnersDto = Owner[];

type CreateOwnerDto = {
    firstName: string;
    lastName: string;
    email:string;
    role: string;
    phoneNumber: string;
}