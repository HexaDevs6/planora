import React from "react";
import WhiteTicketCTA from "../../public/WhiteTicketCTA.png";
import YellowTicketCTA from "../../public/YellowTicketCTA.png";
import { Calendar } from 'lucide-react';
import { QrCode  } from 'lucide-react';
import { MessageSquareText } from 'lucide-react';




function CallToAction() {
    return (
        <>
            <div className='cta-section py-16 flex items-center flex-col gap-16 bg-gradient-violet'>
                <h3 className='px-4 cta-section-title text-4xl font-bold text-white drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]  text-center'>
                    Easy 3 steps to your great event!
                </h3>
                <div className=' container cta-section-content flex flex-col md:flex-row gap-6 justify-evenly items-center'>
                    <div
                        className='cta-section-content__card flex h-75 w-62 flex-col justify-start pt-12 items-center text-violet text-lg font-semibold gap-3 cursor-pointer transition-all duration-500 hover:translate-y-[-15px] hover:drop-shadow-[0px_16px_16px_rgba(0,0,0,0.25)]'
                        style={{
                            backgroundImage: `url(${WhiteTicketCTA})`,
                            backgroundSize: "cover",
                        }}
                    >
                        <span>1.</span>
                        <span>Add Events Details</span>
                        <Calendar size={72} className="text-violet" strokeWidth={1.7} />
                    </div>
                    <div
                        className='cta-section-content__card flex h-75 w-62 flex-col justify-start pt-12 items-center text-white text-lg font-semibold gap-3 cursor-pointer transition-all duration-500 hover:translate-y-[-15px] hover:drop-shadow-[0px_16px_16px_rgba(0,0,0,0.25)]'
                        style={{
                            backgroundImage: `url(${YellowTicketCTA})`,
                            backgroundSize: "cover",
                        }}
                    >
                        <span>2.</span>
                        <span>Share Your QR</span>
                        <QrCode size={72} className="text-white" strokeWidth={1.7} />
                    </div>
                    <div
                        className='cta-section-content__card flex h-75 w-62 flex-col justify-start pt-12 items-center text-violet text-lg font-semibold gap-3 cursor-pointer transition-all duration-500 hover:translate-y-[-15px] hover:drop-shadow-[0px_16px_16px_rgba(0,0,0,0.25)] '
                        style={{
                            backgroundImage: `url(${WhiteTicketCTA})`,
                            backgroundSize: "cover",
                        }}
                    >
                        <span>3.</span>
                        <span>Enjoy & Give Feedback</span>
                        <MessageSquareText size={72} className="text-violet" strokeWidth={1.7} />
                    </div>
                </div>
            </div>
        </>
    );
}

export default CallToAction;
