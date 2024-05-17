import { Card, Heading, CardBody, Box, Text, Flex, useDisclosure, Button, CardFooter, IconButton, Divider } from '@chakra-ui/react'
import NavBarGuests from '../components/NavBarGuests'
import { useState, useEffect } from 'react'
import { deleteClinic, getClinics } from '../api/clinicsService'
import { DayOfWeek } from '../enums/dayOfWeek.enum'
import CreateClinicModal from '../components/CreateClinicModal'
import { AddIcon, ArrowForwardIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons'

export default function VetClinics() {

    const [clinicsData, setClinicsData] = useState<ClinicsDto>([])
    const { isOpen, onOpen, onClose } = useDisclosure()

    useEffect(() => {
        loadClinics()
    }, [])

    const loadClinics = async () => {
        try {

            const data: ClinicsDto = await getClinics();
            setClinicsData(data);

        } catch (error) {
            console.error("Error geting clinics:", error);
        }
    }

    const handleDelete = async (id: string) => {
        try {
            const response = await deleteClinic(id);
            setClinicsData(prev => prev.filter(clinic => clinic.id !== id));
            console.log(response)
        } catch (error) {
            console.error("Error deleting user:", error);
        }
        
    };

    const addNewClinic = (newClinic: Clinic) => {
        setClinicsData(prev => [...prev, newClinic]);
    };

    return (
        <>
            <NavBarGuests />
            <Flex alignItems={'end'} justifyContent={'space-between'}>
                <Heading size='md' className='my-10 ml-5'>Popis veterinarskih stanica</Heading>
                <Button onClick={onOpen} leftIcon={<AddIcon />} colorScheme='green' width={'300px'} height={'30px'} textColor={'white'} mr={10} size='sm'>
                    Dodaj novu veterinarsku stanicu
                </Button>
            </Flex>
            <CreateClinicModal
                isOpen={isOpen}
                onClose={onClose}
                addNewClinic={addNewClinic}
            />
            <Box>
                {clinicsData.map(clinic => (
                    <Card key={clinic.id} className='m-10' borderWidth='1px' borderRadius='1px' borderColor={'grey'} boxShadow="lg">
                        <CardBody >
                            <Flex direction="row" justify="space-around" align="center">
                                <Box>
                                    <Heading size='lg'>{clinic.name}</Heading>
                                    <Text fontSize='md'>{clinic.address}</Text>
                                    <Text fontSize='sm'>{clinic.phoneNumber} | {clinic.email}</Text>
                                    <Text fontSize='sm'>{clinic.webAddress}</Text>
                                </Box>
                                <Box >
                                    <Heading size='md' className='mb-3'>Radno vrijeme</Heading>
                                    {clinic.workingHours.map(wh => (
                                        <Text key={wh.id} fontSize='sm'>
                                            {`${DayOfWeek[wh.dayOfWeek]}: ${wh.openingTime.substring(0, 5)} - ${wh.closingTime.substring(0, 5)}`}
                                            {wh.specialNotes && ` (${wh.specialNotes})`}
                                        </Text>
                                    ))}
                                </Box>
                            </Flex>
                        </CardBody>
                        <Divider />
                        <CardFooter>
                            <Flex alignItems={'center'} width="100%">
                                <Flex marginLeft={20} flex={1} justifyContent={'center'}>
                                    <Flex flexDirection={'column'} justifyContent={'center'} alignItems={'center'}>
                                        <IconButton colorScheme='green' aria-label='Uredi podatke o klinici' icon={<EditIcon />} />
                                        <Text marginTop={2} fontSize={'small'} color={'gray'}>Uredi podatke o klinici</Text>
                                    </Flex>
                                    <Flex flexDirection={'column'} justifyContent={'center'} alignItems={'center'} marginLeft={6}>
                                        <IconButton colorScheme='blue' aria-label='Uredi radno vrijeme' icon={<EditIcon />} />
                                        <Text marginTop={2} fontSize={'small'} color={'gray'}>Uredi radno vrijeme</Text>
                                    </Flex>
                                    <Flex flexDirection={'column'} justifyContent={'center'} alignItems={'center'} marginLeft={6}>
                                        <IconButton colorScheme='red' aria-label='Izbriši kliniku' icon={<DeleteIcon />} onClick={() => handleDelete(clinic.id)} />
                                        <Text marginTop={2} fontSize={'small'} color={'gray'}>Izbriši kliniku</Text>
                                    </Flex>
                                </Flex>
                                <Flex justifyContent={'end'}>
                                <Flex flexDirection={'column'} justifyContent={'center'} alignItems={'center'}>
                                    <IconButton aria-label='Veterinari' icon={<ArrowForwardIcon boxSize={6} />} />
                                    <Text color={'gray'}>Veterinari</Text>
                                </Flex>
                                </Flex>
                            </Flex>
                        </CardFooter>


                    </Card>
                ))}
            </Box>

        </>
    )
}