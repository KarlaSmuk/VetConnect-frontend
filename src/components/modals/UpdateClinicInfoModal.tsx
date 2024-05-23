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
    useToast
} from "@chakra-ui/react";
import { MouseEvent, useEffect, useState } from "react";
import { updateClinicInfo } from "../../api/clinic.service";
import validator from "validator";

interface UpdateClinicInfoModalProps {
    isOpen: boolean;
    onClose: () => void;
    clinicId: string;
    updateClinic: (clinic: Clinic) => void;
}

export default function UpdateClinicInfoModal({
    isOpen,
    onClose,
    clinicId,
    updateClinic
}: UpdateClinicInfoModalProps) {

    const [clinic, setClinic] = useState<UpdateClinicInfoDto>({
        id: clinicId,
        oib: '',
        name: '',
        email: '',
        address: '',
        county: '',
        phoneNumber: '',
        webAddress: ''
    });

    const toast = useToast()

    const [buttonDisabled, setButtonDisabled] = useState(true);

    useEffect(() => {
        setButtonDisabled(
            !(clinic.oib || clinic.name || clinic.email || clinic.phoneNumber || clinic.address || clinic.county)
        );
    }, [clinic]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setClinic(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        try {
            
            if(!validator.isEmail(clinic.email!)){
                toast({
                    title: "Pogrešan format Email-a.",
                    status: "error",
                });
                return
            }

            const response = await updateClinicInfo(clinic);
            if (response.success) {
                updateClinic(response.message);
                onClose();
            }

        } catch (error) {
            console.error('Error during updating clinic.');
            toast({
                title: "Pogreška kod uređivanja podataka klinike",
                description: "Dodaj radno vrijeme ako nisi.",
                status: "error",
            });
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} scrollBehavior="inside">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Uredi podatke veterinarske stanice</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <FormControl>
                        <FormLabel>OIB</FormLabel>
                        <Input
                            placeholder="OIB"
                            name="oib"
                            value={clinic.oib}
                            onChange={handleInputChange}
                        />
                    </FormControl>
                    <FormControl mt={4}>
                        <FormLabel>Ime</FormLabel>
                        <Input
                            placeholder="Ime"
                            name="name"
                            value={clinic.name}
                            onChange={handleInputChange}
                        />
                    </FormControl>
                    <FormControl mt={4}>
                        <FormLabel>Email</FormLabel>
                        <Input
                            placeholder="Email"
                            name="email"
                            type="email"
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
                    <FormControl mt={4}>
                        <FormLabel>Adresa</FormLabel>
                        <Input
                            placeholder="Adresa"
                            name="address"
                            value={clinic.address}
                            onChange={handleInputChange}
                        />
                    </FormControl>
                    <FormControl mt={4}>
                        <FormLabel>Županija</FormLabel>
                        <Input
                            placeholder="Županija"
                            name="county"
                            value={clinic.county}
                            onChange={handleInputChange}
                        />
                    </FormControl>
                    <FormControl mt={4}>
                        <FormLabel>Broj mobitela</FormLabel>
                        <Input
                            placeholder="Broj mobitela"
                            name="phoneNumber"
                            value={clinic.phoneNumber}
                            onChange={handleInputChange}
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
    );
}
