import React from "react";
import CallToAction from "@/components/CallToAction";
import HeroSection from "@/components/HeroSection";
import UpcomingEvent from "@/components/UpcomingEvent";
import  Navbar  from "@/components/NavBar";
import { Navbar10 } from "@/components/ui/shadcn-io/navbar-10/index";

function Home() {
    return (
        <>
            {/* <Navbar10 /> */}
            <Navbar />
            <HeroSection />
            <CallToAction />
            <UpcomingEvent />
        </>
    );
}

export default Home;
