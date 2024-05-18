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
import { updateUser } from "../../api/userService";
import { ROLE } from "../../enums/roles.enum";

interface CreateUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    userId: string;
    role: ROLE;
    updateExistingUser: (user: User) => void;
}

export default function UpdateUserModal({
    isOpen,
    onClose,
    userId,    
    role,
    updateExistingUser
}: CreateUserModalProps) {

    const [user, setUser] = useState<UpdateUserDto>({
        id: userId,
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: ''
    });

    const [buttonDisabled, setButtonDisabled] = useState(true);

    useEffect(() => {
        setUser(prevUser => ({
            ...prevUser,
            id: userId
        }));
    }, [userId]);

    useEffect(() => {
        setButtonDisabled(
          !(user.firstName || user.lastName || user.email || user.phoneNumber)
        );
      }, [user]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setUser(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        event.stopPropagation();
        try {
            const response = await updateUser(user);
            console.log(response)
            if(response.success){
                updateExistingUser(response.message)
                onClose();
            }
        } catch (error) {
            throw('Failed to update user. Please check your input and try again.');
        }
    };

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Uredi podatke {role == ROLE.OWNER ? 'vlasnika' : 'veterinara'}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl>
                            <FormLabel>Ime</FormLabel>
                            <Input
                                placeholder="Ime"
                                name="firstName"
                                value={user?.firstName}
                                onChange={handleInputChange}
                            />
                        </FormControl>
                        <FormControl mt={4}>
                            <FormLabel>Prezime</FormLabel>
                            <Input
                                placeholder="Prezime"
                                name="lastName"
                                value={user?.lastName}
                                onChange={handleInputChange}
                            />
                        </FormControl>
                        <FormControl mt={4}>
                            <FormLabel>Email</FormLabel>
                            <Input
                                placeholder="Email"
                                type="email"
                                name="email"
                                value={user?.email}
                                onChange={handleInputChange}
                            />
                        </FormControl>
                        <FormControl mt={4}>
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