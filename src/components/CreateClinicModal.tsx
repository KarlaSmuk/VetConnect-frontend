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
    Input
} from "@chakra-ui/react";
import { MouseEvent, useEffect, useState } from "react";
import { createClinic } from "../api/clinicsService";

interface CreateOwnerModalProps {
    isOpen: boolean;
    onClose: () => void;
    addNewClinic: (clinic: Clinic) => void;
}

export default function CreateClinicModal({
    isOpen,
    onClose,
    addNewClinic
}: CreateOwnerModalProps) {

    const [clinic, setClinic] = useState<CreateClinicDto>({
        oib: '',
        name: '',
        email: '',
        address: '',
        county: '',
        phoneNumber: '',
        webAddress: '',
        workingHours: []
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
            if(response.success){
                addNewClinic(response.message)
                onClose();
            }
            
        } catch (error) {
            throw('Failed to create owner. Please check your input and try again.');
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
                                onChange={handleInputChange}
                            />
                        </FormControl>
                        <FormControl mt={4} isRequired>
                            <FormLabel>Ime</FormLabel>
                            <Input
                                placeholder="Ime"
                                name="name"
                                onChange={handleInputChange}
                            />
                        </FormControl>
                        <FormControl mt={4} isRequired>
                            <FormLabel>Email</FormLabel>
                            <Input
                                placeholder="Email"
                                name="email"
                                onChange={handleInputChange}
                            />
                        </FormControl>
                        <FormControl mt={4}>
                            <FormLabel>Web stranica</FormLabel>
                            <Input
                                placeholder="Web stranica"
                                name="webaddress"
                                onChange={handleInputChange}
                            />
                        </FormControl>
                        <FormControl mt={4} isRequired>
                            <FormLabel>Adresa</FormLabel>
                            <Input
                                placeholder="Adresa"
                                name="address"
                                onChange={handleInputChange}
                            />
                        </FormControl>
                        <FormControl mt={4} isRequired>
                            <FormLabel>Županija</FormLabel>
                            <Input
                                placeholder="Županija"
                                name="county"
                                onChange={handleInputChange}
                            />
                        </FormControl>
                        <FormControl mt={4} isRequired>
                            <FormLabel>Broj mobitela</FormLabel>
                            <Input
                                placeholder="Broj mobitela"
                                name="phoneNumber"
                                onChange={(e) => handleInputChange(e)}
                            />
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
