import { ArrowBackIcon } from "@chakra-ui/icons";
import { Box, Button, Container, Text, Flex, Heading, Input, InputGroup, InputRightElement, useToast } from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../auth/authProvider";

export default function Login() {
    const [show, setShow] = useState(false);
    const [loginData, setLoginData] = useState({
        email: "",
        password: "",
    });

    const { login } = useAuth();
    const navigate = useNavigate();
    const toast = useToast()

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setLoginData((prev) => ({ ...prev, [name]: value }));
    };

    const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            const logged = await login(loginData);
            if(logged){
                toast({
                    title: "Uspješna prijava.",
                    status: "success",
                });
                navigate("/");
            }else{
                toast({
                    title: "Prijava neuspješna.",
                    description: "Pogrešan email ili lozinka.",
                    status: "error"
                });
            }
        } catch (error) {
            toast({
                title: "Prijava neuspješna.",
                description: "Pogrešan email ili lozinka.",
                status: "error"
            });
            console.error("Error during login:", error);
        }
    };

    const handleClick = () => setShow(!show);

    return (
        <>
            <ArrowBackIcon onClick={() => navigate('/')} boxSize={10} margin={10} className="cursor-pointer" />
            <Container mt={20}>
                <Flex direction={"column"} alignItems={"center"}>
                    <Box p="5">
                        <Heading size="lg">Prijavi se</Heading>
                    </Box>
                    <Container>
                        <form onSubmit={handleLogin}>
                            <Input
                                type="email"
                                name="email"
                                placeholder="Email"
                                mb={10}
                                mt={2}
                                onChange={handleInputChange}
                            />
                            <InputGroup size="md" flexDirection="column">
                                <Input
                                    name="password"
                                    type={show ? "text" : "password"}
                                    placeholder="Lozinka"
                                    onChange={handleInputChange}
                                />
                                <InputRightElement width="4.5rem">
                                    <Button h="1.75rem" size="sm" onClick={handleClick}>
                                        {show ? "Hide" : "Show"}
                                    </Button>
                                </InputRightElement>
                            </InputGroup>
                            <Flex justifyContent={"center"}>
                                <Button type="submit" colorScheme="cyan" width="150px" borderRadius={10} mt={10} textColor={"white"} size="md">
                                    Prijavi se
                                </Button>
                            </Flex>
                        </form>
                    </Container>
                </Flex>
                <Flex direction={"row"}>
                    <Text mt={4} ml={5} fontSize={"x-small"} className="font-mono text-zinc-400">
                        Prva prijava ili zaboravljena lozinka?
                    </Text>
                    <Link to={"/otpVerification"}>
                        <Text mt={4} ml={2} fontSize={"x-small"} className="font-mono text-cyan-500 cursor-pointer">
                            Prijava s OTP
                        </Text>
                    </Link>
                </Flex>
            </Container>
        </>
    );
}
