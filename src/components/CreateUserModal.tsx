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
import { ROLE } from "../enums/roles.enum";
import { createUser } from "../api/userService";


interface CreateUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    role: ROLE;
    addNewUser: (user: User) => void;
}

export default function CreateUserModal({
    isOpen,
    onClose,
    role,
    addNewUser
}: CreateUserModalProps) {

    const [user, setUser] = useState<CreateUserDto>({
        firstName: '',
        lastName: '',
        email: '',
        role: role,
        phoneNumber: ''
    });

    const [buttonDisabled, setButtonDisabled] = useState(true);

    useEffect(() => {
        setButtonDisabled(
          !(user.firstName && user.lastName && user.email && user.phoneNumber)
        );
      }, [user]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setUser(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
        try {
            const response = await createUser(user);
            if(response.success){
                addNewUser(response.message)
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
                    <ModalHeader>Dodaj novog vlasnika</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl isRequired>
                            <FormLabel>Ime</FormLabel>
                            <Input
                                placeholder="Ime"
                                name="firstName"
                                value={user?.firstName}
                                onChange={handleInputChange}
                            />
                        </FormControl>
                        <FormControl mt={4} isRequired>
                            <FormLabel>Prezime</FormLabel>
                            <Input
                                placeholder="Prezime"
                                name="lastName"
                                value={user?.lastName}
                                onChange={handleInputChange}
                            />
                        </FormControl>
                        <FormControl mt={4} isRequired>
                            <FormLabel>Email</FormLabel>
                            <Input
                                placeholder="Email"
                                type="email"
                                name="email"
                                value={user?.email}
                                onChange={handleInputChange}
                            />
                        </FormControl>
                        <FormControl mt={4} isRequired>
                            <FormLabel>Broj mobitela</FormLabel>
                            <Input
                                placeholder="Broj mobitela"
                                name="phoneNumber"
                                value={user?.phoneNumber}
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
