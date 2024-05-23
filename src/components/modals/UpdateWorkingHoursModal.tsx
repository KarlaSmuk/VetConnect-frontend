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
    clinicData: Clinic;
    updateClinic: (clinic: Clinic) => void;
}

export default function UpdateWorkingHoursModal({
    isOpen,
    onClose,
    clinicData,
    updateClinic
}: UpdateWorkingHoursModalProps) {

    const [clinic, setClinic] = useState<UpdateWorkingHoursDto>({
        clinicId: clinicData.id,
        workingHours: clinicData.workingHours
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
         
        const updatedClinic = { ...clinic, workingHours: updatedHours.sort((a, b) => a.day - b.day) };
        setClinic(updatedClinic);
    };

    const handleSubmit = async (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        try {
            const response = await updateWorkingHours(clinic);
            if (response.status) {
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
