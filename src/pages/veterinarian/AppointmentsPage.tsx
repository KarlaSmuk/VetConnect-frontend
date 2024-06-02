import {
    Flex,
    Heading,
    IconButton,
    ListItem,
    UnorderedList,
    useToast,
} from "@chakra-ui/react";
import NavBar from "../../components/NavBar";
import { useAuth } from "../../auth/authProvider";
import { useEffect, useState } from "react";
import { VetsAppointmentsDto } from "../../api/types/api.types";
import {
    getAppointmentsByClinicId,
    updateAppointmentStatus
} from "../../api/appointment.service";
import { AppointmentStatus } from "../../enums/appointmentStatus.enum";
import { CheckIcon, CloseIcon } from "@chakra-ui/icons";

export default function AppointmentsVets() {
    
    const [appointments, setAppointments] = useState<VetsAppointmentsDto>([]);

    const { currentUser } = useAuth();


    const toast = useToast();

    useEffect(() => {
        fetchAppointments();
    }, []);

 
    const fetchAppointments = async () => {
        try {
            const data = await getAppointmentsByClinicId(currentUser!.vet!.clinicId);
            setAppointments(data);
        } catch (error) {
            console.error("Error geting appointments for clinics:", error);
        }
    };

    const handleUpdateStatus= async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, status: AppointmentStatus, appointmentId: string) => {
        e.preventDefault()
        try {
            await updateAppointmentStatus({
                appointmentId: appointmentId,
                status: status
            })

            
            setAppointments(prev => prev.filter(app => app.id != appointmentId))
           
            
        } catch (error) {
            console.log("Error updating status:", error)
            toast({
                title: "Pogreška kod promjene statusa termina.",
                status: "error",
            });
        }
    }

    return (
        <Flex
            direction={"column"}
            minHeight={"100vh"}
            alignItems={"center"}
            bgColor={"gray.50"}
        >
            <NavBar />
            <Flex
                mt={10}
                alignItems={"flex-start"}
                direction={"column"}
                width={"90%"}
            >
                <Heading>Rezervirani termini</Heading>
                <Flex wrap={'wrap'} gap={4}>
                {appointments && appointments.map((appointment) => (
                            <Flex key={appointment.id} direction={"column"} mt={5}>
                                <Flex direction={"row"} wrap={"wrap"} gap={5} my={5}>
                                        <Flex
                                            borderRadius={"20px"}
                                            border={"1px"}
                                            borderColor={"gray.400"}
                                            bgColor={"white"}
                                            padding={4}
                                            direction={"column"}
                                            alignItems={'flex-end'}
                                        >
                                            <UnorderedList key={appointment.id} styleType={"none"}>
                                                <ListItem>
                                                    Ime ljubimca: {appointment.pet!.name}
                                                </ListItem>
                                                <ListItem>
                                                    Vrijeme: {new Date(appointment.time).toLocaleString()}
                                                </ListItem>
                                                <ListItem>
                                                    Razlog dolaska: {appointment.purpose}
                                                </ListItem>
                                            </UnorderedList>
                                            <Flex gap={3}>
                                                <IconButton
                                                    icon={<CloseIcon />}
                                                    onClick={(e) => handleUpdateStatus(e, AppointmentStatus.NOSHOW, appointment.id)}
                                                    mt={5}
                                                    padding={2}
                                                    colorScheme="red"
                                                    textColor={"white"}
                                                    size={'s'} 
                                                    aria-label={"No-show"}
                                                    isDisabled={new Date(appointment.time) > new Date()} 
                                                />
                                                <IconButton
                                                    icon={<CheckIcon />}
                                                    onClick={(e) => handleUpdateStatus(e, AppointmentStatus.COMPLETED, appointment.id)}
                                                    mt={5}
                                                    padding={2}
                                                    colorScheme="green"
                                                    textColor={"white"}
                                                    size={'s'} 
                                                    aria-label={"Completed"} 
                                                    isDisabled={new Date(appointment.time) > new Date()} 
                                          
                                                />
                                            </Flex>
                                        </Flex>
                             
                                </Flex>
                            </Flex>
                        
                ))}
                </Flex>
            </Flex>
        </Flex>
    );
}
