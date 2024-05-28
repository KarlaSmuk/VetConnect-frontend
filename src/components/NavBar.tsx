import { Avatar, Button } from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/authProvider";

export default function NavBar() {

    const {logout, currentUser} = useAuth()

    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
    };

    return (
        <div className='w-full h-full flex items-center justify-between shadow-sm'>
            <nav className='m-5 my-8 flex items-center '>
                { currentUser && (
                    <Avatar
                        src={`https://lh3.googleusercontent.com/d/${currentUser.user.photo!}`}
                        name={`${currentUser.user.firstName!} ${currentUser.user.lastName}`}
                        className="cursor-pointer mr-4"
                        onClick={() => navigate('/profile')} //, {state: {user: currentUser.user}})
                    />
                )}
                { currentUser && (
                    <Link to='/' className='ml-4 mr-4 font-normal text-lg hover:text-cyan-500'>Naslovna</Link>
                )}
                { currentUser && (
                <Link to='/clinics' className='mx-2	font-normal text-lg hover:text-cyan-500'>
                    Veterinarske stanice
                </Link>
                )}
                { currentUser?.vet && (
                    <Link to={`/treatments/${currentUser.vet.clinicId}`} className='mx-2	font-normal text-lg hover:text-cyan-500'>
                        Tretmani
                    </Link>
                )}
                { currentUser?.vet && (
                    <Link to={`/supplies`} className='mx-2	font-normal text-lg hover:text-cyan-500'>
                        Zalihe
                    </Link>
                )}
                
                {currentUser?.vet && (
                    <Link to='/owners' className='mx-2	font-normal text-lg hover:text-cyan-500'>
                        Vlasnici
                    </Link>
                )}
                { currentUser?.vet && (
                    <Link to={`/appointments`} className='mx-2	font-normal text-lg hover:text-cyan-500'>
                        Termini
                    </Link>
                )}
                {currentUser?.owner && (
                    <Link to={`/owner/${currentUser.owner.id}`} className='mx-2	font-normal text-lg hover:text-cyan-500'>
                        Ljubimci
                    </Link>
                )}
                { currentUser?.owner && (
                    <Link to={`/appointments`} className='mx-2	font-normal text-lg hover:text-cyan-500'>
                        Rezervacije termina
                    </Link>
                )}
            </nav>
            <Link to='/login' className='mr-20'>
                {!currentUser ? (
                <Button colorScheme='cyan' textColor={'white'} size='lg'>
                    Prijavi se
                </Button>
                ) : (
                <Button colorScheme='cyan' onClick={() => handleLogout} textColor={'white'} size='lg'>
                    Odjavi se
                </Button>
                )
                }
                
            </Link>
        </div>
    )
}