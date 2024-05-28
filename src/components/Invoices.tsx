import {
    Accordion,
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
    Text,
    Box,
    Card,
    CardBody,
    Flex,
    Heading,
    Stack,
    StackDivider,
    Button,
    useDisclosure
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { useEffect, useState } from "react";
import { getInvoicesByVisitId } from "../api/invoices.service";
import { Invoice, InvoicesDto } from "../api/types/api.types";
import { useAuth } from "../auth/authProvider";
import CreateInvoiceModal from "./modals/CreateInoviceModal";

interface InvoicesProps {
    visitId: string;
}

export default function InvoicesComponent({ visitId }: InvoicesProps) {

    const [invoices, setInvoices] = useState<InvoicesDto>([]);

    const { currentUser } = useAuth();

    const {
        isOpen: isCreateInvoiceOpen,
        onOpen: onCreateInvoiceOpen,
        onClose: onCreateInvoiceClose,
    } = useDisclosure();


    useEffect(() => {
        fetchInvoicesByVisitId();
    }, []);

    const fetchInvoicesByVisitId = async () => {
        const response = await getInvoicesByVisitId(visitId);
        setInvoices(response);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString).toLocaleDateString();
        const time = new Date(dateString).toLocaleTimeString();

        return date + " " + time;
    };

    const addNewInvoice = (newInvoice: Invoice) => {
        setInvoices((prev) => [newInvoice, ...prev]); //add first bc sorted by time descending
    };

    return (
        <Flex direction={"column"}>
            {currentUser?.vet && (
                <Flex direction={"column"} alignItems={"flex-end"}>
                    <Button
                        mt={5}
                        leftIcon={<AddIcon />}
                        colorScheme="teal"
                        width={"150px"}
                        height={"30px"}
                        textColor={"white"}
                        mr={10}
                        size="sm"
                        onClick={onCreateInvoiceOpen}
                    >
                        Dodaj račun
                    </Button>
                </Flex>
            )}
            {currentUser?.vet && (
                <CreateInvoiceModal
                    isOpen={isCreateInvoiceOpen}
                    onClose={onCreateInvoiceClose}
                    visitId={visitId}
                    clinicId={currentUser!.vet!.clinicId}
                    addNewInvoice={addNewInvoice}
                />
            )}

            {invoices.length > 0 && (
                <Heading mt={5} mb={5} size="lg" flex="1" textAlign="left">
                    Računi
                </Heading>
            )}
            {invoices &&
                invoices.map((item) => (
                    <Accordion key={item.invoice.id} mb={2} flex={1} allowMultiple>
                        <AccordionItem>
                            <h2>
                                <AccordionButton>
                                    <Heading size="sm" flex="1" textAlign="left" fontWeight={""}>
                                        {formatDate(item.invoice.createdAt)}
                                    </Heading>
                                    <AccordionIcon />
                                </AccordionButton>
                            </h2>
                            <AccordionPanel pb={4}>
                                <Flex direction={"column"}>
                                    <Card variant="outline">
                                        <CardBody>
                                            <Stack divider={<StackDivider />} spacing="4">
                                                <Flex>
                                                    <Box>
                                                        <Heading size="xs" textTransform="uppercase">
                                                            Ukupna cijena
                                                        </Heading>
                                                        <Text pt="2" fontSize="sm">
                                                            {item.invoice.totalPrice}
                                                        </Text>
                                                    </Box>
                                                </Flex>
                                                <Flex>
                                                    <Box>
                                                        <Heading size="xs" textTransform="uppercase">
                                                            {invoices.length > 1 ? "Tretmani" : "Tretman"}
                                                        </Heading>
                                                        {item.treatments &&
                                                            item.treatments.map((treatment, index) => (
                                                                <Flex
                                                                    mt={2}
                                                                    key={treatment.id}
                                                                    direction={"column"}
                                                                >
                                                                    {index + 1 + ". "}
                                                                    {treatment.treatmentName}
                                                                    <Text ml={5}>
                                                                        količina: {treatment.quantity}
                                                                    </Text>
                                                                    <Text ml={5}>
                                                                        Ukupna cijena: {treatment.totalPrice}
                                                                    </Text>
                                                                </Flex>
                                                            ))}
                                                    </Box>
                                                </Flex>
                                            </Stack>
                                        </CardBody>
                                    </Card>
                                </Flex>
                            </AccordionPanel>
                        </AccordionItem>
                    </Accordion>
                ))}
        </Flex>
    );
}
