import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { getPetById } from "../api/ownerPets.service"
import { Pet } from "../api/types/api.types";
import NavBar from "../components/NavBar";
import { Avatar, Box, Flex, Heading, Text } from "@chakra-ui/react";
import Visits from "../components/Visits";

export default function VisitsInvoices() {

    const params = useParams()

    const [pet, setPet] = useState<Pet>();

    useEffect(() => {
        fetchPetById()
    }, [])

    const fetchPetById = async () => {
    
        const response = await getPetById(params.petId!)
        setPet(response.message);

      
    }


    return (
        <Flex direction={'column'} mb={5} height={'100vh'} bgColor={'gray.50'}>
            <NavBar />
            <Flex direction={'column'} marginTop={10}>
                <Flex flex='1' gap='4' marginLeft={5} alignItems='center' flexWrap='wrap' bgColor={'white'} width={'400px'} padding={5} paddingLeft={1} border={'1px'} borderColor={'gray.200'}>
                    {pet?.photo && (
                        <Avatar size={'xl'} name={`${pet.name}`} src={`https://lh3.googleusercontent.com/d/${pet.photo!}`} />
                    )}
                    <Box>
                        <Heading size='md'>{pet?.name}</Heading>
                        <Text color={'grey'}>{pet?.species.name}, {pet?.breed.name}</Text>
                    </Box>
                </Flex>
                <Flex mx={5} mt={10} direction={'column'}>
                    <Heading size='lg' flex='1' textAlign='left'>
                        Dolasci
                    </Heading>
                    <Visits petId={params.petId!} />
            </Flex>
            </Flex>
        </Flex>
    )
}