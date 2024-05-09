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

type ClinicsData = Clinic[];