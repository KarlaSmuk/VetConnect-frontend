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
    useToast,
    Textarea,
    NumberInput,
    NumberInputField
} from "@chakra-ui/react";
import { MouseEvent, useEffect, useState, ChangeEvent } from "react";
import { createTreatment } from "../../api/clinic.service";
import { Treatment } from "../../api/types/api.types";
import { CreateTreatmentDto } from "../../api/types/api.requests.types";

interface CreateTreatmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    clinicId: string;
    addNewTreatment: (treatment: Treatment) => void;
}

export default function CreateTreatmentModal({
    isOpen,
    onClose,
    clinicId,
    addNewTreatment
}: CreateTreatmentModalProps) {

    const [treatment, setTreatment] = useState<CreateTreatmentDto>({
        name: '',
        description: '',
        price: 0.00
    });

    const [buttonDisabled, setButtonDisabled] = useState(true);

    const toast = useToast()

    useEffect(() => {
        setButtonDisabled(
            !(treatment.name && treatment.price)
        );
    }, [treatment]);

    const handleInputChange = (event: ChangeEvent<any>) => {
        const name = event.target.name;
        if(name == 'price'){
            const value = parseFloat(event.target.value)
            setTreatment(prev => ({ ...prev, [name]: value }));
        }else{
            const value = event.target.value;
            setTreatment(prev => ({ ...prev, [name]: value }));
        }
        
    };

    const handleSubmit = async (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        try {

            const response = await createTreatment(clinicId, treatment);
            addNewTreatment(response);
            onClose();


        } catch (error) {
            console.error('Error during creating treatment.');
            toast({
                title: "Pogreška kod dodavanja novog tretmana.",
                status: "error",
            });
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} scrollBehavior="inside">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Dodaj novi tretman</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <FormControl isRequired>
                        <FormLabel>Ime</FormLabel>
                        <Input
                            placeholder="Ime"
                            name="name"
                            value={treatment.name}
                            onChange={handleInputChange}
                        />
                    </FormControl>
                    <FormControl mt={4}>
                        <FormLabel>Opis</FormLabel>
                        <Textarea
                            value={treatment.description}
                            onChange={handleInputChange}
                            name="description"
                            placeholder='Opis'
                            size='sm'
                        />
                    </FormControl>
                    <FormControl mt={4} isRequired>
                        <FormLabel>Cijena</FormLabel>
                        <NumberInput 
                            precision={2} 
                            step={0.2}
                        >
                            <NumberInputField 
                                name="price"
                                value={treatment.price}
                                placeholder="00.00"
                                onChange={handleInputChange}
                            />
                        </NumberInput>
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
