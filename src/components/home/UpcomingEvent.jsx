import React from "react";
import AutoFadeCarousel from "../AutoFadeCarousel";
import AnimatedCountdown from "../AnimatedCountdown";
import { t } from "i18next";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";
import g2Img from '@/assets/G2_1_50.jpg'
import g1Img from '@/assets/G1_1_50.jpg'
import itiImg from '@/assets/ITI1.png'
import iti2Img from '@/assets/ITI2.jpg'
import { Link } from "react-router-dom";

function UpcomingEvent() {
    let upcomingEventImgs = [
        itiImg,
        g2Img,
        g1Img,
    ];

    const eventDate = "2025-12-22T09:00:00";
    const [isEventLive, setIsEventLive] = useState(false);
    const [eventEnded, setEventEnded] = useState(false);
    
    // Check if event is live or ended
    useEffect(() => {
        const checkEventStatus = () => {
            const now = new Date();
            const event = new Date(eventDate);
            
            // Assuming the event lasts 3 hours
            const eventEndTime = new Date(event.getTime() + 3 * 60 * 60 * 1000);
            
            if (now >= event && now <= eventEndTime) {
                setIsEventLive(true);
                setEventEnded(false);
            } else if (now > eventEndTime) {
                setIsEventLive(false);
                setEventEnded(true);
            } else {
                setIsEventLive(false);
                setEventEnded(false);
            }
        };
        
        checkEventStatus();
        const interval = setInterval(checkEventStatus, 60000); // Check every minute
        
        return () => clearInterval(interval);
    }, [eventDate]);

    return (
        <section className="relative py-20 overflow-hidden bg-muted/30 dark:bg-background/50">
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-5%] w-96 h-96 bg-amber/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-[-10%] right-[-5%] w-96 h-96 bg-violet/10 rounded-full blur-3xl"></div>
            </div>

            <div className="container relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Content Side */}
                    <div className="flex flex-col gap-8 text-center lg:text-start">
                        <div className="space-y-4">
                            <h2 className="text-4xl md:text-5xl font-bold font-cairo leading-tight">
                                <span className="text-primary">
                                    {t("upcoming.title")}
                                </span>
                            </h2>
                        </div>

                        <div className="flex justify-center lg:justify-start">
                            <AnimatedCountdown targetDate={eventDate} />
                        </div>

                        <Link to="/events/f421d12e-55ad-46f6-aa30-622bbae6f6aa" className="pt-4">
                            <Button variant="amber" size="CTA" className="group">
                                {t('eventsPage.category.cards.viewDetails')}
                                <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                            </Button>
                        </Link>
                    </div>

                    {/* Visual Side */}
                    <div className="relative">
                        <div className="relative rounded-sm overflow-hidden shadow-2xl border border-white/20 dark:border-white/10 aspect-video lg:aspect-auto lg:h-[500px]">
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10 pointer-events-none"></div>
                            <AutoFadeCarousel images={upcomingEventImgs} delay={3000} />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default UpcomingEvent;
