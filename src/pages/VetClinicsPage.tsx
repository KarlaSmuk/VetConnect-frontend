import { Card, Heading, CardBody, Box, Text, Flex, useDisclosure, Button, CardFooter, IconButton, Divider } from '@chakra-ui/react'
import NavBarGuests from '../components/NavBar'
import { useState, useEffect } from 'react'
import { deleteClinic, getClinics } from '../api/clinic.service'
import { DayOfWeek } from '../enums/dayOfWeek.enum'
import CreateClinicModal from '../components/modals/CreateClinicModal'
import { AddIcon, ArrowForwardIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons'
import UpdateClinicInfoModal from '../components/modals/UpdateClinicInfoModal'
import { useNavigate } from 'react-router-dom'
import UpdateWorkingHoursModal from '../components/modals/UpdateWorkingHoursModal'
import { useAuth } from '../auth/authProvider'
import { ROLE } from '../enums/roles.enum'

export default function VetClinics() {

    const [clinicsData, setClinicsData] = useState<ClinicsDto>([])
    const {
        isOpen: isCreateOpen,
        onOpen: onCreateOpen,
        onClose: onCreateClose
    } = useDisclosure();
    
    const {
        isOpen: isUpdateInfoOpen,
        onOpen: onUpdateInfoOpen,
        onClose: onUpdateInfoClose
    } = useDisclosure();

    const {
        isOpen: isUpdateHoursOpen,
        onOpen: onUpdateHoursOpen,
        onClose: onUpdateHoursClose
    } = useDisclosure();


    const navigate = useNavigate();

    const { currentUser } = useAuth()

    useEffect(() => {
        loadClinics()
    }, [])

    const loadClinics = async () => {
        try {

            const data = await getClinics();
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

    const updateClinic = (updatedClinic: Clinic) => {
        setClinicsData(prev => prev.map(clinic => clinic.id === updatedClinic.id ? updatedClinic : clinic));
    };

    const navigateVet = (id: string) => {
        navigate(`/veterinarians/${id}`, { state: { clinicId: id} });
      };

    return (
        <>
            <NavBarGuests />
            
                <Flex alignItems={'end'} justifyContent={'space-between'}>
                    <Heading size='md' className='my-10 ml-5'>Popis veterinarskih stanica</Heading>
                    {currentUser?.user.role == ROLE.ADMIN && (
                        <div>
                            <Button onClick={onCreateOpen} leftIcon={<AddIcon />} colorScheme='green' width={'300px'} height={'30px'} textColor={'white'} mr={10} size='sm'>
                                Dodaj novu veterinarsku stanicu
                            </Button>
                            <CreateClinicModal
                                isOpen={isCreateOpen}
                                onClose={onCreateClose}
                                addNewClinic={addNewClinic}
                            />
                        </div>
                    )}
                </Flex>
            
            
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
                                            {`${DayOfWeek[wh.day]}: ${wh.openingTime.substring(0, 5)} - ${wh.closingTime.substring(0, 5)}`}
                                            {wh.specialNotes && ` (${wh.specialNotes})`}
                                        </Text>
                                    ))}
                                </Box>
                            </Flex>
                        </CardBody>
                        <Divider />
                        {(currentUser?.user.role == ROLE.ADMIN || currentUser?.vet)  && (
                        <CardFooter>
                            <Flex alignItems={'center'} width="100%">
                                <Flex marginLeft={20} flex={1} justifyContent={'center'}>
                                    <Flex flexDirection={'column'} justifyContent={'center'} alignItems={'center'}>
                                        <IconButton onClick={onUpdateInfoOpen} colorScheme='green' aria-label='Uredi podatke o klinici' icon={<EditIcon />} />
                                        <UpdateClinicInfoModal
                                            isOpen={isUpdateInfoOpen}
                                            onClose={onUpdateInfoClose}
                                            clinicId={clinic.id}
                                            updateClinic={updateClinic}
                                        />
                                        <Text marginTop={2} fontSize={'small'} color={'gray'}>Uredi podatke o klinici</Text>
                                    </Flex>
                                    
                                    <Flex flexDirection={'column'} justifyContent={'center'} alignItems={'center'} marginLeft={6}>
                                        <IconButton  onClick={onUpdateHoursOpen} colorScheme='blue' aria-label='Uredi radno vrijeme' icon={<EditIcon />} />
                                        <UpdateWorkingHoursModal
                                            isOpen={isUpdateHoursOpen}
                                            onClose={onUpdateHoursClose}
                                            clinicData={clinic}
                                            updateClinic={updateClinic}
                                        />
                                        <Text marginTop={2} fontSize={'small'} color={'gray'}>Uredi radno vrijeme</Text>
                                    </Flex>
                                    {currentUser?.user.role == ROLE.ADMIN && (
                                    <Flex flexDirection={'column'} justifyContent={'center'} alignItems={'center'} marginLeft={6}>
                                        <IconButton colorScheme='red' aria-label='Izbriši kliniku' icon={<DeleteIcon />} onClick={() => handleDelete(clinic.id)} />
                                        <Text marginTop={2} fontSize={'small'} color={'gray'}>Izbriši kliniku</Text>
                                    </Flex>
                                    )}
                                </Flex>
                                <Flex justifyContent={'end'}>
                                <Flex flexDirection={'column'} justifyContent={'center'} alignItems={'center'}>
                                    <IconButton onClick={() => navigateVet(clinic.id)} aria-label='Veterinari' icon={<ArrowForwardIcon boxSize={6} />} />
                                    <Text color={'gray'}>Veterinari</Text>
                                </Flex>
                                </Flex>
                            </Flex>
                        
                        </CardFooter>
                        )}


                    </Card>
                ))}
            </Box>

        </>
    )
}