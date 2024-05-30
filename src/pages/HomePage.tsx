import { Card, CardBody, Flex, Heading, Image, SimpleGrid, Stack, Text } from '@chakra-ui/react'
import vetConnectText from '/VetConnect.png'
import clinic from '/clinic.png'
import calendar from '/calendar.png'
import invoice from '/invoice.png'
import catDogImg from '/catdog.jpg'
import bg from '/bg.png'
import NavBar from '../components/NavBar'

export default function Home() {
    return (
        <Flex direction={'column'}>
            <NavBar />
            <div className='flex mt-10 items-center justify-around'>
                <div className='ml-12'>
                    <img className='h-auto max-w-full size-96' src={vetConnectText} alt='logo' />
                    <p className='text-xs font-light tracking-wide ml-5'>Povežimo ljubimce, vlasnike i veterinare.</p>
                </div>
                <img className='size-1/3' src={catDogImg} alt='dog' />
            </div>

            <div className='relative w-full h-full flex justify-center'>
                <img className='w-full h-full' src={bg} alt='background' />
                <SimpleGrid className='absolute top-20 p-4 w-full justify-evenly my-auto' spacing={4} templateColumns='repeat(3, minmax(290px, 100px))'>
                    <Card className='flex items-center justify-center'>
                        <CardBody className='flex flex-col items-center justify-center text-center bg-cyan-50 shadow-lg'>
                            <Image src={clinic} className='rounded-lg' alt='clinic' />
                            <Stack mt='6' spacing='3'>
                                <Heading className='font-mono' size='md'>Veterinarske stanice</Heading>
                                <Text className='font-mono text-zinc-500 p-1 text-sm'>
                                    Otkrijte veterinarske stanice. Pristupite kontakt informacijama i radnom vremenu.
                                </Text>
                            </Stack>
                        </CardBody>
                    </Card>
                    <Card className='flex items-center justify-center'>
                        <CardBody className='flex flex-col items-center justify-center text-center bg-cyan-50 shadow-lg'>
                            <Image src={calendar} borderRadius='lg' />
                            <Stack mt='6' spacing='3'>
                                <Heading className='' size='md'>Termini</Heading>
                                <Text className='font-mono text-zinc-500 p-1 text-sm'>
                                    Brzo i jednostavno zakažite termin radi bolje organiziranosti.
                                </Text>
                            </Stack>
                        </CardBody>
                    </Card>
                    <Card className='flex items-center justify-center'>
                        <CardBody className='flex flex-col items-center justify-center text-center bg-cyan-50 shadow-lg'>
                            <Image src={invoice} borderRadius='lg' />
                            <Stack mt='6' spacing='3'>
                                <Heading className='font-mono' size='md'>Zapisi i Računi</Heading>
                                <Text className='font-mono text-zinc-500 p-1 text-sm'>
                                    Pristupite medicinskoj povijesti vašeg ljubimca i pogledajte račune i tretmane.
                                </Text>
                            </Stack>
                        </CardBody>
                    </Card>
                </SimpleGrid>
            </div>
        </Flex>
    )
}