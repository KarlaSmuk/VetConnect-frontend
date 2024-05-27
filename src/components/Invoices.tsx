import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Text, Box, Card, CardBody, Flex, Heading, Stack, StackDivider } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { getInvoicesByVisitId } from "../api/invoices.service";
import { InvoicesDto } from "../api/types/api.types";

interface InvoicesProps {
    visitId: string;
}

export default function InvoicesComponent({
    visitId
}: InvoicesProps) {

    const [invoices, setInvoices] = useState<InvoicesDto>([])

    useEffect(() => {
        fetchInvoicesByVisitId()
    }, [])

    const fetchInvoicesByVisitId = async () => {


        const response = await getInvoicesByVisitId(visitId)
        console.log(response)
        setInvoices(response);

    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString).toLocaleDateString()
        const time = new Date(dateString).toLocaleTimeString()

        return date + ' ' + time
    };


    return (
        <Flex direction={'column'}>
            {invoices.length > 0 && (
                <Heading mt={5} mb={5} size='lg' flex='1' textAlign='left'>
                    Računi
                </Heading>
            )}
             {invoices && invoices.map(item => (
                    <Accordion key={item.invoice.id} mb={2} flex={1} allowMultiple> 
                        <AccordionItem >
                            <h2>
                                <AccordionButton>
                                    <Heading size='sm' flex='1' textAlign='left' fontWeight={''}>
                                        {formatDate(item.invoice.createdAt)}
                                    </Heading>
                                    <AccordionIcon />
                                </AccordionButton>
                            </h2>
                            <AccordionPanel pb={4}>
                                <Flex direction={'column'}>
                                    <Card variant='outline'>
                                        <CardBody>
                                            <Stack divider={<StackDivider />} spacing='4'>
                                                <Flex>
                                                    <Box>
                                                        <Heading size='xs' textTransform='uppercase'>
                                                            Ukupna cijena
                                                        </Heading>
                                                        <Text pt='2' fontSize='sm'>
                                                            {item.invoice.totalPrice}
                                                        </Text>
                                                    </Box>
                                                </Flex>
                                                <Flex>
                                                    <Box>
                                                        <Heading size='xs' textTransform='uppercase'>
                                                            {invoices.length > 1 ? 'Tretmani' : 'Tretman'}
                                                        </Heading>
                                                        {item.treatments && item.treatments.map((treatment, index) => (
                                                            <Flex mt={2} key={treatment.id} direction={'column'}>
                                                                {(index + 1) + '. '}{treatment.treatmentName}
                                                                <Text ml={5}>količina: {treatment.quantity}</Text>
                                                                <Text ml={5}>Ukupna cijena: {treatment.totalPrice}</Text>
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
