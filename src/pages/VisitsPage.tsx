import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { getPetById } from "../api/ownerPets.service"
import { Pet } from "../api/types/api.types";
import NavBar from "../components/NavBar";
import { Avatar, Box, Button, Flex, Heading, Text } from "@chakra-ui/react";
import { useAuth } from "../auth/authProvider";
import { AddIcon } from "@chakra-ui/icons";

export default function Visits() {

    const params = useParams()

    const [pet, setPet] = useState<Pet>();

    const {currentUser} = useAuth()

    useEffect(() => {
        fetchPetById()
    }, [])

    const fetchPetById = async () => {
        try {

            const response = await getPetById(params.petId!)
            setPet(response.message);

        } catch (error) {
            console.error("Error geting pet:", error);
        }
    }


    return (
        <Flex direction={'column'}>
            <NavBar />
            <Flex direction={'column'} marginLeft={5} marginTop={10}>
                <Flex flex='1' gap='4' alignItems='center' flexWrap='wrap'>
                    {pet?.photo && (
                        <Avatar size={'xl'} name={`${pet.name}`} src={`https://lh3.googleusercontent.com/d/${pet.photo!}`} />
                    )}
                    <Box>
                        <Heading size='md'>{pet?.name}</Heading>
                        <Text color={'grey'}>{pet?.species.name}, {pet?.breed.name}</Text>
                    </Box>
                </Flex>
                <Flex justifyContent={'space-between'} alignItems={'end'}>
                <Heading size='lg' className='my-10 ml-5 mb-20'>Dolasci</Heading>
                {!currentUser?.vet && (
                    <Button leftIcon={<AddIcon />} colorScheme='green' width={'200px'} height={'30px'} textColor={'white'} mr={10} size='sm'>
                        Dodaj novi dolazak
                    </Button>
                )}
            </Flex>
            </Flex>
        </Flex>
    )
}