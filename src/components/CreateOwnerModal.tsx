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
import { useState } from "react";
import { createOwner } from "../api/ownerPetsService";
import { ROLE } from "../enums/roles.enum";

interface CreateOwnerModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CreateOwnerModal({
    isOpen,
    onClose,
}: CreateOwnerModalProps) {

    const [owner, setOwner] = useState<CreateOwnerDto>({
        firstName: "",
        lastName: "",
        email: "",
        role: ROLE.OWNER,
        phoneNumber: "",
    });

    const [buttonDisabled, setButtonDisabled] = useState(true);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        
        setButtonDisabled(!(owner.firstName && owner.lastName && owner.email && owner.phoneNumber));

        const { name, value } = e.target;
        setOwner({ ...owner, [name]: value });
    };

    const handleSubmit = async () => {

        try {
            await createOwner(owner);
        } catch (error) {
            throw("Error while creating owner. Try again!");
        }
    };

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Dodaj novog vlasnika</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl isRequired>
                            <FormLabel>Ime</FormLabel>
                            <Input
                                placeholder="Ime"
                                name="firstName"
                                value={owner?.firstName}
                                onChange={(e) => handleInputChange(e)}
                            />
                        </FormControl>
                        <FormControl mt={4} isRequired>
                            <FormLabel>Prezime</FormLabel>
                            <Input
                                placeholder="Prezime"
                                name="lastName"
                                value={owner?.lastName}
                                onChange={(e) => handleInputChange(e)}
                            />
                        </FormControl>
                        <FormControl mt={4} isRequired>
                            <FormLabel>Email</FormLabel>
                            <Input
                                placeholder="Email"
                                type="email"
                                name="email"
                                value={owner?.email}
                                onChange={(e) => handleInputChange(e)}
                            />
                        </FormControl>
                        <FormControl mt={4} isRequired>
                            <FormLabel>Broj mobitela</FormLabel>
                            <Input
                                placeholder="Broj mobitela"
                                name="phoneNumber"
                                value={owner?.phoneNumber}
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
