import { ArrowBackIcon } from "@chakra-ui/icons";
import { Box, Button, Container, Text, Flex, Heading, Input, InputGroup, InputRightElement, Stack } from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";


export default function Login() {
    const [show, setShow] = useState(false)
    const handleClick = () => setShow(!show)
    const navigate = useNavigate();
    return(
        <>
            <ArrowBackIcon onClick={() => navigate(-1)} boxSize={10} margin={10} className="cursor-pointer" />
            <Container mt={20}>
                <Flex direction={"column"} alignItems={"center"}>
                    <Box p='5'>
                        <Heading size='lg'>Prijavi se</Heading>
                    </Box>
                    <Container>
                        <Input
                                pr='4.5rem'
                                type="email"
                                placeholder='Email'
                                mb={10}
                                mt={2}
                            />
                        <InputGroup size='md' flexDirection="column">
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
                    </Container>
                    <Button colorScheme='cyan' width="150px" borderRadius={10} mt={10} textColor={'white'} size='md'>
                        Prijavi se
                    </Button>
                </Flex>
                <Flex direction={"row"}>
                    <Text mt={4} ml={5} fontSize={"x-small"} className='font-mono text-zinc-400'>Prva prijava ili zaboravljena lozinka?</Text>
                    <Link to={'/otpVerification'}>
                        <Text mt={4} ml={2} fontSize={"x-small"} className='font-mono text-cyan-500 cursor-pointer'>Prijava s OTP</Text>
                    </Link>
                </Flex>
            </Container>
        </>
    )
}
