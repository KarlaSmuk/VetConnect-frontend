import { Avatar, Heading, Select, Flex, Text, Table, TableContainer, Tbody, Td, Th, Thead, Tr, Input, Box, Button, useDisclosure } from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import NavBarGuests from '../../components/NavBarGuests'
import { getOwners } from '../../api/ownerPetsService'
import { useNavigate } from 'react-router-dom'
import { AddIcon, ArrowBackIcon, ArrowForwardIcon } from '@chakra-ui/icons'
import CreateOwnerModal from '../../components/CreateOwnerModal'

export default function Owners() {

    const [ownersData, setOwnersData] = useState<OwnersDto>([])
    const [filterValue, setFilterValue] = useState('');
    const [filterField, setFilterField] = useState('Ime i prezime');
    const [ownerListPage, setOwnersListPage] = useState(10);
    const [prevOwnerListPage, setPrevOwnersListPage] = useState(0);
    const navigate = useNavigate();
    const { isOpen, onOpen, onClose } = useDisclosure()

    useEffect(() => {
        loadOwners()
    }, [])

    const loadOwners = async () => {
        try {

            const data = await getOwners();
            setOwnersData(data);

        } catch (error) {
            console.error("Error geting clinics:", error);
        }
    }


    useEffect(() => {
        setOwnersListPage(10);
        setPrevOwnersListPage(0);
    }, [filterValue, filterField]);

    let filteredOwners = ownersData;
    if (filterField == 'Ime i prezime') {

        const parts = filterValue.trim().split(' ');
        const firstNamePart = parts[0]?.toLowerCase();
        const lastNamePart = parts[1]?.toLowerCase();

        filteredOwners = ownersData.filter(owner => {
            const firstName = owner.user.firstName?.toLowerCase() ?? "";
            const lastName = owner.user.lastName?.toLowerCase() ?? "";
            return firstName.includes(firstNamePart) || lastName.includes(lastNamePart || firstNamePart);
        });

    } else if (filterField == 'Broj mobitela') {
        filteredOwners = ownersData.filter(owner => (owner.user.phoneNumber ?? "").toString().includes(filterValue))
    } else if (filterField == 'Email') {
        filteredOwners = ownersData.filter(owner => (owner.user.email ?? "").toLowerCase().includes(filterValue.toLowerCase()))
    }

    const addNewOwner = (newOwner: Owner) => {
        setOwnersData(prev => [...prev, newOwner]);
    };

    const handleRowClick = (id: string) => {
        navigate(`/owner/pets/${id}`)
    }

    return (
        <>
            <NavBarGuests />
            <Flex justifyContent={'space-between'} alignItems={'end'}>
                <Flex direction={'column'}>
                    <Heading size='lg' className='my-10 ml-5'>Vlasnici</Heading>
                    <Box ml={5}>
                        <Heading size='sm' mb={3}>Pretraži:</Heading>
                        <Input
                            w={'200px'}
                            mr={20}
                            placeholder=''
                            value={filterValue}
                            onChange={e => setFilterValue(e.target.value)}
                        />
                        <Select
                            w={'200px'}
                            mr={20}
                            mt={5}
                            className='cursor-pointer'
                            placeholder='Pretraži po'
                            value={filterField}
                            onChange={e => {
                                setFilterField(e.target.value);
                            }}
                        >
                            <option value='Ime i prezime'>Ime i prezime</option>
                            <option value='Broj mobitela'>Broj mobitela</option>
                            <option value='Email'>Email</option>
                        </Select>
                    </Box>
                </Flex>
                <Button onClick={onOpen} leftIcon={<AddIcon />} colorScheme='green' width={'200px'} height={'30px'} textColor={'white'} mr={10} size='sm'>
                    Dodaj novog vlasnika
                </Button>
                <CreateOwnerModal
                    isOpen={isOpen}
                    onClose={onClose}
                    addNewOwner={addNewOwner}
                />
                {/* add modal for addding new owners */}
            </Flex>
            <TableContainer mt={5}>
                <Table variant='striped' colorScheme='gray'>
                    <Thead>
                        <Tr>
                            <Th></Th>
                            <Th>Ime i prezime</Th>
                            <Th>Broj mobitela</Th>
                            <Th>Email</Th>
                            <Th></Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {filteredOwners.slice(prevOwnerListPage, ownerListPage).map(owner => (
                            <Tr key={owner.id}
                                className='cursor-pointer'
                                onClick={() => handleRowClick(owner.id)}
                            >
                                <Td>
                                    <Avatar
                                        src={`https://lh3.googleusercontent.com/d/${owner.user.photo}`}
                                        name={`${owner.user.firstName} ${owner.user.lastName}`}
                                    />
                                </Td>
                                <Td>{owner.user.firstName} {owner.user.lastName}</Td>
                                <Td>{owner.user.phoneNumber}</Td>
                                <Td>{owner.user.email}</Td>
                            </Tr>

                        ))}
                    </Tbody>
                </Table>
            </TableContainer>
            <Flex flexDirection={'column'} justifyContent={'end'} alignItems={'end'} marginRight={20} marginTop={3}>
                <Text fontSize='xs' color={'GrayText'} className=''>Ukupno vlasnika: {filteredOwners.length}</Text>
                <Flex flexDirection={'row'} marginBottom={5}>
                    <Button onClick={() =>{
                        if(ownerListPage > 10){
                            setPrevOwnersListPage(prevOwnerListPage - 10);
                            setOwnersListPage(ownerListPage - 10);
                        }
                    }} className='mt-2'><ArrowBackIcon /></Button>
                    <Button onClick={() =>{
                        if(ownerListPage < filteredOwners.length){
                            setPrevOwnersListPage(prevOwnerListPage + 10);
                            setOwnersListPage(ownerListPage + 10);
                        }
                        
                    }}  className='mt-2 ml-5'><ArrowForwardIcon /></Button>
                </Flex>
            </Flex>
        </>
    )
}