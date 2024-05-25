import { Text, Flex, Heading, Avatar, Box, FormLabel, Button, FormControl, CircularProgress } from "@chakra-ui/react"
import NavBarComponent from "../components/NavBar"
import { ChangeEvent, FormEvent, useState } from "react";
import { DownloadIcon } from "@chakra-ui/icons";
import { uploadImage } from "../api/user.service";
import { useAuth } from "../auth/authProvider";


export default function Profile() {
    const [file, setFile] = useState<File | undefined>()
    const [uploading, setUploading] = useState(false)

    const { refreshUser, currentUser } = useAuth()

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setUploading(true)

        if(typeof file === 'undefined') return;

        const formData = new FormData();
        formData.append('file', file)

        try {
            const result = await uploadImage(currentUser?.user.id!, formData);
            if(result.success){
                setUploading(false)
                if(currentUser){
                    await refreshUser(currentUser.user.id);
                }
                console.log('image uploaded');
            }
        } catch (error) {
            console.log("Error uploading photo:", error)
        }

    };

    const handleImageInput = (e: ChangeEvent<HTMLInputElement>) => {
        const target = e.target as HTMLInputElement & {
            files: FileList;
        }

        setFile(target.files[0])

    };

    return (
        <>
            <NavBarComponent />
            <Heading size="md" className="my-10 ml-5">Podaci o profilu</Heading>
            <Flex direction={"column"} align={"center"}>
                <Box backgroundColor='gray.100' padding={10} width={'60vw'} borderRadius={'10px'} boxShadow={'0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)'}>
                    <Flex direction="column" align="center" >
                        <Avatar
                            src={`https://lh3.googleusercontent.com/d/${currentUser?.user.photo!}`}
                            name={`${currentUser?.user.firstName!} ${currentUser?.user.lastName}`}
                            size={'xl'}
                        />
                        <Text fontSize="xl" mt="4">{`${currentUser?.user.firstName} ${currentUser?.user.lastName}`}</Text>
                        <Text fontSize="lg" mt="2">{currentUser?.user.role}</Text>
                        <Text fontSize="lg" mt="2">{currentUser?.user.email}</Text>
                        <Text fontSize="lg" mt="2">{currentUser?.user.phoneNumber}</Text>
                    </Flex>
                </Box>
                <Box width={'60vw'} marginTop={5}>
                    <form onSubmit={handleSubmit}>
                        <Flex direction={'column'} alignItems={'flex-start'}>
                            <FormControl>
                                <FormLabel mb='8px' fontSize='s'>Promijeni ili spremi svoju sliku:</FormLabel>
                                <input multiple={false} type="file" name="image" accept="image/*" onChange={handleImageInput} />
                                {file && (
                                    <Text fontSize={"small"}>{file.name}</Text>
                                )}
                            </FormControl>
                            <Flex alignItems={'flex-end'}>
                                <Button
                                    marginTop={3}
                                    colorScheme='blue'
                                    variant='outline'
                                    type="submit"
                                    size="sm"  
                                    rightIcon={<DownloadIcon />}
                                >
                                    Spremi sliku
                                </Button>    
                                {
                                uploading && (
                                    <CircularProgress ml={3} size='20px' isIndeterminate color='green.300' />                  
                                )} 
                                
                            </Flex>
                        </Flex>
                    </form>
                </Box>

            </Flex>
        </>
    )
}