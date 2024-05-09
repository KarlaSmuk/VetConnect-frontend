import { ArrowBackIcon } from "@chakra-ui/icons";
import { Box, Button, Container, Text, Flex, Heading, Input, InputGroup, InputRightElement, Stack } from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";


export default function ChangePassword() {
    const [show, setShow] = useState(false)
    const handleClick = () => setShow(!show)
    const navigate = useNavigate();
    return(
        <>
            <ArrowBackIcon onClick={() => navigate(-1)} boxSize={10} margin={10} className="cursor-pointer" />
            <Container mt={20}>
                <Flex direction={"column"} alignItems={"center"}>
                    <Box p='5'>
                        <Heading size='lg'>Stvori novu lozinku</Heading>
                    </Box>
                    <Container>
                        <InputGroup size='md' flexDirection="column" mt={3} mb={8}>
                                <Input
                                    pr='4.5rem'
                                    type={show ? 'text' : 'password'}
                                    placeholder='Lozinka'
                                />
                                <InputRightElement width='4.5rem'>
                                    <Button h='1.75rem' size='sm' onClick={handleClick}>
                                        {show ? 'Hide' : 'Show'}
                                    </Button>
                                </InputRightElement>
                        </InputGroup>
                        <InputGroup size='md' flexDirection="column">
                            <Input
                                pr='4.5rem'
                                type={show ? 'text' : 'password'}
                                placeholder='Potvrdi lozinku'
                            />
                            <InputRightElement width='4.5rem'>
                                <Button h='1.75rem' size='sm' onClick={handleClick}>
                                    {show ? 'Hide' : 'Show'}
                                </Button>
                            </InputRightElement>
                        </InputGroup>
                    </Container>
                    <Button colorScheme='cyan' width="150px" borderRadius={10} mt={10} textColor={'white'} size='md'>
                        Potvrdi
                    </Button>
                    {/* on click if password change is succesfull go to login page */}
                </Flex>
            </Container>
        </>
    )
}
