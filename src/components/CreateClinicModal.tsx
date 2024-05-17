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
    Box
} from "@chakra-ui/react";
import { MouseEvent, useEffect, useState } from "react";
import { createClinic } from "../api/clinicsService";
import { DayOfWeek } from "../enums/dayOfWeek.enum";

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

    const [buttonDisabled, setButtonDisabled] = useState(true);

    useEffect(() => {
        setButtonDisabled(
            !(clinic.oib && clinic.name && clinic.email && clinic.phoneNumber && clinic.address && clinic.workingHours && clinic.county)
        );
    }, [clinic]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setClinic(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
        try {
            const response = await createClinic(clinic);
            if (response.success) {
                addNewClinic(response.message)
                onClose();
            }

        } catch (error) {
            throw ('Failed to create owner. Please check your input and try again.');
        }
    };

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose}>
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
                                name="webaddress"
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
                            <Input
                                placeholder="Županija"
                                name="county"
                                value={clinic.county}
                                onChange={handleInputChange}
                            />
                        </FormControl>
                        <FormControl mt={4} isRequired>
                            <FormLabel>Broj mobitela</FormLabel>
                            <Input
                                placeholder="Broj mobitela"
                                name="phoneNumber"
                                value={clinic.phoneNumber}
                                onChange={(e) => handleInputChange(e)}
                            />
                        </FormControl>

                        <FormControl mt={4} isRequired>
                            <FormLabel>Radno vrijeme</FormLabel>
                            {clinic.workingHours.map((day, index) => (
                                <Box my={5}>
                                    <Text fontSize={'small'} fontWeight='bold'>{DayOfWeek[day.day]}</Text>
                                    <FormHelperText>Od:</FormHelperText>
                                    <Input name="openingTime" value={day.openingTime} type='time'  isRequired/>
                                    <FormHelperText>Do:</FormHelperText>
                                    <Input name="closingTime" value={day.closingTime} type='time'  isRequired/>
                                    <FormHelperText>Napomena:</FormHelperText>
                                    <Input name='specialNotes' value={day.closingTime} type='text' />
                                    {/* clinic.workingHours[index] */}
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
        </>
    );
}
