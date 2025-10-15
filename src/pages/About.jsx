import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
    Target,
    Users,
    Zap,
    Shield,
    Heart,
    Globe,
    Linkedin,
    Facebook,
    Instagram,
} from "lucide-react";
import { AuroraBackground } from "@/components/ui/shadcn-io/aurora-background";
import { CountingNumber } from "@/components/ui/shadcn-io/counting-number";
import { t } from "i18next";

const About = () => {
    const values = [
        {
            icon: Target,
            title: t("aboutUs.values.mission.title"),
            img: "/images/about/mission.jpeg",
            description: t("aboutUs.values.mission.desc"),
        },
        {
            icon: Users,
            title: t("aboutUs.values.community.title"),
            img: "/images/about/community.jpeg",
            description: t("aboutUs.values.community.desc"),
        },
        {
            icon: Zap,
            title: t("aboutUs.values.innovation.title"),
            img: "/images/about/innovation.jpeg",
            description: t("aboutUs.values.innovation.desc"),
        },
        {
            icon: Shield,
            title: t("aboutUs.values.trust.title"),
            img: "/images/about/safety.jpeg",
            description: t("aboutUs.values.trust.desc"),
        },
    ];

    const stats = [
        { number: "10K+", label: t("aboutUs.statsSection.activeEvents") },
        { number: "500K+", label: t("aboutUs.statsSection.happyClients") },
        { number: "2K+", label: t("aboutUs.statsSection.organizers") },
        { number: "50+", label: t("aboutUs.statsSection.cities") },
    ];

    const team = [
        {
            name: t("aboutUs.team.mahmoud"),
            img: "/images/about/mahmoud.jpeg",
            linkedin: "#",
            insta: "#",
            facebook: "#",
        },
        {
            name: t("aboutUs.team.mohamed"),
            linkedin: "#",
            insta: "#",
            facebook: "#",
            img: "/images/about/mohamed.jpeg",
        },
        {
            name: t("aboutUs.team.mariam"),
            linkedin: "#",
            insta: "#",
            facebook: "#",
            img: "/images/about/mariem.jpeg",
        },
        {
            name: t("aboutUs.team.islam"),
            linkedin: "#",
            insta: "#",
            facebook: "#",
            img: "/images/about/islam.jpeg",
        },
        {
            name: t("aboutUs.team.mustafa"),
            linkedin: "#",
            insta: "#",
            facebook: "#",
            img: "/images/about/moustafa.jpeg",
        },
        {
            name: t("aboutUs.team.nadeen"),
            linkedin: "#",
            insta: "#",
            facebook: "#",
            img: "/images/about/nadeen.jpeg",
        },
    ];

    return (
        <div className='min-h-screen flex flex-col bg-background'>
            <main className='flex-1'>
                {/* Hero Section */}
                <AuroraBackground>
                    <section className='border-b min-h-screen flex-center relative'>
                        <div className='container py-24'>
                            <div className='max-w-3xl mx-auto text-center space-y-4 animate-fade-in'>
                                <div className='inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/10 backdrop-blur-2xl border text-foreground text-sm font-medium mb-4'>
                                    <Heart className='h-4 w-4 text-amber' />
                                    <span>{t("aboutUs.head.subTitle")}</span>
                                </div>
                                <h1 className='text-4xl md:text-5xl font-bold text-gradient-amber dark:text-gradient-amber drop-shadow-[0px_4px_5px_rgba(0,0,0,0.15)]'>
                                    {t("aboutUs.head.title")}
                                </h1>
                                <p className='text-lg text-muted-foreground'>
                                    {t("aboutUs.head.desc")}
                                </p>
                            </div>
                        </div>
                    </section>
                </AuroraBackground>

                {/* Stats Section */}
                <section className='py-12 bg-gradient-violet'>
                    <div className='container px-4 md:px-6'>
                        <div className='grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto'>
                            {stats.map((stat, index) => (
                                <div
                                    key={stat.label}
                                    className='text-center animate-scale-in'
                                    style={{
                                        animationDelay: `${index * 100}ms`,
                                    }}
                                >
                                    <div className='text-3xl md:text-5xl font-bold bg-gradient-amber bg-clip-text text-transparent mb-2'>
                                        <CountingNumber number={stat.number} />
                                        {index !== 3 && "K"}+
                                    </div>
                                    <div className='text-sm md:text-base text-gray-300'>
                                        {stat.label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Story Section */}
                <section className='py-16 md:py-24'>
                    <div className='container px-4 md:px-6'>
                        <div className='max-w-4xl mx-auto space-y-8'>
                            <div className='text-center space-y-4 mb-12'>
                                <h2 className='text-3xl md:text-4xl font-bold'>
                                    {t("aboutUs.ourStory.title")}
                                </h2>
                                <p className='text-lg text-muted-foreground max-w-2xl mx-auto'>
                                    {t("aboutUs.ourStory.subTitle")}
                                </p>
                            </div>

                            <div className='prose prose-lg max-w-none space-y-6 text-muted-foreground text-center leading-10'>
                                <p>{t("aboutUs.ourStory.desc")}</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Values Section */}
                <section className='py-16 md:py-24 bg-muted/30'>
                    <div className='container px-4 md:px-6'>
                        <div className='text-center space-y-4 mb-12'>
                            <h2 className='text-3xl md:text-4xl font-bold'>
                                {t("aboutUs.values.title")}
                            </h2>
                            <p className='text-lg text-muted-foreground max-w-2xl mx-auto'>
                                {t("aboutUs.values.subTitle")}
                            </p>
                        </div>

                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto'>
                            {values.map((value, i) => (
                                <div
                                    key={value.title}
                                    className='rounded-xl relative overflow-hidden'
                                >
                                    <img
                                        src={value.img}
                                        alt={value.title}
                                        className='w-full h-full object-cover absolute top-1/2 left-1/2 -translate-1/2'
                                    />
                                    <div className='p-6 space-y-4 relative z-10 bg-muted/50 w-full h-full hover:backdrop-blur-xs transition-all'>
                                        <div className='flex h-12 w-12 items-center justify-center rounded-lg border-2 border-amber/50 text-white'>
                                            <value.icon className='h-6 w-6 text-amber' />
                                        </div>
                                        <h3 className='font-semibold text-lg text-foreground'>
                                            {value.title}
                                        </h3>
                                        <p className='text-sm text-foreground'>
                                            {value.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Team Section */}
                <section className='py-16 md:py-24'>
                    <div className='container px-4 md:px-6'>
                        <div className='text-center space-y-4 mb-12'>
                            <h2 className='text-3xl md:text-4xl font-bold'>
                              {t("aboutUs.team.title")}
                            </h2>
                            <p className='text-lg text-muted-foreground max-w-2xl mx-auto'>
                                {t("aboutUs.team.subTitle")}
                            </p>
                        </div>

                        <div className='grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto'>
                            {team.map((member, index) => (
                                <div
                                    key={member.name}
                                    className='relative aspect-square rounded-xl overflow-hidden group hover:shadow-xl transition-all duration-300 hover:scale-105'
                                >
                                    <div className='absolute top-1/2 left-1/2 -translate-1/2 w-full h-full'>
                                        <img
                                            src={member.img}
                                            alt={member.name}
                                            className='w-full h-full object-cover'
                                        />
                                    </div>
                                    <div className='translate-y-18 group-hover:translate-0 transition duration-300 flex justify-end flex-col gap-4 h-full p-4 md:p-6 bg-gradient-to-t from-muted to-transparent relative z-10'>
                                        <h3 className='font-semibold text-lg text-foreground'>
                                            {member.name}
                                        </h3>
                                        <div className='flex gap-4'>
                                            <a
                                                href={member.linkedin}
                                                className='w-fit px-3 bg-muted/30 backdrop-blur-xs border rounded-full aspect-square flex-center shadow hover:scale-105 transition'
                                            >
                                                <Linkedin
                                                    size={15}
                                                    className='text-[#0a66c2]'
                                                />
                                            </a>
                                            <a
                                                href={member.insta}
                                                className='w-fit px-3 bg-muted/30 backdrop-blur-xs border rounded-full aspect-square flex-center shadow hover:scale-105 transition'
                                            >
                                                <Instagram
                                                    size={15}
                                                    className='text-[#e1306c]'
                                                />
                                            </a>
                                            <a
                                                href={member.facebook}
                                                className='w-fit px-3 bg-muted/30 backdrop-blur-xs border rounded-full aspect-square flex-center shadow hover:scale-105 transition'
                                            >
                                                <Facebook
                                                    size={15}
                                                    className='text-[#1877F2]'
                                                />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className='py-16 md:py-24 bg-gradient-violet'>
                    <div className='container px-4 md:px-6'>
                        <div className='max-w-3xl mx-auto text-center space-y-6'>
                            <Globe className='h-16 w-16 mx-auto mb-4' />
                            <h2 className='text-3xl md:text-5xl font-bold text-gradient-amber'>
                                {t("aboutUs.ctaSec.title")}
                            </h2>
                            <p className='text-lg md:text-xl text-white/90'>
                                {t("aboutUs.ctaSec.desc")}
                            </p>
                            <div className='flex flex-col sm:flex-row gap-4 justify-center pt-4'>
                                <Link to='/events'>
                                    <Button
                                        variant='secondary'
                                        size='lg'
                                        className='text-primary hover:scale-105 transition-transform'
                                    >
                                        {t('button.explore')}
                                    </Button>
                                </Link>
                                <Link to='/contact'>
                                    <Button
                                        variant='outline'
                                        size='lg'
                                        className='bg-white/10 text-white border-white/30 hover:bg-white/20'
                                    >
                                        {t('button.contactUs')}
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default About;
