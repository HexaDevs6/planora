import React from "react";
import CallToAction from "@/components/home/CallToAction";
import HeroSection from "@/components/home/HeroSection";
import UpcomingEvent from "@/components/home/UpcomingEvent";
import PlanSection from "@/components/home/PlanSection";
import EventsCategoriesSection from "@/components/home/EventsCategoriesSection";
import ProvidersSection from "@/components/home/ProvidersSection";
import JoinSection from "@/components/home/JoinSection";

function Home() {
    return (
        <>
            <HeroSection />
            <CallToAction />
            <UpcomingEvent />
            <PlanSection />
            <EventsCategoriesSection />
            <ProvidersSection />
            <JoinSection />
        </>
    );
}

export default Home;
