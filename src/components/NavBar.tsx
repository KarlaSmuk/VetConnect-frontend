import { Avatar, Button } from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/authProvider";

export default function NavBarGuests() {

    const {logout, isLoggedIn, currentUser} = useAuth()

    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
    };

    return (
        <div className='w-full h-full flex items-center justify-between shadow-sm'>
            <div className='m-5 my-8 flex items-center '>
                { currentUser && (
                    <Avatar
                        src={`https://lh3.googleusercontent.com/d/${currentUser?.user.photo!}`}
                        name={`${currentUser.user.firstName!} ${currentUser.user.lastName}`}
                        className="cursor-pointer"
                        onClick={() => navigate('/profile', {state: {userId: currentUser.user.id}})}
                    />
                )}
                <Link to='/' className='ml-4 mr-4 font-normal text-lg hover:text-cyan-500'>Naslovna</Link>
                <Link to='/clinics' className='mx-2	font-normal text-lg hover:text-cyan-500'>
                    Veterinarske stanice
                </Link>
                {currentUser?.vet && (
                    <Link to='/owners' className='mx-2	font-normal text-lg hover:text-cyan-500'>
                        Vlasnici
                    </Link>
                )}
            </div>
            <Link to='/login' className='mr-20'>
                {!isLoggedIn ? (
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