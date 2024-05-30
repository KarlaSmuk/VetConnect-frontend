import {
    Flex,
    Text,
    Divider,
    Box,
    Card,
    CardBody,
    Heading,
    Stack,
    StackDivider,
    Button,
    Accordion,
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
    Editable,
    EditablePreview,
    EditableTextarea,
    useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { getVisitsByPetId } from "../api/visits.service";
import { useAuth } from "../auth/authProvider";
import { Visit, VisitsDto } from "../api/types/api.types";
import { AddIcon } from "@chakra-ui/icons";
import EditableControls from "./EditableRow";
import InvoicesComponent from "./Invoices";
import CreateVisitModal from "./modals/CreateVisitModal";

interface VisitsProps {
    petId: string;
}

export default function VisitsComponent({ petId }: VisitsProps) {
    const [visits, setVists] = useState<VisitsDto>([]);
    const [openAccordionId, setOpenAccordionId] = useState<string | null>(null);

    const { currentUser } = useAuth();

    const {
        isOpen: isCreateVisitOpen,
        onOpen: onCreateVisitOpen,
        onClose: onCreateVisitClose,
    } = useDisclosure();

    useEffect(() => {
        fetchVisitsByPetId();
    }, []);

    const fetchVisitsByPetId = async () => {
        const response = await getVisitsByPetId(petId);
        setVists(response);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString).toLocaleDateString();
        const time = new Date(dateString).toLocaleTimeString();

        return date + " " + time;
    };

    const handleAccordionChange = (visitId: string) => {
        setOpenAccordionId((prevId) => (prevId === visitId ? null : visitId));
    };

    const addNewVisit = (newVisit: Visit) => {
        setVists((prev) => [newVisit, ...prev]); //add first bc sorted by time descending
    };

    return (
        <Flex direction={"column"}>
            <Flex justifyContent={"flex-end"} mb={5}>
                {currentUser?.vet && (
                    <Button
                        onClick={onCreateVisitOpen}
                        mb={2}
                        leftIcon={<AddIcon />}
                        colorScheme="green"
                        width={"200px"}
                        height={"30px"}
                        textColor={"white"}
                        mr={10}
                        size="sm"
                    >
                        Dodaj novi dolazak
                    </Button>
                )}
                {currentUser?.vet && (
                    <CreateVisitModal
                        isOpen={isCreateVisitOpen}
                        onClose={onCreateVisitClose}
                        petId={petId}
                        vetId={currentUser!.vet!.id}
                        addNewVisit={addNewVisit}
                    />
                )}
            </Flex>
            {visits.map((visit) => (
                <Accordion
                    key={visit.id}
                    display={
                        openAccordionId == null || openAccordionId == visit.id ? "" : "none"
                    }
                    onChange={() => handleAccordionChange(visit.id)}
                    mb={2}
                    flex={1}
                    allowMultiple
                    bgColor={'white'}
                    borderColor={'gray.400'}
                >
                    <AccordionItem>
                        <h2>
                            <AccordionButton>
                                <Heading size="sm" flex="1" textAlign="left" fontWeight={""}>
                                    {formatDate(visit.time)}
                                </Heading>
                                <AccordionIcon />
                            </AccordionButton>
                        </h2>
                        <AccordionPanel pb={4}>
                            <Flex direction={"column"}>
                                <Card variant="outline">
                                    <CardBody>
                                        <Stack divider={<StackDivider />} spacing="4">
                                            <Flex wrap={"wrap"} gap={3}>
                                                <Box mr={10}>
                                                    <Heading size="xs" textTransform="uppercase">
                                                        Veterinarska stanica
                                                    </Heading>
                                                    <Text pt="2" fontSize="sm">
                                                        {visit.veterinarian.clinic.name}
                                                    </Text>
                                                    <Text pt="2" fontSize="sm">
                                                        {visit.veterinarian.clinic.email}
                                                    </Text>
                                                </Box>
                                                <Box>
                                                    <Heading size="xs" textTransform="uppercase">
                                                        Veterinar
                                                    </Heading>
                                                    <Text pt="2" fontSize="sm">
                                                        {visit.veterinarian.user.firstName +
                                                            " " +
                                                            visit.veterinarian.user.lastName}
                                                    </Text>
                                                    <Text pt="2" fontSize="sm">
                                                        {visit.veterinarian.user.email}
                                                    </Text>
                                                </Box>
                                            </Flex>
                                            <Flex wrap={"wrap"} gap={3}>
                                                <Box mr={10}>
                                                    <Heading size="xs" textTransform="uppercase">
                                                        Težina
                                                    </Heading>
                                                    <Text pt="2" fontSize="sm">
                                                        {visit.weight}
                                                    </Text>
                                                </Box>
                                                <Box mr={10}>
                                                    <Heading size="xs" textTransform="uppercase">
                                                        Temperatura
                                                    </Heading>
                                                    <Text pt="2" fontSize="sm">
                                                        {visit.temperature}
                                                    </Text>
                                                </Box>
                                                <Box>
                                                    <Heading size="xs" textTransform="uppercase">
                                                        Dijagnoza
                                                    </Heading>
                                                    <Text pt="2" fontSize="sm">
                                                        {visit.diagnosis}
                                                    </Text>
                                                </Box>
                                            </Flex>
                                            <Box>
                                                <Heading size="xs" textTransform="uppercase">
                                                    Bilješke
                                                </Heading>
                                                <Editable
                                                    pt={2}
                                                    fontSize="sm"
                                                    defaultValue={visit.notes || "-"}
                                                >
                                                    <Flex gap={4} alignItems={"center"}>
                                                        <EditablePreview />
                                                        <EditableTextarea />
                                                        {currentUser?.vet && <EditableControls />}
                                                    </Flex>
                                                </Editable>
                                            </Box>
                                        </Stack>
                                        <Divider mt={2} />
                                        <InvoicesComponent visitId={visit.id} />
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
