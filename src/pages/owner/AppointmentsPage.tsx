import {
    Button,
    Flex,
    FormControl,
    FormHelperText,
    FormLabel,
    Heading,
    IconButton,
    Input,
    Popover,
    PopoverArrow,
    PopoverBody,
    PopoverCloseButton,
    PopoverContent,
    PopoverHeader,
    PopoverTrigger,
    Select,
    Text,
    useToast
} from "@chakra-ui/react";
import NavBar from "../../components/NavBar";
import { useAuth } from "../../auth/authProvider";
import { useEffect, useState } from "react";
import { getClinics } from "../../api/clinic.service";
import { ClinicsDto, PetsDto, WorkingHours } from "../../api/types/api.types";
import { CalendarIcon, InfoIcon } from "@chakra-ui/icons";
import { DayOfWeek } from "../../enums/dayOfWeek.enum";
import { getPetsByOwnerId } from "../../api/ownerPets.service";
import { createAppointment } from "../../api/appointment.service";
import { CreateAppointmentDto } from "../../api/types/api.requests.types";

export default function Appointments() {
    const [clinics, setClinics] = useState<ClinicsDto>([]);
    const [pets, setPets] = useState<PetsDto>([]);
    const [selectedClinic, setSelectedClinic] = useState('');
    const [selectedClinicWH, setSelectedClinicWH] = useState<WorkingHours[]>();
    const [selectedDateTime, setSelectedDateTime] = useState("");
    const [selectedPet, setSelectedPet] = useState("");
    const [purpose, setPurpose] = useState("");

    const { currentUser } = useAuth();

    const minAllowedDate = new Date();
    minAllowedDate.setDate(minAllowedDate.getDate() + 1);
    const maxAllowedDate = new Date();
    maxAllowedDate.setDate(maxAllowedDate.getDate() + 10);


    const [appointment, setAppointment] = useState<CreateAppointmentDto>({
        clinicId: '',
        petId: '',
        time: minAllowedDate,
        purpose: ''
    });

    const toast = useToast()

    
    useEffect(() => {
        fetchClinics();
        fetchPets()
    }, []);

    const fetchClinics = async () => {
        try {
            const data = await getClinics();
            setClinics(data);
        } catch (error) {
            console.error("Error geting clinics:", error);
        }
    };

    const fetchPets = async () => {
        try {
            const data = await getPetsByOwnerId(currentUser!.owner!.id);
            setPets(data.message);
        } catch (error) {
            console.error("Error geting pets:", error);
        }
    };

    function formatDateTime(date: Date) {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const day = date.getDate().toString().padStart(2, "0");
        const hours = date.getHours().toString().padStart(2, "0");
        const minutes = date.getMinutes().toString().padStart(2, "0");

        return `${year}-${month}-${day}T${hours}:${minutes}`;
    }

    const handleClinicChange = (
        event: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
    ) => {
        const value = event.target.value; //clinicId
        const selected = clinics.find((clinic) => clinic.id == value);
        setSelectedClinicWH(selected!.workingHours);
        setAppointment(prev => ({ ...prev, [event.target.name]: value }));
    };

    const handleTimeChange = (
        event: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
    ) => {
        const selectedDate = new Date(event.target.value);
        const formattedDate = formatDateTime(selectedDate);
        setSelectedDateTime(formattedDate);
        setAppointment(prev => ({ ...prev, [event.target.name]: event.target.value }));
    };

    const handleSubmit = async () => {
        try {
            const response = await createAppointment(appointment)
            console.log(response)
            if(response.success){
                toast({
                    title: "Termin rezerviran!",
                    status: "success",
                });
            }else{
                if(response.message == "Time is outside the working hours of the clinic"){
                    toast({
                        title: "Pogrešan termin!",
                        description: "Provjerite radno vrijeme za kliniku na ikoni informacije.",
                        status: "error"
                    });
                }else if(response.message.nextTime){
                    const dateValues = response.message.nextTime.split('T')[0].split('-') //year-month-day
                    const date = `${dateValues[2]}.${dateValues[1]}.${dateValues[0]}.` //day-month-year
                    const time = response.message.nextTime.split('T')[1]
                    toast({
                        title: "Termin zazuzet!",
                        description: `Sljedeći dostupan termin za ${date} je: ${time}`,
                        status: "error"
                    });
                }
            }
        } catch (error) {
            
        }
    };

    return (
        <Flex
            direction={"column"}
            height={"100vh"}
            alignItems={"center"}
            bgColor={"gray.50"}
        >
            <NavBar />
            <Flex
                mt={110}
                mx={2}
                direction={"column"}
                alignItems={"center"}
                borderRadius={"20px"}
                border={"1px"}
                borderColor={"gray.400"}
                padding={6}
                maxWidth={"max-content"}
                height={"max-content"}
                bgColor={"white"}
            >
                <Heading mt={5}>Rezerviraj termin</Heading>
                <Select
                    mt={10}
                    name="clinicId"
                    value={appointment.clinicId}
                    onChange={handleClinicChange}
                    placeholder="Odaberi kliniku"
                    mr={2}
                    mb={5}
                    width={"50vw"}
                >
                    {clinics.map((clinic) => (
                        <option key={clinic.id} value={clinic.id}>
                            {`${clinic.name}`}
                        </option>
                    ))}
                </Select>
                <Select
                    name="petId"
                    value={appointment.petId}
                    onChange={(e) =>{
                        setAppointment(prev => ({ ...prev, [e.target.name]: e.target.value }))
                        setSelectedPet(e.target.value)
                    }} 
                    placeholder="Odaberi ljubimca"
                    mr={2}
                    mb={5}
                    width={"50vw"}
                >
                    {pets.map((pet) => (
                        <option key={pet.id} value={pet.id}>
                            {`${pet.name}`}
                        </option>
                    ))}
                </Select>
                <Flex alignItems={"center"} width={"90%"}>
                    <FormControl
                        mt={4}
                        isRequired
                        isDisabled={(!selectedClinicWH || !selectedPet) ? true : false}
                    >
                        <FormLabel>Termin</FormLabel>
                        <Input
                            type="datetime-local"
                            name="time"
                            value={formatDateTime(new Date(appointment.time))}
                            onChange={handleTimeChange}
                            min={formatDateTime(minAllowedDate)}
                            max={formatDateTime(maxAllowedDate)}
                        />
                        <FormHelperText fontSize={"small"} color={"gray"}>
                            Ne možete rezervirati vrijeme 30 minuta prije kraja rada.
                        </FormHelperText>
                    </FormControl>
                    {selectedClinicWH && (
                        <Popover isLazy>
                            <PopoverTrigger>
                                <IconButton
                                    marginLeft={4}
                                    marginTop={5}
                                    icon={<InfoIcon />}
                                    aria-label={"Info"}
                                    bgColor={'transparent'}
                                />
                            </PopoverTrigger>
                            <PopoverContent>
                                <PopoverHeader fontWeight="semibold">
                                    Radno vrijeme
                                </PopoverHeader>
                                <PopoverArrow />
                                <PopoverCloseButton />
                                <PopoverBody>
                                    {selectedClinicWH.map(wh => (
                                        <Text key={wh.id} fontSize='sm'>
                                            {`${DayOfWeek[wh.day]}: ${wh.openingTime.substring(0, 5)} - ${wh.closingTime.substring(0, 5)}`}
                                            {wh.specialNotes && ` (${wh.specialNotes})`}
                                        </Text>
                                    ))}
                                </PopoverBody>
                            </PopoverContent>
                        </Popover>
                    )}

                </Flex>
                <FormControl
                    mt={4}
                    width={"90%"}
                    isRequired
                >
                    <FormLabel>Razlog dolaska</FormLabel>
                    <Input
                        type="text"
                        name="purpose"
                        value={appointment.purpose}
                        onChange={(e) =>{
                            setPurpose(e.target.value)
                            setAppointment(prev => ({ ...prev, [e.target.name]: e.target.value }))}
                        } 
                    />
                    <FormHelperText fontSize={"small"} color={"gray"}>
                        Navedite kratki razlog
                    </FormHelperText>
                </FormControl>

                <Button
                    leftIcon={<CalendarIcon />}
                    onClick={handleSubmit}
                    mt={6}
                    padding={5}
                    colorScheme="green"
                    textColor={"white"}
                    isDisabled={(!selectedDateTime || !purpose) ? true : false}
                >
                    Rezerviraj
                </Button>
            </Flex>
        </Flex>
    );
}
