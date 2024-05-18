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
import { updateWorkingHours } from "../../api/clinicsService";
import { DayOfWeek } from "../../enums/dayOfWeek.enum";

interface UpdateWorkingHoursModalProps {
    isOpen: boolean;
    onClose: () => void;
    clinicId: string;
    updateClinic: (clinic: Clinic) => void;
}

export default function UpdateWorkingHours({
    isOpen,
    onClose,
    clinicId,
    updateClinic
}: UpdateWorkingHoursModalProps) {

    const [clinic, setClinic] = useState<UpdateWorkingHoursDto>({
        clinicId: clinicId,
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
            (clinic.workingHours.every(wh => 
                !wh.openingTime && !wh.closingTime && !wh.specialNotes
            ))
        );
    }, [clinic]);

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
            const response = await updateWorkingHours(clinic);
            if (response.success) {
                updateClinic(response.message);
                onClose();
            }

        } catch (error) {
            console.error("Error during updating clinic's working hours.");
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} scrollBehavior="inside">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Uredi radno vrijeme</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <FormControl mt={4}>
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
