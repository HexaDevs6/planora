import React from "react";
import CallToAction from "@/components/CallToAction";
import HeroSection from "@/components/HeroSection";
import UpcomingEvent from "@/components/UpcomingEvent";
import Navbar from "@/components/NavBar";
import PlanSection from "@/components/PlanSection";
import EventsCategoriesSection from "@/components/EventsCategoriesSection";
import ProvidersSection from "@/components/ProvidersSection";
import JoinSection from "@/components/JoinSection";
import FooterSection from "@/components/FooterSection";
import { Navbar10 } from "@/components/ui/shadcn-io/navbar-10/index";

function Home() {
    return (
        <>
            {/* <Navbar10 /> */}
            <Navbar />
            <HeroSection />
            <CallToAction />
            <UpcomingEvent />
            <PlanSection />
            <EventsCategoriesSection />
            <ProvidersSection />
            <JoinSection />
            <FooterSection />
        </>
    );
}

export default Home;
