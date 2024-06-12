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
import { Visit } from "../../api/types/api.types";
import { CreateVisitDto } from "../../api/types/api.requests.types";
import { createVisit } from "../../api/visits.service";

interface CreateVisitModalProps {
    isOpen: boolean;
    onClose: () => void;
    petId: string;
    vetId: string;
    addNewVisit: (visit: Visit) => void;
}

export default function CreateVisitModal({
    isOpen,
    onClose,
    petId,
    vetId,
    addNewVisit
}: CreateVisitModalProps) {

    const [visit, setVisit] = useState<CreateVisitDto>({
        weight: 0,
        temperature: 0,
        diagnosis: '',
        notes: ''
    });

    const [buttonDisabled, setButtonDisabled] = useState(true);

    const toast = useToast()

    useEffect(() => {
        setButtonDisabled(
            !(visit.weight && visit.temperature && visit.diagnosis)
        );
    }, [visit]);

    const handleInputChange = (event: ChangeEvent<any>) => {
        const name = event.target.name;
        console.log(name)
        if(name == 'weight' || name == 'temperature'){
            console.log(event.target.value)
            const value = parseFloat(event.target.value)
            setVisit(prev => ({ ...prev, [name]: value }));
        }else{
            const value = event.target.value;
            setVisit(prev => ({ ...prev, [name]: value }));
        }
        
    };

    const handleSubmit = async (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
 

        const response = await createVisit(petId, vetId, visit);
        if(!response){
            toast({
                title: "Pogreška kod dodavanja novog dolaska.",
                status: "error",
            });
        }
        addNewVisit(response);
        onClose();


     
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} scrollBehavior="inside">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Dodaj novi dolazak</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <FormControl mt={4} isRequired>
                        <FormLabel>Težina</FormLabel>
                        <NumberInput 
                            precision={2} 
                            step={0.2}
                        >
                            <NumberInputField 
                                name="weight"
                                value={visit.weight}
                                placeholder="00.00"
                                onChange={handleInputChange}
                            />
                        </NumberInput>
                    </FormControl>                    
                    <FormControl mt={4} isRequired>
                        <FormLabel>Temperatura</FormLabel>
                        <NumberInput 
                            precision={2} 
                            step={0.2}
                        >
                            <NumberInputField 
                                name="temperature"
                                value={visit.temperature}
                                placeholder="00.00"
                                onChange={handleInputChange}
                            />
                        </NumberInput>
                    </FormControl>
                    <FormControl mt={4} isRequired>
                        <FormLabel>Dijagnoza</FormLabel>
                        <Input
                            value={visit.diagnosis}
                            onChange={handleInputChange}
                            name="diagnosis"
                            placeholder='Dijagnoza'
                            size='sm'
                        />
                    </FormControl>
                    <FormControl mt={4}>
                        <FormLabel>Bilješke</FormLabel>
                        <Textarea
                            value={visit.notes}
                            onChange={handleInputChange}
                            name="notes"
                            placeholder='Bilješke'
                            size='sm'
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
