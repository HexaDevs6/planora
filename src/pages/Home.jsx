import React from "react";
import CallToAction from "@/components/CallToAction";
import HeroSection from "@/components/HeroSection";
import UpcomingEvent from "@/components/UpcomingEvent";
import PlanSection from "@/components/PlanSection";
import EventsCategoriesSection from "@/components/EventsCategoriesSection";
import ProvidersSection from "@/components/ProvidersSection";
import JoinSection from "@/components/JoinSection";

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
