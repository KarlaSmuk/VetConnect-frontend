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
    useToast,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { getOwners } from "../../api/ownerPets.service";
import { useNavigate } from "react-router-dom";
import {
    AddIcon,
    ArrowBackIcon,
    ArrowForwardIcon,
    DeleteIcon,
    EditIcon,
    EmailIcon,
} from "@chakra-ui/icons";
import { deleteUser, sendOTP } from "../../api/user.service";
import { ROLE } from "../../enums/roles.enum";
import CreateUserModal from "../../components/modals/CreateUserModal";
import UpdateUserModal from "../../components/modals/UpdateUserModal";
import { User, UsersDto } from "../../api/types/api.types";
import NavBar from "../../components/NavBar";

export default function Owners() {
    const [ownersData, setOwnersData] = useState<UsersDto>([]);
    const [filterValue, setFilterValue] = useState("");
    const [filterField, setFilterField] = useState("Ime i prezime");
    const [ownerListPage, setOwnersListPage] = useState(10);
    const [prevOwnerListPage, setPrevOwnersListPage] = useState(0);

    const [selectedUserId, setSelectedUserId] = useState("");

    const navigate = useNavigate();

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

    const toast = useToast();

    useEffect(() => {
        loadOwners();
    }, []);

    const loadOwners = async () => {
        try {
            const data = await getOwners();
            setOwnersData(data);
        } catch (error) {
            console.error("Error geting clinics:", error);
        }
    };

    useEffect(() => {
        setOwnersListPage(10);
        setPrevOwnersListPage(0);
    }, [filterValue, filterField]);

    let filteredOwners = ownersData;
    if (filterField == "Ime i prezime") {
        const parts = filterValue.trim().split(" ");
        const firstNamePart = parts[0]?.toLowerCase();
        const lastNamePart = parts[1]?.toLowerCase();

        filteredOwners = ownersData.filter((owner) => {
            const firstName = owner.user.firstName?.toLowerCase() ?? "";
            const lastName = owner.user.lastName?.toLowerCase() ?? "";
            return (
                firstName.includes(firstNamePart) ||
                lastName.includes(lastNamePart || firstNamePart)
            );
        });
    } else if (filterField == "Broj mobitela") {
        filteredOwners = ownersData.filter((owner) =>
            (owner.user.phoneNumber ?? "").toString().includes(filterValue)
        );
    } else if (filterField == "Email") {
        filteredOwners = ownersData.filter((owner) =>
            (owner.user.email ?? "").toLowerCase().includes(filterValue.toLowerCase())
        );
    }

    const addNewUser = (newUser: User) => {
        setOwnersData((prev) => [...prev, newUser]);
    };

    const updateUser = (updatedUser: User) => {
        setOwnersData((prev) =>
            prev.map((user) => (user.id === updatedUser.id ? updatedUser : user))
        );
    };

    const handleRowClick = (id: string) => {
        navigate(`/owner/${id}`);
    };

    const handleDelete = (id: string) => async (e: any) => {
        e.stopPropagation(); //dont use parent default
        try {
            await deleteUser(id);

            setOwnersData((prev) => {
                const updatedOwners = prev.filter((owner) => owner.user.id !== id);

                if (updatedOwners.length <= 10) {
                    setOwnersListPage(10);
                    setPrevOwnersListPage(0);
                }

                return updatedOwners;
            });
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    };

    const handleSendOTP = async (userId: string) => {
        try {
            const response = await sendOTP(userId);
            if (response.success) {
                toast({
                    title: "Jednokratna lozinka uspješno poslana na Email.",
                    status: "success",
                });
            }
        } catch (error) {
            console.error("Error deleting user:", error);

            toast({
                title: "Pogreška kod slanja jednokratne lozinke",
                description: "Pokušajte ponovno",
                status: "error",
            });
        }
    };

    return (
        <Flex direction={"column"} height={"100vh"} bgColor={"gray.50"}>
            <NavBar />

            <UpdateUserModal
                isOpen={isUpdateOpen}
                onClose={onUpdateClose}
                userId={selectedUserId}
                role={ROLE.OWNER}
                updateExistingUser={updateUser}
            />

            <CreateUserModal
                isOpen={isCreateOpen}
                onClose={onCreateClose}
                role={ROLE.OWNER}
                addNewUser={addNewUser}
            />
            <Flex justifyContent={"space-between"} alignItems={"end"} mb={5}>
                <Flex direction={"column"}>
                    <Heading size="lg" className="my-10 ml-5">
                        Vlasnici
                    </Heading>
                    <Box ml={5}>
                        <Heading size="sm" mb={3}>
                            Pretraži:
                        </Heading>
                        <Input
                            bgColor={"white"}
                            w={"200px"}
                            borderColor={"gray.500"}
                            mr={20}
                            placeholder=""
                            value={filterValue}
                            onChange={(e) => setFilterValue(e.target.value)}
                        />
                        <Select
                            bgColor={"white"}
                            w={"200px"}
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
                    Dodaj novog vlasnika
                </Button>
            </Flex>
            <Flex bgColor={"gray.50"} direction={"column"}>
                <TableContainer
                    bgColor={"white"}
                    marginX={2}
                    border={"1px"}
                    borderRadius={"10px"}
                    borderColor={"gray.400"}
                >
                    <Table>
                        <Thead>
                            <Tr>
                                <Th></Th>
                                <Th>Ime i prezime</Th>
                                <Th>Broj mobitela</Th>
                                <Th>Email</Th>
                                <Th></Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {filteredOwners
                                .slice(prevOwnerListPage, ownerListPage)
                                .map((owner) => (
                                    <Tr
                                        key={owner.id}
                                        className="cursor-pointer"
                                        _hover={{ color: "teal" }}
                                        onClick={() => handleRowClick(owner.id)}
                                    >
                                        <Td verticalAlign={"end"}>
                                            <Avatar
                                                src={`https://lh3.googleusercontent.com/d/${owner.user.photo}`}
                                                name={`${owner.user.firstName} ${owner.user.lastName}`}
                                            />
                                        </Td>
                                        <Td>
                                            {owner.user.firstName} {owner.user.lastName}
                                        </Td>
                                        <Td>{owner.user.phoneNumber}</Td>
                                        <Td>{owner.user.email}</Td>
                                        <Td>
                                            <IconButton
                                                icon={<EditIcon />}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedUserId(owner.user.id);
                                                    onUpdateOpen();
                                                }}
                                                boxSize={6}
                                                color={"green"}
                                                aria-label={"Update user"}
                                                bgColor={"transparent"}
                                            />
                                            <IconButton
                                                icon={<DeleteIcon />}
                                                onClick={handleDelete(owner.user.id)}
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
                                                    handleSendOTP(owner.user.id);
                                                }}
                                                boxSize={6}
                                                color={"blue"}
                                                marginLeft={7}
                                                aria-label={"Send email"}
                                                bgColor={"transparent"}
                                            />
                                        </Td>
                                    </Tr>
                                ))}
                        </Tbody>
                    </Table>
                </TableContainer>
            </Flex>
            <Flex
                flexDirection={"column"}
                alignItems={"end"}
                marginRight={20}
                marginTop={3}
            >
                <Text fontSize="xs" color={"GrayText"} className="">
                    Ukupno vlasnika: {filteredOwners.length}
                </Text>
                {filteredOwners.length > 10 && (
                    <Flex flexDirection={"row"} marginBottom={5}>
                        <Button
                            onClick={() => {
                                if (ownerListPage > 10) {
                                    setPrevOwnersListPage(prevOwnerListPage - 10);
                                    setOwnersListPage(ownerListPage - 10);
                                }
                            }}
                            className="mt-2"
                            bgColor={'gray'} color={'white'}
                        >
                            <ArrowBackIcon />
                        </Button>
                        <Button
                            onClick={() => {
                                if (ownerListPage < filteredOwners.length) {
                                    setPrevOwnersListPage(prevOwnerListPage + 10);
                                    setOwnersListPage(ownerListPage + 10);
                                }
                            }}
                            className="mt-2 ml-5"
                            bgColor={'gray'} color={'white'}
                        >
                            <ArrowForwardIcon />
                        </Button>
                    </Flex>
                )}
            </Flex>
        </Flex>
    );
}
