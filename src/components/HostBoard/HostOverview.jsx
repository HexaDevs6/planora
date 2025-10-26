import React from "react";
import { Link, NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import BoardCard from "../BoardCard";
import { ArrowUpRightFromSquareIcon } from "lucide-react";
import Stats from "./StatsSection";
import EventCard from "../Cards/EventCard";
import RecentMessages from "./RecentMessagesSec";
import ReviewsSection from "../Reviews";

export default function UserOverview() {
    const hostMessages = [
        {
            name: "Jane Smith",
            message:
                "Hey, just wanted to follow up on the catering for the upcoming conference...",
            time: "2 hours ago",
            avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAnbAc-zfMaWNls3igWd_omvAutzQjCRkZV1tT36pc3fKNSQHyxXFIaSb6HZrw66xnxlunJVL754nbAZmUWvTPPKSxPfM_O6dqaBGQ307jbc24jQQseqbRElKN5R97TRmiwZbky2S-33HPkxElL0itdScaJLR6RFB-JcLv8UkLLR-BMJM-e98dCi0kSs7eeO1iDYD_6qCKOwyx9AG7XGQxamuAQgdIXXH8qPuHYM8pNd3pVVO4cjTTOCkSrXJ5Ol9T_XPPtDd3dgFwv",
        },
        {
            name: "Mike Johnson",
            message:
                "Can you send over the final attendee list for the workshop?",
            time: "5 hours ago",
            avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCk_uf3J5ghz33duXR6BenmRrIwMTOtg1OYFLUiWsEVq8915HCuOjw_4VHMYu2txwG5Ek01iCS4TwxmpEQSBcEz4l4iExSLL2RaElsXw5FlKvJFBDfYsuxs7bBAmuNOqJH7VWFzYTKhir9cqEqUagwWo2l4yMVvmeWcCMTv7IXWBKVFyjBeMn44XW-MFh5tbOPUoIwlInasOzfgKTcyxb2NxArEluWfXTe_LzLuHu3YF54wjtw2q5UjG9AYVAjxbD0s3VVRdgDqsCw2",
        },
        {
            name: "Sarah Chen",
            message:
                "Great job on the event last week! Everyone had a fantastic time.",
            time: "1 day ago",
            avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuACkJ9rSPCWZeYfhlkAQJLIRctiwGXNsiZmoi7cx7ZhGzsPKmc-vaSvQHgU-mrxEiSM0yK0rq40IUE2KHzv6LS8x2xK8lHvQA9cEh1VjvcPmBN6g91N9KDosWgV9PBCzN6uVvyP8qPgDBFdpqUvTPPhfeD3fD9Ji3eR4qMwThXUzHR18LT2lBHDlRd0E6rtTDeWtjp80VPuAkdrtt5IdiBNae2om3qacE_gNlMwwPEkaa-o4F5JZ14z7P8xtEqGk8BtdegP4NIiyiFf",
        },
    ];

    const sampleReviews = [
        {
            id: 1,
            title: "Absolutely fantastic!",
            content:
                "The tech conference was incredibly well-organized. The speakers were top-notch and the networking opportunities were priceless.",
            rating: 5,
            author: "Sarah Johnson",
            date: "Oct 15, 2025",
        },
        {
            id: 2,
            title: "Great content, minor issues.",
            content:
                "Enjoyed the workshop content. However, the venue was a bit crowded and the lunch options could have been better.",
            rating: 4,
            author: "Ahmed N.",
        },
        {
            id: 3,
            title: "Loved it!",
            content: "Perfect event! Looking forward to next year!",
            rating: 5,
            author: "Lina M.",
        },
    ];

    const hostStats = [
        { label: "Total Events", value: 12, change: "+5%", trend: "up" },
        {
            label: "Total Tickets Sold",
            value: "1,234",
            change: "+12%",
            trend: "up",
        },
        { label: "Revenue", value: "$56,789", change: "+8%", trend: "up" },
        { label: "Total Attendees", value: 890, change: "+3%", trend: "up" },
    ];

    return (
        <>
            <div className='overview bg-background flex flex-col gap-2 transition-all duration-300 ease-in-out '>
                <div className='host-stats'>
                    <div className=' host-stats__header flex justify-between'>
                        <h2 className='text-2xl font-bold text-primary mb-2 '>
                            Insights
                        </h2>
                    </div>
                    <div className='host-stats__content p-4'>
                        <Stats stats={hostStats} />
                    </div>
                </div>
                <h2 className='text-2xl font-bold text-primary mb-2 '>
                    Highlights
                </h2>
                <div className='highlights grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                    <div className='col-span-2 space-y-4'>
                        <RecentMessages messages={hostMessages} />
                        <ReviewsSection reviews={sampleReviews} />
                    </div>
                    <div className='host__next-event space-y-2'>
                        <div>
                            <EventCard
                                id={1}
                                title='Event 1'
                                image=' https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80'
                                date='2023-06-01'
                                location='Location 1'
                                category='Category 1'
                                price='100'
                                attendees='50'
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
