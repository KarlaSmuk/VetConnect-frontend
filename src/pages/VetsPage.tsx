import {
    Avatar,
    Heading,
    Select,
    Flex,
    Text,
    Table,
    TableContainer,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
    Input,
    Box,
    Button,
    useDisclosure,
    IconButton,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
    AddIcon,
    ArrowBackIcon,
    ArrowForwardIcon,
    DeleteIcon,
    EditIcon,
    EmailIcon,
} from "@chakra-ui/icons";
import { deleteUser, sendOTP } from "../api/user.service";
import CreateUserModal from "../components/modals/CreateUserModal";
import UpdateUserModal from "../components/modals/UpdateUserModal";
import { ROLE } from "../enums/roles.enum";
import { getVetsByClinicId } from "../api/veterinarian.service";
import { getClinicById } from "../api/clinic.service";
import { UsersDto, Clinic, User } from "../api/types/api.types";
import { useAuth } from "../auth/authProvider";
import NavBar from "../components/NavBar";

export default function Vets() {
    const [vetsData, setVetsData] = useState<UsersDto>([]);
    const [clinicData, setClinicData] = useState<Clinic>();
    const [filterValue, setFilterValue] = useState("");
    const [filterField, setFilterField] = useState("Ime i prezime");
    const [vetsListPage, setVetsListPage] = useState(10);
    const [prevVetsListPage, setPrevVetsListPage] = useState(0);

    const [selectedUserId, setSelectedUserId] = useState("");

    const {
        isOpen: isCreateOpen,
        onOpen: onCreateOpen,
        onClose: onCreateClose,
    } = useDisclosure();

    const {
        isOpen: isUpdateOpen,
        onOpen: onUpdateOpen,
        onClose: onUpdateClose,
    } = useDisclosure();

    const location = useLocation();

    const { currentUser } = useAuth();

    useEffect(() => {
        loadVets();
    }, []);

    const loadVets = async () => {
        try {
            const data = await getVetsByClinicId(location.state.clinicId);
            setVetsData(data);

            console.log(vetsData);

            const clinic = await getClinicById(location.state.clinicId);
            setClinicData(clinic);
        } catch (error) {
            console.error("Error geting clinics:", error);
        }
    };

    useEffect(() => {
        setVetsListPage(10);
        setPrevVetsListPage(0);
    }, [filterValue, filterField]);

    let filteredVets = vetsData;
    if (filterField == "Ime i prezime") {
        const parts = filterValue.trim().split(" ");
        const firstNamePart = parts[0]?.toLowerCase();
        const lastNamePart = parts[1]?.toLowerCase();

        filteredVets = vetsData.filter((vet) => {
            const firstName = vet.user.firstName?.toLowerCase() ?? "";
            const lastName = vet.user.lastName?.toLowerCase() ?? "";
            return (
                firstName.includes(firstNamePart) ||
                lastName.includes(lastNamePart || firstNamePart)
            );
        });
    } else if (filterField == "Broj mobitela") {
        filteredVets = vetsData.filter((vet) =>
            (vet.user.phoneNumber ?? "").toString().includes(filterValue)
        );
    } else if (filterField == "Email") {
        filteredVets = vetsData.filter((vet) =>
            (vet.user.email ?? "").toLowerCase().includes(filterValue.toLowerCase())
        );
    }

    const addNewUser = (newUser: User) => {
        setVetsData((prev) => [...prev, newUser]);
    };

    const updateUser = (updatedUser: User) => {
        setVetsData((prev) =>
            prev.map((user) => (user.id === updatedUser.id ? updatedUser : user))
        );
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteUser(id);
            setVetsData((prev) => {
                const updatedVets = prev.filter((vet) => vet.user.id !== id);

                if (updatedVets.length <= 10) {
                    setVetsListPage(10);
                    setPrevVetsListPage(0);
                }

                return updatedVets;
            });
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    };

    const handleSendOTP = async (userId: string) => {
        try {
            const response = await sendOTP(userId);
            console.log(response);
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    };

    return (
        <Flex direction={"column"} height={"100vh"} bgColor={"gray.50"}>
            <NavBar />
            <Flex justifyContent={"center"}>
                <Heading size="xl" className="mt-10 mb-3 ml-5">
                    {" "}
                    {clinicData?.name}
                </Heading>
            </Flex>
            <Flex justifyContent={"space-between"} alignItems={"end"}>
                <Flex direction={"column"}>
                    <Heading size="lg" className="my-10 ml-5">
                        Veterinari
                    </Heading>
                    <Box ml={5}>
                        <Heading size="sm" mb={3}>
                            Pretraži:
                        </Heading>
                        <Input
                            w={"200px"}
                            bgColor={"white"}
                            borderColor={"gray.500"}
                            mr={20}
                            placeholder=""
                            value={filterValue}
                            onChange={(e) => setFilterValue(e.target.value)}
                        />
                        <Select
                            w={"200px"}
                            bgColor={"white"}
                            borderColor={"gray.500"}
                            mr={20}
                            mt={5}
                            className="cursor-pointer"
                            placeholder="Pretraži po"
                            value={filterField}
                            onChange={(e) => {
                                setFilterField(e.target.value);
                            }}
                        >
                            <option value="Ime i prezime">Ime i prezime</option>
                            <option value="Broj mobitela">Broj mobitela</option>
                            <option value="Email">Email</option>
                        </Select>
                    </Box>
                </Flex>
                {currentUser?.user.role === ROLE.ADMIN && (
                    <Button
                        onClick={onCreateOpen}
                        leftIcon={<AddIcon />}
                        colorScheme="green"
                        width={"200px"}
                        height={"30px"}
                        textColor={"white"}
                        mr={10}
                        size="sm"
                    >
                        Dodaj novog veterinara
                    </Button>
                )}
                <CreateUserModal
                    isOpen={isCreateOpen}
                    onClose={onCreateClose}
                    role={ROLE.VET}
                    clinicId={location.state.clinicId}
                    addNewUser={addNewUser}
                />
            </Flex>
            <TableContainer
                bgColor={"white"}
                marginX={2}
                marginTop={5}
                border={"1px"}
                borderRadius={"10px"}
                borderColor={"gray.400"}
            >
                <Table colorScheme="gray">
                    <Thead>
                        <Tr>
                            <Th></Th>
                            <Th>Ime i prezime</Th>
                            <Th>Broj mobitela</Th>
                            <Th>Email</Th>
                            {currentUser?.user.role === ROLE.ADMIN && <Th></Th>}
                        </Tr>
                    </Thead>
                    <Tbody>
                        {filteredVets.slice(prevVetsListPage, vetsListPage).map((vet) => (
                            <Tr key={vet.id}>
                                <Td verticalAlign={"end"}>
                                    <Avatar
                                        src={`https://lh3.googleusercontent.com/d/${vet.user.photo}`}
                                        name={`${vet.user.firstName} ${vet.user.lastName}`}
                                    />
                                </Td>
                                <Td>
                                    {vet.user.firstName} {vet.user.lastName}
                                </Td>
                                <Td>{vet.user.phoneNumber}</Td>
                                <Td>{vet.user.email}</Td>
                                {currentUser?.user.role === ROLE.ADMIN && (
                                    <Td>
                                        <IconButton
                                            icon={<EditIcon />}
                                            onClick={() => {
                                                setSelectedUserId(vet.user.id);
                                                onUpdateOpen();
                                            }}
                                            boxSize={6}
                                            color={"green"}
                                            aria-label={"Update user"}
                                            bgColor={"transparent"}
                                        />
                                        <UpdateUserModal
                                            isOpen={isUpdateOpen}
                                            onClose={onUpdateClose}
                                            userId={selectedUserId}
                                            role={ROLE.VET}
                                            updateExistingUser={updateUser}
                                        />
                                        <IconButton
                                            icon={<DeleteIcon />}
                                            onClick={() => handleDelete(vet.user.id)}
                                            boxSize={6}
                                            color={"red"}
                                            marginLeft={7}
                                            aria-label={"Delete user"}
                                            bgColor={"transparent"}
                                        />
                                        <IconButton
                                            icon={<EmailIcon />}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleSendOTP(vet.user.id);
                                            }}
                                            boxSize={6}
                                            color={"blue"}
                                            marginLeft={7}
                                            aria-label={"Send email"}
                                            bgColor={"transparent"}
                                        />
                                    </Td>
                                )}
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </TableContainer>
            <Flex
                flexDirection={"column"}
                alignItems={"end"}
                marginRight={20}
                marginTop={3}
            >
                <Text fontSize="xs" color={"GrayText"} className="">
                    Ukupno veterinara: {filteredVets.length}
                </Text>
                {filteredVets.length > 10 && (
                    <Flex flexDirection={"row"} marginBottom={5}>
                        <Button
                            onClick={() => {
                                if (vetsListPage > 10) {
                                    setPrevVetsListPage(prevVetsListPage - 10);
                                    setVetsListPage(vetsListPage - 10);
                                }
                            }}
                            className="mt-2"
                        >
                            <ArrowBackIcon />
                        </Button>
                        <Button
                            onClick={() => {
                                if (vetsListPage < filteredVets.length) {
                                    setPrevVetsListPage(prevVetsListPage + 10);
                                    setVetsListPage(vetsListPage + 10);
                                }
                            }}
                            className="mt-2 ml-5"
                        >
                            <ArrowForwardIcon />
                        </Button>
                    </Flex>
                )}
            </Flex>
        </Flex>
    );
}
