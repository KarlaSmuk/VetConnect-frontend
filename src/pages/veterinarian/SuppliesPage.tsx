import { Box, Button, Flex, Heading, Table, TableContainer, Tbody, Th, Thead, Tr, useDisclosure, Text, Input, Td, Editable, EditableInput, EditablePreview, IconButton, useToast, Textarea } from "@chakra-ui/react"
import NavBar from "../../components/NavBar"
import { AddIcon, ArrowBackIcon, ArrowForwardIcon, DeleteIcon } from "@chakra-ui/icons";
import { useEffect, useState } from "react";
import { deleteSupply, getClinicById, getSuppliesByClinicId, updateSupply, updateSupplyDescription } from "../../api/clinic.service";
import { Clinic, SuppliesDto, Supply } from "../../api/types/api.types";
import CreateSupplyModal from "../../components/modals/CreateSupplyModal";
import { useAuth } from "../../auth/authProvider";
import EditableControls from "../../components/EditableRow";



export default function Supplies() {

    const [clinic, setClinic] = useState<Clinic>()
    const [supplies, setSupplies] = useState<SuppliesDto>([])
    const [filterValue, setFilterValue] = useState('')
    const [filterField] = useState('Ime');
    const [suppliesListPage, setSuppliesListPage] = useState(10);
    const [prevSuppliesListPage, setPrevSuppliesListPage] = useState(0);

    const [newStock, setNewStock] = useState<{ [key: string]: string }>({});
    const [newDescription, setnewDescription] = useState<{ [key: string]: string }>({});
    const [selectedSupplyId, setSelectedSupplyId] = useState('');

    const { currentUser } = useAuth()
    const toast = useToast()

    const {
        isOpen: isCreateOpen,
        onOpen: onCreateOpen,
        onClose: onCreateClose
    } = useDisclosure();

    useEffect(() => {
        getClinic(currentUser!.vet!.clinicId)
        getSupplies(currentUser!.vet!.clinicId)
        
    }, [])

    useEffect(() => {
        setSuppliesListPage(10);
        setPrevSuppliesListPage(0);
    }, [filterValue]);

    const getClinic = async (clinicId: string) => {
        try {
            const response = await getClinicById(clinicId)
            setClinic(response)
        } catch (error) {
            console.error("Error fetching clinic:", error);
        }
    }

    const getSupplies = async (clinicId: string) => {
        try {
            const response = await getSuppliesByClinicId(clinicId)
            setSupplies(response)

        } catch (error) {
            console.error("Error fetching supplies:", error);
        }
    }

    const addNewSupply = (newSupply: Supply) => {
        console.log(newSupply)
        setSupplies(prev => [...prev, newSupply]);
    };


    let filteredSupplies = supplies;
    if(filterField == 'Ime'){
        
        filteredSupplies = supplies.filter(s => s.name.toLowerCase().includes(filterValue.toLowerCase()));
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString).toLocaleDateString()
        const time = new Date(dateString).toLocaleTimeString()

        return date + ', ' + time
    };

    const handleUpdateStock = (value: string, id: string) => {
        setNewStock(prevState => ({
            ...prevState,
            [id]: value
        }));

        setSelectedSupplyId(id)
    };

    const handleUpdateDescription = (value: string, id: string) => {
        setnewDescription(prevState => ({
            ...prevState,
            [id]: value
        }));

        setSelectedSupplyId(id)
    };

    const handleSubmitStock = async (value: string) => {
        try {
            const response = await updateSupply(selectedSupplyId, parseInt(value));
            console.log(response)
        } catch (error) {
            
            toast({
                title: "Pogreška kod ažuriranja stanja",
                description: "Pokušajte ponovno",
                status: "error",
            });
        }
    };

    const handleSubmitDescription= async (value: string) => {
        try {
            const response = await updateSupplyDescription(selectedSupplyId, value);
            console.log(response)
        } catch (error) {
            
            toast({
                title: "Pogreška kod ažuriranja stanja",
                description: "Pokušajte ponovno",
                status: "error",
            });
        }
    };

    const handleDelete = (id: string) => async (e: any) => {
        e.stopPropagation(); //dont use parent default
        try {
            const response = await deleteSupply(id);
            console.log(response)

            setSupplies(prev => {
                const updatedSupplies = prev.filter(s => s.id !== id);

                if (updatedSupplies.length <= 10) {
                    setSuppliesListPage(10);
                    setPrevSuppliesListPage(0);
                }

                return updatedSupplies;
            });

        } catch (error) {
            console.error("Error deleting supply:", error);
            toast({
                title: "Pogreška kod brisanja zalihe",
                description: "Pokušajte ponovno",
                status: "error",
            });
        }

    };

    return (
        <Flex direction={'column'}>
            <NavBar />
            <Flex justifyContent={'center'}>
                <Heading size='xl' className='mt-10 mb-3 ml-5'>{clinic?.name}</Heading>
            </Flex>
            <Flex justifyContent={'space-between'} alignItems={'end'}>
                <Flex direction={'column'}>
                    <Heading size='lg' className='my-10 ml-5'>Zalihe</Heading>
                    <Box ml={5}>
                        <Heading size='sm' mb={3}>Pretraži po imenu:</Heading>
                        <Input
                            w={'200px'}
                            mr={20}
                            placeholder=''
                            value={filterValue}
                            onChange={e => setFilterValue(e.target.value)}
                        />
                    </Box>
                </Flex>
                <Button onClick={onCreateOpen} leftIcon={<AddIcon />} colorScheme='green' width={'200px'} height={'30px'} textColor={'white'} mr={10} size='sm'>
                    Dodaj novu zalihu
                </Button>
                <CreateSupplyModal
                    isOpen={isCreateOpen}
                    onClose={onCreateClose}
                    clinicId={currentUser!.vet!.clinicId}
                    addNewSupply={addNewSupply}
                />
            </Flex>
            <TableContainer mt={5}>
                <Table variant='striped' colorScheme='gray'>
                    <Thead>
                        <Tr>
                            <Th>Ime</Th>
                            <Th>Opis</Th>
                            <Th>Stanje</Th>
                            <Th>Minimalno stanje</Th>
                            <Th>Zadnje izmijenjeno</Th>
                            <Th></Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {filteredSupplies.slice(prevSuppliesListPage, suppliesListPage).map(supply => (
                            <Tr key={supply.id}>
                                <Td>{supply.name}</Td>
                                <Td>
                                    <Editable textAlign='center'
                                        defaultValue={supply.description ? supply.description : '-'}
                                        value={newDescription[supply.id]}
                                        onSubmit={handleSubmitDescription}
                                        onChange={(newValue) => handleUpdateDescription(newValue, supply.id)}
                                    >
                                        <Flex gap={4}>
                                            <EditablePreview />
                                            <Textarea size='sm' as={EditableInput} />
                                            <EditableControls />
                                        </Flex>
                                    </Editable>
                                </Td>
                                <Td>
                                    <Editable textAlign='center'
                                        defaultValue={supply.stockQuantity.toString()}
                                        color={(parseInt(newStock[supply.id]) || supply.stockQuantity) < supply.minimumRequired ? 'red' : 'black'}
                                        value={newStock[supply.id]}
                                        onSubmit={handleSubmitStock}
                                        onChange={(newValue) => handleUpdateStock(newValue, supply.id)}
                                    >
                                        <Flex gap={4}>
                                            <EditablePreview />
                                            <Input as={EditableInput} />
                                            <EditableControls />
                                        </Flex>
                                    </Editable>
                                </Td>
                                <Td>{supply.minimumRequired}</Td>
                                <Td>{formatDate(supply.updated)}</Td>
                                <Td>                                    
                                    <IconButton icon={<DeleteIcon />} onClick={handleDelete(supply.id)} boxSize={6} color={'red'} marginLeft={7} aria-label={'Delete'} bgColor={'transparent'} />
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </TableContainer>
            <Flex flexDirection={'column'} alignItems={'end'} marginRight={20} marginTop={3}>
                <Text fontSize='xs' color={'GrayText'} className=''>Ukupno zaliha: {supplies.length}</Text>
                {(filteredSupplies.length > 10) &&
                    <Flex flexDirection={'row'} marginBottom={5}>
                        <Button onClick={() => {
                            if (suppliesListPage > 10) {
                                setPrevSuppliesListPage(prevSuppliesListPage - 10);
                                setSuppliesListPage(suppliesListPage - 10);
                            }
                        }} className='mt-2'><ArrowBackIcon /></Button>
                        <Button onClick={() => {
                            if (suppliesListPage < filteredSupplies.length) {
                                setPrevSuppliesListPage(prevSuppliesListPage + 10);
                                setSuppliesListPage(suppliesListPage + 10);
                            }

                        }} className='mt-2 ml-5'><ArrowForwardIcon /></Button>
                    </Flex>
                }
            </Flex>
        </Flex>
    )
}