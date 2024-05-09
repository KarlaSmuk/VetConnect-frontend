import { Button } from "@chakra-ui/react";
import { Link } from "react-router-dom";

export default function NavBarGuests() {
    return (
        <div className='w-full h-full flex items-center justify-between shadow-sm'>
                <div className='m-5 my-8 flex items-center '>
                    {/* <img className='logo size-18' src={logo} alt='logo' /> */}
                    <Link to='/' className='ml-4 mr-4 font-normal text-lg hover:text-cyan-500'>Naslovna</Link>
                    <Link to='/clinics' className='mx-2	font-normal text-lg hover:text-cyan-500'>
                        Veterinarske stanice
                    </Link>
                </div>
                <Link to='/login' className='mr-20'>
                    <Button colorScheme='cyan' textColor={'white'} size='lg'>
                        Prijavi se
                    </Button>
                </Link>
        </div>
    )
}