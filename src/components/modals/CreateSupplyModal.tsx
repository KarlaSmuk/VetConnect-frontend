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
import { createSupply } from "../../api/clinic.service";
import { Supply } from "../../api/types/api.types";
import { CreateSupplyDto } from "../../api/types/api.requests.types";
interface CreateSupplyModalProps {
    isOpen: boolean;
    onClose: () => void;
    clinicId: string;
    addNewSupply: (supply: Supply) => void;
}

export default function CreateSupplyModal({
    isOpen,
    onClose,
    clinicId,
    addNewSupply
}: CreateSupplyModalProps) {

    const [supply, setSupply] = useState<CreateSupplyDto>({
        name: '',
        description: '',
        minimumRequired: 0,
        stockQuantity: 0
    });

    const [buttonDisabled, setButtonDisabled] = useState(true);

    const toast = useToast()

    useEffect(() => {
        setButtonDisabled(
            !(supply.name && supply.minimumRequired && supply.stockQuantity)
        );
    }, [supply]);

    const handleInputChange = (event: ChangeEvent<any>) => {
        const name = event.target.name;
        if(name == 'minimumRequired' || name == 'stockQuantity'){
            const value = parseInt(event.target.value)

            setSupply(prev => ({ ...prev, [name]: value }));
        }else{
            const value = event.target.value;
            setSupply(prev => ({ ...prev, [name]: value }));
        }
        
    };

    const handleSubmit = async (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        try {

            const response = await createSupply(clinicId, supply);
            addNewSupply(response);
            onClose();


        } catch (error) {
            console.error('Error during creating supply.');
            toast({
                title: "Pogreška kod dodavanja nove zalihe.",
                status: "error",
            });
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} scrollBehavior="inside">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Dodaj novu zalihu</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <FormControl isRequired>
                        <FormLabel>Ime</FormLabel>
                        <Input
                            placeholder="Ime"
                            name="name"
                            value={supply.name}
                            onChange={handleInputChange}
                        />
                    </FormControl>
                    <FormControl mt={4} isRequired>
                        <FormLabel>Opis</FormLabel>
                        <Textarea
                            value={supply.description}
                            onChange={handleInputChange}
                            name="description"
                            placeholder='Opis'
                            size='sm'
                        />
                    </FormControl>
                    <FormControl mt={4} isRequired>
                        <FormLabel>Najmanje dozvoljena vrijednost</FormLabel>
                        <NumberInput 
                        >
                            <NumberInputField 
                                name="minimumRequired"
                                value={supply.minimumRequired}
                                placeholder="0"
                                onChange={handleInputChange}
                            />
                        </NumberInput>
                    </FormControl>
                    <FormControl mt={4} isRequired>
                        <FormLabel>Na stanju</FormLabel>
                        <NumberInput 
                        >
                            <NumberInputField 
                                name="stockQuantity"
                                value={supply.stockQuantity}
                                placeholder="0"
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
