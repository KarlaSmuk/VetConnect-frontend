import logo from '../../public/logo.png'
import vetConnectText from '../../public/VetConnect.png'
import clinic from '../../public/clinic.png'
import calendar from '../../public/calendar.png'
import invoice from '../../public/invoice.png'
import dogImage from '../../public/dog.png'
import bg from '../../public/bg.png'
import { Link } from 'react-router-dom'
import { Button } from '@chakra-ui/react'


export default function Home() {
    return (
        <>
            <div className='w-full h-full bg-white flex items-center justify-between '>
                <div className='m-5 my-8 flex items-center'>
                    {/* <img className='logo size-18' src={logo} alt='logo' /> */}
                    <Link to='/' className='ml-4 mr-4 font-normal hover:text-cyan-500'>Naslovna</Link>
                    <Link to='/clinics' className='mx-2	font-normal hover:text-cyan-500'>
                        Popis veterinarskih stanica
                    </Link>
                </div>
                <Link to='/login' className='mr-20'>
                    <Button colorScheme='cyan' textColor={'white'} size='lg'>
                        Prijavi se
                    </Button>
                </Link>
            </div>

            <div className='flex mt-20 items-center'>
                <div className='ml-12'>
                    <img className='h-auto max-w-full"' src={vetConnectText} alt='logo' />
                    <p className='text-xs font-light tracking-wide ml-5'>Povežimo ljubimce, vlasnike i veterinare.</p>
                </div>
                <img className='size-2/5' src={dogImage} alt='logo' />
            </div>

            <div>
                <img className='opacity' src={bg} alt='logo' />
            </div>
        </>
    )
  }