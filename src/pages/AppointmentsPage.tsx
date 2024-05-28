import { Flex } from "@chakra-ui/react"
import NavBar from "../components/NavBar"
import { useAuth } from "../auth/authProvider"

export default function Appointments() {

    const {} = useAuth

    return (
        <Flex direction={'column'}>
            <NavBar />
            
        </Flex>
    )
}