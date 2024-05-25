import { Avatar, Badge, Box, Button, Card, CardBody, CardFooter, CardHeader, CircularProgress, Divider, Flex, FormControl, FormLabel, Heading, IconButton, Text, useDisclosure, useToast } from "@chakra-ui/react"
import NavBar from "../components/NavBar"
import { useNavigate, useParams } from "react-router-dom";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { getPetsByOwnerId, uploadPetImage } from "../api/ownerPets.service";
import { Pet, PetsDto } from "../api/types/api.types";
import { AddIcon, ArrowForwardIcon, DownloadIcon } from "@chakra-ui/icons";
import CreatePetModal from "../components/modals/CreatePetModal";
import { useAuth } from "../auth/authProvider";
import { PetStatus } from "../enums/petStatus.enum";

export default function Pets() {

    const [pets, setPets] = useState<PetsDto>([])
    const params = useParams();
    const [uploading, setUploading] = useState<{ [key: string]: boolean }>({});
    const [fileUpload, setFileUpload] = useState<{ [key: string]: boolean }>({});
    const [file, setFile] = useState<File | undefined>()

    const { currentUser } = useAuth()

    const toast = useToast()

    const {
        isOpen: isCreateOpen,
        onOpen: onCreateOpen,
        onClose: onCreateClose
    } = useDisclosure();

    const navigate = useNavigate()

    useEffect(() => {
        fetchPetsForOwner()
    }, [])

    const fetchPetsForOwner = async () => {
        try {

            const response = await getPetsByOwnerId(params.ownerId!)
            setPets(response.message);

        } catch (error) {
            console.error("Error geting clinics:", error);
        }
    }

    const calculateAge = (dateOfBirth: string) => {
        const now = new Date();
        const birthDate = new Date(dateOfBirth);
        let age = now.getFullYear() - birthDate.getFullYear();
        const monthDiff = now.getMonth() - birthDate.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birthDate.getDate())) {
            age--;
        }

        return age;
    };

    const addNewPet = (pet: Pet) => {
        setPets(prev => [...prev, pet]);
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>, petId: string) => {
        e.preventDefault();


        setUploading(prev => ({ ...prev, [petId]: true }));

        if (typeof file === 'undefined') return;

        const formData = new FormData();
        formData.append('file', file)

        try {
            const result = await uploadPetImage(petId, formData);
            if (result.success) {
                setFileUpload(prev => ({ ...prev, [petId]: false }));
                setUploading(prev => ({ ...prev, [petId]: false }));
                toast({
                    title: "Slika spremljena.",
                    status: "success",
                });
            }
        } catch (error) {
            console.log("Error uploading photo:", error)
            setUploading(prev => ({ ...prev, [petId]: false }));
            toast({
                title: "Pogreška kod spremanja slike.",
                status: "error",
            });
        }

    };

    const handleImageInput = (e: ChangeEvent<HTMLInputElement>, petId: string) => {
        const target = e.target as HTMLInputElement & {
            files: FileList;
        }

        setFile(target.files[0])
        setFileUpload(prev => ({ ...prev, [petId]: true }));

    };

    const navigatePet = (petId: string) => {
        navigate(`/pet/${petId}`);
    };


    return (
        <Flex direction={"column"}>

            <CreatePetModal
                isOpen={isCreateOpen}
                onClose={onCreateClose}
                ownerId={params.ownerId!}
                addNewPet={addNewPet}
            />
            <NavBar />
            <Flex justifyContent={'space-between'} alignItems={'end'}>
                <Heading size='lg' className='my-10 ml-5 mb-20'>Ljubimci</Heading>
                {currentUser?.vet && (
                    <Button onClick={onCreateOpen} leftIcon={<AddIcon />} colorScheme='green' width={'200px'} height={'30px'} textColor={'white'} mr={10} size='sm'>
                        Dodaj novog ljubimca
                    </Button>
                )}
            </Flex>
            <Flex direction={'column'} alignItems={"center"} marginBottom={10}>
                {pets && pets.map(pet => (
                    <Card key={pet.id} borderWidth='1px' borderRadius='10px' borderColor={'grey.10'} width={'60vw'} padding={5} marginTop={10}>
                        <CardHeader>
                            <Flex>
                                <Flex flex='1' gap='4' alignItems='center' flexWrap='wrap'>
                                    {pet.photo && (
                                        <Avatar size={'lg'} name={`${pet.name}`} src={`https://lh3.googleusercontent.com/d/${pet.photo!}`} />
                                    )}
                                    <Box>
                                        <Flex direction={'row'} alignItems={'center'}>
                                            <Heading size='md'>{pet.name}</Heading>
                                            {pet.status === PetStatus.LOST && (
                                                <Badge ml={3} alignContent={'center'} borderRadius={5} colorScheme='red'>{pet.status}</Badge>
                                            )}
                                        </Flex>
                                        <Text color={'grey'}>{pet.species.name}, {pet.breed.name}</Text>
                                    </Box>
                                </Flex>
                            </Flex>
                        </CardHeader>
                        <CardBody>
                            <Box>
                                <Flex justifyContent={'space-evenly'} wrap={'wrap'}>
                                    <Flex direction={'column'} alignItems={'center'} margin={2} bgColor={pet.gender === 'Male' ? 'rgb(162, 210, 255)' : 'rgb(255, 175, 204)'} padding={2} borderRadius={5} width={'100px'}>
                                        <Text fontWeight={'bold'}>Spol</Text>
                                        <Text>{pet.gender}</Text>
                                    </Flex>
                                    <Flex direction={'column'} alignItems={'center'} margin={2} bgColor={'rgb(213, 189, 175)'} padding={2} borderRadius={5} width={'100px'}>
                                        <Text fontWeight={'bold'}>Boja</Text>
                                        <Text>{pet.color}</Text>
                                    </Flex>
                                    <Flex direction={'column'} alignItems={'center'} margin={2} bgColor={'rgb(227, 213, 202)'} padding={2} borderRadius={5} width={'100px'}>
                                        <Text fontWeight={'bold'}>Godine</Text>
                                        <Text>{calculateAge(pet.dateOfBirth)}</Text>
                                    </Flex>
                                    <Flex direction={'column'} margin={2} alignItems={'center'} bgColor={'rgb(245, 235, 224)'} padding={2} borderRadius={5} width={'100px'}>
                                        <Text fontWeight={'bold'}>{pet.gender === 'Male' ? 'Kastriran' : 'Sterilizirana'}</Text>
                                        <Text>{pet.neutered ? 'Da' : 'Ne'}</Text>
                                    </Flex>
                                </Flex>
                            </Box>
                        </CardBody>
                        <Divider />
                        <CardFooter justifyContent={'space-between'} alignItems={'flex-end'}>
                            <Box width={'30vw'} marginTop={5}>
                            {currentUser?.owner && (
                                <form onSubmit={(e) => {
                                    handleSubmit(e, pet.id)
                                }}>
                                    <Flex direction={'column'} alignItems={'flex-start'}>
                                        <FormControl>
                                            <FormLabel mb='8px' fontSize='s'>Spremi sliku ljubimca:</FormLabel>
                                            <input multiple={false} type="file" name="image" accept="image/*" onChange={(e) => handleImageInput(e, pet.id)} />
                                            {file && fileUpload[pet.id] && (
                                                <Text fontSize={"small"}>{file.name}</Text>
                                            )}
                                        </FormControl>
                                        <Flex alignItems={'flex-end'}>
                                            <Button
                                                id={pet.id}
                                                marginTop={3}
                                                colorScheme='blue'
                                                variant='outline'
                                                type="submit"
                                                size="sm"
                                                rightIcon={<DownloadIcon />}
                                            >
                                                Spremi sliku
                                            </Button>
                                            {uploading[pet.id] && (
                                                <CircularProgress id={pet.id} ml={3} size='20px' isIndeterminate color='green.300' />
                                            )}
                                        </Flex>
                                    </Flex>
                                </form>
                                 )}
                            </Box>
                            <Flex justifyContent={'end'} marginBottom={-5}>
                                <Flex flexDirection={'column'} justifyContent={'center'} alignItems={'center'}>
                                    <IconButton onClick={() => navigatePet(pet.id)} aria-label='Posjete' icon={<ArrowForwardIcon boxSize={6} />} />
                                    <Text color={'gray'}>Dolasci</Text>
                                </Flex>
                            </Flex>
                        </CardFooter>
                    </Card>
                ))}
            </Flex>
        </Flex>
    )
}