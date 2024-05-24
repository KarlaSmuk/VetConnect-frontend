import {
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    FormControl,
    FormLabel,
    Input,
    FormHelperText,
    Text,
    Box,
    useToast,
    Select
} from "@chakra-ui/react";
import { MouseEvent, useEffect, useState, ChangeEvent } from "react";
import { createClinic } from "../../api/clinic.service";
import { DayOfWeek } from "../../enums/dayOfWeek.enum";
import validator from "validator";
interface CreateClinicModalProps {
    isOpen: boolean;
    onClose: () => void;
    addNewClinic: (clinic: Clinic) => void;
}

export default function CreateClinicModal({
    isOpen,
    onClose,
    addNewClinic
}: CreateClinicModalProps) {

    const [clinic, setClinic] = useState<CreateClinicDto>({
        oib: '',
        name: '',
        email: '',
        address: '',
        county: '',
        phoneNumber: '',
        webAddress: '',
        workingHours: [
            { day: 1, openingTime: '', closingTime: '', specialNotes: '' },
            { day: 2, openingTime: '', closingTime: '', specialNotes: '' },
            { day: 3, openingTime: '', closingTime: '', specialNotes: '' },
            { day: 4, openingTime: '', closingTime: '', specialNotes: '' },
            { day: 5, openingTime: '', closingTime: '', specialNotes: '' },
            { day: 6, openingTime: '', closingTime: '', specialNotes: '' },
            { day: 7, openingTime: '', closingTime: '', specialNotes: '' }
        ]
    });
    const [counties, setCounties] = useState<string[] | null>(null);

    const [buttonDisabled, setButtonDisabled] = useState(true);

    const toast = useToast()

    useEffect(() => {
        fetch('/counties.json')
        .then((response) => {
            if (!response.ok) {
            throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then((data) => setCounties(data.counties))
        .catch((error) => console.error('Error fetching JSON:', error));
    }, []);

    useEffect(() => {
        setButtonDisabled(
            !(clinic.oib && clinic.name && clinic.email && clinic.phoneNumber && clinic.address && clinic.workingHours && clinic.county)
        );
    }, [clinic]);

    const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = event.target;
        setClinic(prev => ({ ...prev, [name]: value }));
        console.log(clinic)
    };
    
    const handleTimeChange = (index: number, field: string, value: string) => {
        const updatedHours = clinic.workingHours.map((day, i) =>
            i === index ? { ...day, [field]: value } : day
        );

        const updatedClinic = { ...clinic, workingHours: updatedHours };
        setClinic(updatedClinic);

        // Fill other days
        if (index === 0 && field !== 'specialNotes') {
            const propagatedHours = updatedHours.map((day, i) =>
                i !== 0 && day.day !== 7 ? { ...day, [field]: value } : day
            );
            setClinic({ ...clinic, workingHours: propagatedHours });
        }
    };

    const handleSubmit = async (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        try {

            if(!validator.isEmail(clinic.email)){
                toast({
                    title: "Pogrešan format Email-a.",
                    status: "error",
                });
                return
            }

            const response = await createClinic(clinic);
            if (response.success) {
                addNewClinic(response.message);
                onClose();
            }

        } catch (error) {
            console.error('Error during creating clinic.');
            toast({
                title: "Pogreška kod dodavanja nove klinike.",
                status: "error",
            });
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} scrollBehavior="inside">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Dodaj novu veterinarsku stanicu</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <FormControl isRequired>
                        <FormLabel>OIB</FormLabel>
                        <Input
                            placeholder="OIB"
                            name="oib"
                            value={clinic.oib}
                            onChange={handleInputChange}
                        />
                    </FormControl>
                    <FormControl mt={4} isRequired>
                        <FormLabel>Ime</FormLabel>
                        <Input
                            placeholder="Ime"
                            name="name"
                            value={clinic.name}
                            onChange={handleInputChange}
                        />
                    </FormControl>
                    <FormControl mt={4} isRequired>
                        <FormLabel>Email</FormLabel>
                        <Input
                            placeholder="Email"
                            name="email"
                            value={clinic.email}
                            onChange={handleInputChange}
                        />
                    </FormControl>
                    <FormControl mt={4}>
                        <FormLabel>Web stranica</FormLabel>
                        <Input
                            placeholder="Web stranica"
                            name="webAddress"
                            value={clinic.webAddress}
                            onChange={handleInputChange}
                        />
                    </FormControl>
                    <FormControl mt={4} isRequired>
                        <FormLabel>Adresa</FormLabel>
                        <Input
                            placeholder="Adresa"
                            name="address"
                            value={clinic.address}
                            onChange={handleInputChange}
                        />
                    </FormControl>
                    <FormControl mt={4} isRequired>
                        <FormLabel>Županija</FormLabel>
                        <Select 
                            placeholder='Županija'
                            name="county"
                            value={clinic.county}
                            onChange={handleInputChange}
                        >
                           {counties?.map((county, index) => (
                         
                                <option key={index} value={county}>{county}</option>
                         
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl mt={4} isRequired>
                        <FormLabel>Broj mobitela</FormLabel>
                        <Input
                            placeholder="Broj mobitela"
                            name="phoneNumber"
                            value={clinic.phoneNumber}
                            onChange={handleInputChange}
                        />
                    </FormControl>
                    <FormControl mt={4} isRequired>
                        <FormLabel>Radno vrijeme</FormLabel>
                        {clinic.workingHours.map((day, index) => (
                            <Box key={index} my={5}>
                                <Text fontSize={'small'} fontWeight='bold'>{DayOfWeek[day.day]}</Text>
                                <FormHelperText>Od:</FormHelperText>
                                <Input 
                                    name="openingTime" 
                                    value={day.openingTime} 
                                    type='time'
                                    onChange={(e) => handleTimeChange(index , 'openingTime', e.target.value)}
                                />
                                <FormHelperText>Do:</FormHelperText>
                                <Input 
                                    name="closingTime" 
                                    value={day.closingTime} 
                                    type='time'
                                    onChange={(e) => handleTimeChange(index, 'closingTime', e.target.value)}
                                />
                                <FormHelperText>Napomena:</FormHelperText>
                                <Input 
                                    name='specialNotes' 
                                    value={day.specialNotes} 
                                    type='text' 
                                    onChange={(e) => handleTimeChange(index, 'specialNotes', e.target.value)}
                                />
                            </Box>
                        ))}
                    </FormControl>
                </ModalBody>
                <ModalFooter>
                    <Button type="button" colorScheme="red" mr={3} onClick={onClose}>
                        Odustani
                    </Button>
                    <Button isDisabled={buttonDisabled} colorScheme="green" mr={3} onClick={handleSubmit}>
                        Potvrdi
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
