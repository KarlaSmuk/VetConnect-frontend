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
import { ROLE } from "../../enums/roles.enum";
import { createUser } from "../../api/user.service";
import validator from "validator";
import { CreateUserDto } from "../../api/types/api.requests.types";
import { User } from "../../api/types/api.types";


interface CreateUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    role: ROLE;
    clinicId?: string;
    addNewUser: (user: User) => void;
}

export default function CreateUserModal({
    isOpen,
    onClose,
    role,
    clinicId,
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

    const toast = useToast()

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

            if(!validator.isEmail(user.email)){
                toast({
                    title: "Pogrešan format Email-a",
                    status: "error",
                });
                return
            }

            const response = await createUser(user, clinicId);
            if(response.success){
                addNewUser(response.message)
                onClose();
            }
            
        } catch (error: any) {

            if(error.response.data.message.includes('duplicate key')){
                toast({
                    title: "Neuspješno dodavanje novog vlasnika",
                    description:"Email se već koristi",
                    status: "error",
                });
            }else{
                toast({
                    title: "Neuspješno dodavanje novog vlasnika.",
                    description:"Pokušajte ponovno",
                    status: "error",
                });
            }
        }
    };

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose} scrollBehavior="inside"> 
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Dodaj novog {role === ROLE.OWNER ? 'vlasnika' : 'veterinara'}</ModalHeader>
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
