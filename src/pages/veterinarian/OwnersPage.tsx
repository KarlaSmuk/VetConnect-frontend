import { Avatar, Heading, Select, Flex, Table, TableContainer, Tbody, Td, Th, Thead, Tr, Input, Box, Button, useDisclosure } from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import NavBarGuests from '../../components/NavBarGuests'
import { getOwners } from '../../api/ownerPetsService'
import { useNavigate } from 'react-router-dom'
import { AddIcon } from '@chakra-ui/icons'
import CreateOwnerModal from '../../components/CreateOwnerModal'

export default function Owners() {

    const [ownersData, setOwnersData] = useState<OwnersDto>([])
    const [filterValue, setFilterValue] = useState('');
    const [filterField, setFilterField] = useState('Ime i prezime');
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

    let filteredOwners = ownersData;
    if (filterField == 'Ime i prezime') {

        const parts = filterValue.trim().split(' ');
        const firstNamePart = parts[0]?.toLowerCase();
        const lastNamePart = parts[1]?.toLowerCase();

        filteredOwners = ownersData.filter(owner => {
            const firstName = owner.firstName?.toLowerCase() ?? "";
            const lastName = owner.lastName?.toLowerCase() ?? "";
            return firstName.includes(firstNamePart) || lastName.includes(lastNamePart || firstNamePart);
        });

    } else if (filterField == 'Broj mobitela') {
        filteredOwners = ownersData.filter(owner => (owner.phoneNumber ?? "").toString().includes(filterValue))
    } else if (filterField == 'Email') {
        filteredOwners = ownersData.filter(owner => (owner.user?.email ?? "").toLowerCase().includes(filterValue.toLowerCase()))

    }

    const addNewOwner = (newOwner: Owner) => {
        setOwnersData(prev => [...prev, newOwner]);
    };

    const handleRowClick = (id: string) => {
        navigate(`/owner/pets/${id}`)
    }

    return (
        // TODO add updating owners
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
                            onChange={e => setFilterField(e.target.value)}
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
                        </Tr>
                    </Thead>
                    <Tbody>
                        {filteredOwners.map(owner => (
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

        </>
    )
}