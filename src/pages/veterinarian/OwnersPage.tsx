import { Avatar, Heading, Select, Flex, Table, TableContainer, Tbody, Td, Th, Thead, Tr, Input, Box, Button } from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import NavBarGuests from '../../components/NavBarGuests'
import { getOwners } from '../../api/ownerPetsService'

export default function Owners() {

    const [ownersData, setOwnersData] = useState<OwnersData>([])
    const [filterValue, setFilterValue] = useState('');
    const [filterField, setFilterField] = useState('Ime i prezime');

    useEffect(() => {
        loadOwners()
    }, [])

    const loadOwners = async () => {
        try {

            const data: OwnersData = await getOwners();
            setOwnersData(data);

        } catch (error) {
            console.error("Error geting clinics:", error);
        }
    }

    let filteredOwners = ownersData;
    if (filterField == 'Ime i prezime') {
        
        const parts = filterValue.trim().split(' ');
        const firstNamePart  = parts[0]?.toLowerCase();
        const lastNamePart  = parts[1]?.toLowerCase();

        filteredOwners = ownersData.filter(owner => {
            const firstName = owner.firstName?.toLowerCase() ?? "";
            const lastName = owner.lastName?.toLowerCase() ?? "";
            return firstName.includes(firstNamePart) || lastName.includes(lastNamePart || firstNamePart);
          });

    } else if (filterField == 'Kontakt') {
        filteredOwners = ownersData.filter(owner => (owner.phoneNumber ?? "").toString().includes(filterValue))
    } else if (filterField == 'Email') {
        filteredOwners = ownersData.filter(owner => (owner.user?.email ?? "").toLowerCase().includes(filterValue.toLowerCase()))

    }

    return (
        <>
            <NavBarGuests />
            <Flex justifyContent={'space-between'} alignItems={'end'}>
                <Flex direction={'column'}>
                    <Heading size='md' className='my-10 ml-5'>Vlasnici</Heading>
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
                            placeholder='Pretraži po'
                            value={filterField}
                            onChange={e => setFilterField(e.target.value)}
                        >
                            <option value='Ime i prezime'>Ime i prezime</option>
                            <option value='Kontakt'>Kontakt</option>
                            <option value='Email'>Email</option>
                        </Select>
                    </Box>
                </Flex>
                <Button colorScheme='green' width={'200px'} height={'30px'} textColor={'white'} mr={10} size='sm'>
                    Dodaj novog vlasnika
                </Button>
                {/* add modal for addding new owners */}
            </Flex>
            <TableContainer mt={5}>
                <Table variant='striped' colorScheme='gray'>
                    <Thead>
                    <Tr>
                        <Th></Th>
                        <Th>Ime i prezime</Th>
                        <Th>Kontakt</Th>
                        <Th>Email</Th>
                    </Tr>
                    </Thead>
                    <Tbody>
                        {filteredOwners.map(owner => (
                            <Tr key={owner.id} className='cursor-pointer'>
                                <Td>
                                    {owner.photo &&
                                        <Avatar src={owner.photo} />
                                    }
                                    {!owner.photo &&
                                        <Avatar size={'md'} />
                                    }
                                </Td>
                                <Td>{owner.firstName} {owner.lastName}</Td>
                                <Td>{owner.phoneNumber}</Td>
                                <Td>{owner.user.email}</Td>
                            </Tr>

                        ))}
                    </Tbody>
                </Table>
            </TableContainer>
            
        </>
    )
  }