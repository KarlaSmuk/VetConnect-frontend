import { Box, Button, Flex, Heading, Table, TableContainer, Tbody, Th, Thead, Tr, useDisclosure, Text, Input, Td, Editable, EditableInput, EditablePreview, IconButton, useToast, NumberInput, Textarea } from "@chakra-ui/react"
import NavBar from "../../components/NavBar"
import { AddIcon, ArrowBackIcon, ArrowForwardIcon, DeleteIcon } from "@chakra-ui/icons";
import { useEffect, useState } from "react";
import { deleteTreatment, getClinicById, getTreatmentsByClinicId, updateTreatment, updateTreatmentDescription } from "../../api/clinic.service";
import { Clinic, Treatment, TreatmentsDto } from "../../api/types/api.types"
import { useAuth } from "../../auth/authProvider";
import EditableControls from "../../components/EditableRow";
import CreateTreatmentModal from "../../components/modals/CreateTreatmentModal";



export default function Treatments() {

    const [clinic, setClinic] = useState<Clinic>()
    const [treatments, setTreatments] = useState<TreatmentsDto>([])
    const [filterValue, setFilterValue] = useState('')
    const [filterField] = useState('Ime');
    const [treatmentsListPage, setTreatmentsListPage] = useState(10);
    const [prevTreatmentsListPage, setPrevTreatmentsListPage] = useState(0);

    const [newPrice, setNewPrice] = useState<{ [key: string]: string }>({});
    const [newDescription, setnewDescription] = useState<{ [key: string]: string }>({});
    const [selectedTreatmentId, setSelectedTreatmentId] = useState('');

    const { currentUser } = useAuth()
    const toast = useToast()

    const {
        isOpen: isCreateOpen,
        onOpen: onCreateOpen,
        onClose: onCreateClose
    } = useDisclosure();

    useEffect(() => {
        getClinic(currentUser!.vet!.clinicId)
        getTreatments(currentUser!.vet!.clinicId)
    }, [])

    useEffect(() => {
        setTreatmentsListPage(10);
        setPrevTreatmentsListPage(0);
    }, [filterValue]);

    const getClinic = async (clinicId: string) => {
        try {
            const response = await getClinicById(clinicId)
            setClinic(response)
        } catch (error) {
            console.error("Error fetching clinic:", error);
        }
    }

    const getTreatments = async (clinicId: string) => {
        try {
            const response = await getTreatmentsByClinicId(clinicId)
            setTreatments(response)
        } catch (error) {
            console.error("Error fetching treatments:", error);
        }
    }

    const addNewTreatment = (newTreatment: Treatment) => {
        setTreatments(prev => [...prev, newTreatment]);
    };


    let filteredTreatments = treatments;
    if (filterField == 'Ime') {
        filteredTreatments = treatments.filter(t => t.name.toLowerCase().includes(filterValue.toLowerCase()));
    }

    const handleUpdatePrice = (value: string, id: string) => {
        setNewPrice(prevState => ({
            ...prevState,
            [id]: value
        }));

        setSelectedTreatmentId(id)
    };

    const handleUpdateDescription = (value: string, id: string) => {
        setnewDescription(prevState => ({
            ...prevState,
            [id]: value
        }));

        setSelectedTreatmentId(id)
    };

    function formatNumber(num: string) {
        const number = parseFloat(num)
        let str = number.toFixed(2).toString();
        if (number < 10) {
            str = '0' + str;
        }
        return str;
    }

    const handleSubmitPrice = async (value: string) => {
        try {
            const response = await updateTreatment(selectedTreatmentId, parseFloat(value));
            console.log(response)
        } catch (error) {

            toast({
                title: "Pogreška kod ažuriranja cijene",
                description: "Pokušajte ponovno",
                status: "error",
            });
        }
    };

    const handleSubmitDescription = async (value: string) => {
        try {
            const response = await updateTreatmentDescription(selectedTreatmentId, value);
            console.log(response)
        } catch (error) {

            toast({
                title: "Pogreška kod ažuriranja opisa",
                description: "Pokušajte ponovno",
                status: "error",
            });
        }
    };

    const handleDelete = (id: string) => async (e: any) => {
        e.stopPropagation(); //dont use parent default
        try {
            const response = await deleteTreatment(id);
            console.log(response)

            setTreatments(prev => {
                const updatedTreatments = prev.filter(t => t.id !== id);

                if (updatedTreatments.length <= 10) {
                    setTreatmentsListPage(10);
                    setPrevTreatmentsListPage(0);
                }

                return updatedTreatments;
            });

        } catch (error) {
            console.error("Error deleting treatments:", error);
            toast({
                title: "Pogreška kod brisanja tretmana",
                description: "Pokušajte ponovno",
                status: "error",
            });
        }

    };

    return (
        <Flex direction={'column'} height={'100vh'} bgColor={'gray.50'}>
            <NavBar />
            <Flex justifyContent={'center'}>
                <Heading size='xl' className='mt-10 mb-3 ml-5'>{clinic?.name}</Heading>
            </Flex>
            <Flex justifyContent={'space-between'} alignItems={'end'} mb={5}>
                <Flex direction={'column'}>
                    <Heading size='lg' className='my-10 ml-5'>Tretmani</Heading>
                    <Box ml={5}>
                        <Heading size='sm' mb={3}>Pretraži po imenu:</Heading>
                        <Input
                            bgColor={'white'}
                            borderColor={'gray.500'}
                            w={'200px'}
                            mr={20}
                            placeholder=''
                            value={filterValue}
                            onChange={e => setFilterValue(e.target.value)}
                        />
                    </Box>
                </Flex>
                <Button onClick={onCreateOpen} leftIcon={<AddIcon />} colorScheme='green' width={'200px'} height={'30px'} textColor={'white'} mr={10} size='sm'>
                    Dodaj novi tretman
                </Button>
                <CreateTreatmentModal
                    isOpen={isCreateOpen}
                    onClose={onCreateClose}
                    clinicId={currentUser!.vet!.clinicId}
                    addNewTreatment={addNewTreatment}
                />
            </Flex>
            <Flex bgColor={'gray.50'} direction={'column'}>
                <TableContainer  bgColor={'white'} marginX={2} border={'1px'} borderRadius={'10px'} borderColor={'gray.400'}>
                    <Table>
                        <Thead>
                            <Tr>
                                <Th>Ime</Th>
                                <Th>Opis</Th>
                                <Th>Cijena</Th>
                                <Th></Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {filteredTreatments.slice(prevTreatmentsListPage, treatmentsListPage).map(treatment => (
                                <Tr key={treatment.id}>
                                    <Td>{treatment.name}</Td>
                                    <Td>
                                        <Editable textAlign='center'
                                            defaultValue={treatment.description ? treatment.description : '-'}
                                            value={newDescription[treatment.id]}
                                            onSubmit={handleSubmitDescription}
                                            onChange={(newValue) => handleUpdateDescription(newValue, treatment.id)}
                                        >
                                            <Flex gap={4}>
                                                <EditablePreview />
                                                <Textarea width={'max-content'} size='sm' as={EditableInput} />
                                                <EditableControls />
                                            </Flex>
                                        </Editable>
                                    </Td>
                                    <Td>
                                        <Editable 
                                            textAlign='center'
                                            defaultValue={formatNumber(treatment.price.toString())}
                                            value={newPrice[treatment.id]}
                                            onSubmit={handleSubmitPrice}
                                            onChange={(newValue) => handleUpdatePrice(newValue, treatment.id)}
                                        >
                                            <Flex gap={4}>
                                                <EditablePreview />
                                                <NumberInput  width={'max-content'} as={EditableInput} />
                                                <EditableControls />
                                            </Flex>
                                        </Editable>
                                    </Td>
                                    <Td>                                    
                                        <IconButton icon={<DeleteIcon />} onClick={handleDelete(treatment.id)} boxSize={6} color={'red'} marginLeft={7} aria-label={'Delete'} bgColor={'transparent'} />
                                    </Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                </TableContainer>
                <Flex flexDirection={'column'} alignItems={'end'} marginRight={20} marginTop={3} marginBottom={2}>
                    <Text fontSize='xs' color={'GrayText'} className=''>Ukupno zaliha: {filteredTreatments.length}</Text>
                    {(filteredTreatments.length > 10) &&
                        <Flex flexDirection={'row'} marginBottom={5}>
                            <Button onClick={() => {
                                if (treatmentsListPage > 10) {
                                    setPrevTreatmentsListPage(prevTreatmentsListPage - 10);
                                    setTreatmentsListPage(treatmentsListPage - 10);
                                }
                            }} className='mt-2' bgColor={'gray'} color={'white'}><ArrowBackIcon /></Button>
                            <Button onClick={() => {
                                if (treatmentsListPage < filteredTreatments.length) {
                                    setPrevTreatmentsListPage(prevTreatmentsListPage + 10);
                                    setTreatmentsListPage(treatmentsListPage + 10);
                                }

                            }} className='mt-2 ml-5' bgColor={'gray'} color={'white'}><ArrowForwardIcon /></Button>
                        </Flex>
                    }
                </Flex>
            </Flex>
        </Flex>
    )
}