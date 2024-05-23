import { ArrowBackIcon } from "@chakra-ui/icons";
import { Box, Button, Container, Text, Flex, Heading, Input, HStack, PinInput, PinInputField, useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/authProvider";
import { useState } from "react";


export default function OtpVerification() {
    const [userData, setUserData] = useState({
        email: "",
        otp: ""
    });
    const navigate = useNavigate();
    const { verifyOtp } = useAuth()
    const toast = useToast()

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        if(name == 'email'){
            setUserData((prev) => ({ ...prev, [name]: value }));
        }else{
            const newEnteredOtp = userData.otp += value;
            setUserData((prev) => ({
                ...prev,
                enteredOtp: newEnteredOtp
            }));
        }
        
    };

    const handleVerification = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            const verified = await verifyOtp(userData);
            console.log(verified)
            if(verified){
                navigate('/changePassword', {state: {email: userData.email}})
                toast({
                    title: "Verifikacija uspješna",
                    description: "Unesite novu lozinku.",
                    status: "success",
                });
            }else{
                toast({
                    title: "Pogrešan email ili jednokratna lozinka",
                    description: "Obratite se veterinaru za drugu jednokratnu lozinku ili unesite ispravan email.",
                    status: "error",
                });
            }
        } catch (error) {
            console.error("Error during login:", error);
            
        }
    };

    return(
        <>
            <ArrowBackIcon onClick={() => navigate(-1)} boxSize={10} margin={10} className="cursor-pointer" />
            <Container mt={20}>
                <Flex direction={"column"} alignItems={"center"}>
                    <Box p='5'>
                        <Heading size='lg'>OTP verifikacija</Heading>
                    </Box>
                    <Text fontSize={"small"} mb={5} className="text-gray-400">Unesite kod (OTP) koji ste dobili na email.</Text>
                    <form onSubmit={handleVerification}>
                        <Input
                                pr='4.5rem'
                                name="email"
                                type="email"
                                placeholder='Email'
                                mb={8}
                                mt={2}
                                onChange={handleInputChange}
                            />
                        <HStack justifyContent={"center"} onChange={handleInputChange}>
                            <PinInput size='lg' otp>
                                <PinInputField />
                                <PinInputField />
                                <PinInputField />
                                <PinInputField />
                            </PinInput>
                        </HStack>
                        <Button type="submit" colorScheme='cyan' width="150px" borderRadius={10} mt={10} textColor={'white'} size='md'>
                        Potvrdi
                        </Button>
                    </form>
                    
                    {/* on click if otp verification is succesfull go to change password page */}

                </Flex>
            </Container>
        </>
    )
}
