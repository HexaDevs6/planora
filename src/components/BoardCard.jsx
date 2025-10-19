import React from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { MapPin } from "lucide-react";

export default function BoardCard() {
    return (
        <>
            <div className='bg-card rounded-sm soft-shadow overflow-hidden group transform transition-all duration-300 hover:-translate-y-1 shadow-md'>
                <img
                    alt='Music Festival'
                    className='w-full h-48 object-cover'
                    src='https://lh3.googleusercontent.com/aida-public/AB6AXuCuE9FToirIJIBcBmt0df13dxjxDKS8Gip8ffnvOMVuH8KqWvTRWL5JeEpIgCEVrcZAoeFu-cLPcIRK3k6SYo9cKR4lhlmSe2EXcWUMKzyhVz3Qq40JBn-vkv8zQ03xm3N0RSoRSI0bKsfk74cLiWhYHyT8W6CQDEBN1oAYfc6D2nUCdlw7bXKHehGPRYNybkIHWrH2m5JV1fBaofmsYqqqah2NcrSGcITc8tKzNEPEKBPlKxL8syZ1UZ2RwHxJ3rfFwk3SY7AH1dWy'
                />
                <div className='p-6'>
                    <p className='text-sm font-semibold text-amber'>
                        SAT, DEC 12, 2024
                    </p>
                    <h3 className='text-xl font-bold text-primary mt-2'>
                        Vibrations Music Festival
                    </h3>
                    <p className='text-gray-500 mt-1 flex items-center gap-2'>
                        <MapPin size={16} />
                        Central Park, NYC
                    </p>
                    <div className='mt-4 flex items-center justify-between'>
                        <div className='flex -space-x-2'>
                            <img
                                alt='Attendee'
                                className='inline-block h-8 w-8 rounded-full ring-2 ring-white'
                                src='https://lh3.googleusercontent.com/aida-public/AB6AXuBf4oMvciKLg64j-P5VaABoKKWt9G6aNieHg-yhpScjDa_Awc49KRPIWuSI1IOVzhh1zTszQSb1rEuyWqawE42XdOL3GILVSu7mETNAPKqLA4L4BGvLnYQLd-5MtPt03gRAnMRjcwjDk60GvBOAEfvRhBBjpOEJux2J5SuYXQEjgQ44jI3fx5WhXpIbib84lulmTxQCfahbDjT9NpLuHh-Kefl9cDCyc5LWMjSkrLvnxRS946hJzRdFrXwVG_yneQP_6M049tcIGfBt'
                            />
                            <img
                                alt='Attendee'
                                className='inline-block h-8 w-8 rounded-full ring-2 ring-white'
                                src='https://lh3.googleusercontent.com/aida-public/AB6AXuBvG42OiJ8sAIVM9_pzhCEhZw7XUVkPsIY-IFtql4nsEJku_AdBp2J9fZE4H-8RBqiKaY7GEYi5hOt5MID19HvbSboOKO2EiYIQ26ygw6Au_G1vzakQ0Dm-uZiKnuqCy0-Nm58G4y78Xm-jxhTb1QZ2tj8_0aT_Hr5iAIRRoBFwM02vBgdw8SzOxGky2qhMqIyztvXOhTXngjhsZDdTFpYM74GgDKALQ0uFCwvntPKuQoqto8CIiZcQT7OTj3gHisBN6Mgs1i3mQPKe'
                            />
                            <div className='h-8 w-8 rounded-full ring-2 ring-white bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600'>
                                +5
                            </div>
                        </div>
                        <Button variant='amber' size='sm'>
                            View Details
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}
