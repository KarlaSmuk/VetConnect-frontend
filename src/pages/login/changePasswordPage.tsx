import { ArrowBackIcon } from "@chakra-ui/icons";
import { Box, Button, Container, Flex, Heading, Input, InputGroup, InputRightElement } from "@chakra-ui/react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/authProvider";


export default function ChangePassword() {
    const location = useLocation();
    const { email } = location.state || {};
    
    const [registerData] = useState({
        email: email,
        password: "",
    });

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [showFirst, setShowFirst] = useState(false)
    const handleShowFirst = () => setShowFirst(!showFirst)
    const [showSecond, setShowSecond] = useState(false)
    const handleShowSecond = () => setShowSecond(!showSecond)

    const { register } = useAuth()


    const handleChangePassword = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
          
            if(password === confirmPassword){
                registerData.password = password
                console.log(registerData)
                const updatedPass = await register(registerData)
                if(updatedPass){
                    navigate('/login')
                }
            }
            
        } catch (error) {
            console.error("Error during login:", error);
        }
    };

    const navigate = useNavigate();
    return(
        <>
            <ArrowBackIcon onClick={() => navigate(-1)} boxSize={10} margin={10} className="cursor-pointer" />
            <Container mt={20}>
                <Flex direction={"column"} alignItems={"center"}>
                    <Box p='5'>
                        <Heading size='lg'>Stvori novu lozinku</Heading>
                    </Box>
                    <form onSubmit={handleChangePassword}>
                        <InputGroup size='md' flexDirection="column" mt={3} mb={8}>
                                <Input
                                    pr='4.5rem'
                                    name="password"
                                    type={showFirst ? 'text' : 'password'}
                                    placeholder='Lozinka'
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <InputRightElement width='4.5rem'>
                                    <Button h='1.75rem' size='sm' onClick={handleShowFirst}>
                                        {showFirst ? 'Hide' : 'Show'}
                                    </Button>
                                </InputRightElement>
                        </InputGroup>
                        <InputGroup size='md' flexDirection="column">
                            <Input
                                pr='4.5rem'
                                name="confirmPassword"
                                type={showSecond ? 'text' : 'password'}
                                placeholder='Potvrdi lozinku'
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            <InputRightElement width='4.5rem'>
                                <Button h='1.75rem' size='sm' onClick={handleShowSecond}>
                                    {showSecond ? 'Hide' : 'Show'}
                                </Button>
                            </InputRightElement>
                        </InputGroup>
                        <Button type="submit" colorScheme='cyan' width="150px" borderRadius={10} mt={10} textColor={'white'} size='md'>
                            Potvrdi
                        </Button>
                    </form>
                    {/* on click if password change is succesfull go to login page */}
                </Flex>
            </Container>
        </>
    )
}
