import { Flex, Heading, Select } from "@chakra-ui/react";
import NavBar from "../components/NavBar";
import { useAuth } from "../auth/authProvider";
import Calendar from "../components/Calendar";
import { useEffect, useState } from "react";
import { getClinics } from "../api/clinic.service";
import { Clinic, ClinicsDto, WorkingHours } from "../api/types/api.types";

export default function Appointments() {
    const [clinics, setClinics] = useState<ClinicsDto>([]);
    const [selectedClinicWH, setSelectedClinicWH] = useState<WorkingHours[]>();

    const { currentUser } = useAuth();

    useEffect(() => {
        fetchClinics();
    }, []);

    const fetchClinics = async () => {
        try {
            const data = await getClinics();
            setClinics(data);
        } catch (error) {
            console.error("Error geting clinics:", error);
        }
    };

    const handleClinicChange = (event: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        const value = event.target.value; //clinicId
        const selected = clinics.find(clinic => clinic.id == value)
        setSelectedClinicWH(selected!.workingHours);
    };

    return (
        <Flex direction={"column"} alignItems={'center'} bgColor={'gray.50'}>
            <NavBar />
            <Flex my={10} direction={'column'} alignItems={'center'} borderRadius={'20px'} mx={10} border={'1px'} borderColor={'gray.400'} padding={6} width={'80vw'} height={'100%'} bgColor={'white'}>
                <Heading mt={5}>Rezerviraj termin u željenoj klinici</Heading>
                <Select
                    mt={10}
                    name="selectedClinic"
                    onChange={handleClinicChange}
                    placeholder="Odaberi kliniku"
                    mr={2}
                    mb={5}
                    width={'50vw'}
                >
                    {clinics.map((clinic) => (
                        <option key={clinic.id} value={clinic.id}>
                            {`${clinic.name}`}
                        </option>
                    ))}
                </Select>
                <Calendar workingHours={selectedClinicWH!} />
            </Flex>
        </Flex>
    );
}
