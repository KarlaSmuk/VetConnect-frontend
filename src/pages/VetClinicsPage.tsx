import { Card, Heading, CardBody, Box, Text, Flex, useDisclosure, Button } from '@chakra-ui/react'
import NavBarGuests from '../components/NavBarGuests'
import { useState, useEffect } from 'react'
import { getClinics } from '../api/clinicsService'
import { DayOfWeek } from '../enums/dayOfWeek.enum'
import CreateClinicModal from '../components/CreateClinicModal'
import { AddIcon } from '@chakra-ui/icons'

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
                    <Card key={clinic.id} className='m-10'>
                        <CardBody className='bg-cyan-50'>
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
                    </Card>
                ))}
            </Box>

        </>
    )
}