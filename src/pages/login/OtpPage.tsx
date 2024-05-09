import { ArrowBackIcon } from "@chakra-ui/icons";
import { Box, Button, Container, Text, Flex, Heading, Input, HStack, PinInput, PinInputField } from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";


export default function OtpVerification() {
    const navigate = useNavigate();
    return(
        <>
            <ArrowBackIcon onClick={() => navigate(-1)} boxSize={10} margin={10} className="cursor-pointer" />
            <Container mt={20}>
                <Flex direction={"column"} alignItems={"center"}>
                    <Box p='5'>
                        <Heading size='lg'>OTP verifikacija</Heading>
                    </Box>
                    <Text fontSize={"small"} mb={5} className="text-gray-400">Unesite kod (OTP) koji ste dobili na email.</Text>
                    <Container>
                        <Input
                                pr='4.5rem'
                                type="email"
                                placeholder='Email'
                                mb={8}
                                mt={2}
                            />
                        <HStack justifyContent={"center"}>
                            <PinInput size='lg' otp>
                                <PinInputField />
                                <PinInputField />
                                <PinInputField />
                                <PinInputField />
                            </PinInput>
                        </HStack>
                    </Container>
                    <Button colorScheme='cyan' width="150px" borderRadius={10} mt={10} textColor={'white'} size='md'>
                        Potvrdi
                    </Button>
                    {/* on click if otp verification is succesfull go to change password page */}

                </Flex>
            </Container>
        </>
    )
}
