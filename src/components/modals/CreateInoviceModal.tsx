import {
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    useToast,
    NumberInput,
    NumberInputField,
    Select,
    VStack,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    Box,
} from "@chakra-ui/react";
import { MouseEvent, useEffect, useState } from "react";
import { Invoice, TreatmentsDto } from "../../api/types/api.types";
import {
    CreateInvoiceDto,
    CreateInvoiceItemDto,
} from "../../api/types/api.requests.types";
import { createInvoice } from "../../api/invoices.service";
import { getTreatmentsByClinicId } from "../../api/clinic.service";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";

interface CreateInvoiceModalProps {
    isOpen: boolean;
    onClose: () => void;
    visitId: string;
    clinicId: string;
    addNewInvoice: (invoice: Invoice) => void;
}

export default function CreateInvoiceModal({
    isOpen,
    onClose,
    visitId,
    clinicId,
    addNewInvoice,
}: CreateInvoiceModalProps) {

    const [invoice, setInvoice] = useState<CreateInvoiceDto>({
        visitId: visitId,
        treatments: [],
    });
    const [invoiceItems, setInvoiceItems] = useState<CreateInvoiceItemDto[]>([{treatmentId: '', quantity: 1}]); // each treatment in array
    const [treatments, setTreatments] = useState<TreatmentsDto>([]);

    const [buttonDisabled, setButtonDisabled] = useState(true);

    const toast = useToast();

    useEffect(() => {
        getTreatments();
    }, []);

    useEffect(() => {
        setButtonDisabled(!(invoiceItems[0]?.treatmentId !== ''));
        setInvoice(prev => ({ ...prev, 'treatments': invoiceItems }));
    }, [invoiceItems]);

    const getTreatments = async () => {
        const response = await getTreatmentsByClinicId(clinicId);
        setTreatments(response);
    };

    const handleTreatmentChange = (event: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>, index: number) => {
        const value = event.target.value;
        const updatedItems = [...invoiceItems];
        updatedItems[index]['treatmentId'] = value;
        setInvoiceItems(updatedItems);
    };

    const handleQuantityChange = (newValue: string | number, index: number) => {
        const updatedItems = [...invoiceItems];
        console.log(updatedItems)
        updatedItems[index].quantity = parseInt(newValue.toString());
        setInvoiceItems(updatedItems);
      };
    
    
    const handleAddAnotherTreatment = () => {
        setInvoiceItems(prevItems => [...prevItems, { treatmentId: '', quantity: 1 }]);
    };


    const handleRemoveTreatment = (index: number) => {
        const updatedItems = [...invoiceItems];
        updatedItems.splice(index, 1);
        setInvoiceItems(updatedItems);
    };

    const handleSubmit = async (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();

        console.log(invoice)

        const response = await createInvoice(invoice);
        if (!response) {
            toast({
                title: "Pogreška kod dodavanja novog računa.",
                status: "error",
            });
            onClose();
        } else {
            addNewInvoice(response);
            onClose();
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} scrollBehavior="inside">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Dodaj novi račun</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <VStack spacing={4} mt={4}>
                        {invoiceItems.map((item, index) => (
                            <Box key={index} display="flex" alignItems="center">
                                <Select
                                    name="treatmentId"
                                    value={item.treatmentId}
                                    onChange={(e) => handleTreatmentChange(e, index)}
                                    placeholder="Odaberi tretman"
                                    mr={2}
                                >
                                    {treatments.map((treatment) => (
                                        <option key={treatment.id} value={treatment.id}>
                                            {`${treatment.name} - ${treatment.price}EUR`}
                                        </option>
                                    ))}
                                </Select>
                                <NumberInput
                                    name="quantity"
                                    value={item.quantity}
                                    onChange={(valueString) => handleQuantityChange(valueString, index)}
                                    min={1}
                                    max={10}
                                    mr={2}
                                >
                                    <NumberInputField />
                                    <NumberInputStepper>
                                        <NumberIncrementStepper />
                                        <NumberDecrementStepper />
                                    </NumberInputStepper>
                                </NumberInput>

                                <Button
                                    variant={''}
                                    onClick={handleAddAnotherTreatment}
                                    rightIcon={<AddIcon color={'green'} />}
                                />
                                <Button
                                    variant={''}
                                    onClick={() => handleRemoveTreatment(index)}
                                    rightIcon={<DeleteIcon color={'red'} />}
                                    isDisabled={invoiceItems.length > 1 ? false : true}
                                />
                                
                            </Box>
                        ))}
                    </VStack>
                </ModalBody>
                <ModalFooter>
                    <Button type="button" colorScheme="red" mr={3} onClick={onClose}>
                        Odustani
                    </Button>
                    <Button
                        isDisabled={buttonDisabled}
                        colorScheme="green"
                        mr={3}
                        onClick={handleSubmit}
                    >
                        Potvrdi
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
