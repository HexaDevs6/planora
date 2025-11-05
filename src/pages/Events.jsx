import CategoryCard from "@/components/Cards/CategoryCard";
import PagesHeader from "@/components/PagesHeader";
import { t } from "i18next";
import {
  Briefcase,
  Dumbbell,
  GraduationCap,
  Grid3x3,
  Music,
  Palette,
  Users,
} from "lucide-react";
import React, { useState } from "react";

import conferenceImage from "@/assets/event-conference.jpg";
import concertImage from "@/assets/event-concert.jpg";
import workshopImage from "@/assets/event-workshop.jpg";
import sportsImage from "@/assets/event-sports.jpg";
import exhibitionImage from "@/assets/event-exhibition.jpg";
import networkingImage from "@/assets/event-networking.jpg";

import EventCard from "@/components/Cards/EventCard";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import {
  setFilterQuery,
  setVisibleCount,
} from "@/store/searchAndFilterEventsSlice";

export default function Events() {
  const query = useSelector((state) =>
    state.eventsSearchAndFilter.query.toLowerCase().trim()
  );
  const dispatch = useDispatch();
  const allEvents = [
    {
      id: "1",
      title: t("eventsPage.category.cards.1.title"),
      image: conferenceImage,
      date: t("eventsPage.category.cards.1.data"),
      location: t("eventsPage.category.cards.1.category"),
      category: "Conferences",
      price: "$299",
      attendees: 850,
    },
    {
      id: "2",
      title: t("eventsPage.category.cards.2.title"),
      image: concertImage,
      date: t("eventsPage.category.cards.2.data"),
      location: t("eventsPage.category.cards.2.category"),
      category: "Concerts",
      price: "$149",
      attendees: 2400,
    },
    {
      id: "3",
      title: t("eventsPage.category.cards.3.title"),
      image: workshopImage,
      date: t("eventsPage.category.cards.3.data"),
      location: t("eventsPage.category.cards.3.location"),
      category: t("eventsPage.category.cards.3.category"),
      price: "Free",
      attendees: 456,
    },
    {
      id: "4",
      title: t("eventsPage.category.cards.4.title"),
      image: sportsImage,
      date: t("eventsPage.category.cards.4.data"),
      location: t("eventsPage.category.cards.4.location"),
      category: t("eventsPage.category.cards.4.category"),
      price: "$45",
      attendees: 1200,
    },
    {
      id: "5",
      title: t("eventsPage.category.cards.5.title"),
      image: exhibitionImage,
      date: t("eventsPage.category.cards.5.data"),
      location: t("eventsPage.category.cards.5.location"),
      category: t("eventsPage.category.cards.5.category"),
      price: "$25",
      attendees: 680,
    },
    {
      id: "6",
      title: t("eventsPage.category.cards.6.title"),
      image: networkingImage,
      date: t("eventsPage.category.cards.6.data"),
      location: t("eventsPage.category.cards.6.location"),
      category: t("eventsPage.category.cards.6.category"),
      price: "Free",
      attendees: 320,
    },
    {
      id: "7",
      title: t("eventsPage.category.cards.7.title"),
      image: workshopImage,
      date: t("eventsPage.category.cards.7.data"),
      location: t("eventsPage.category.cards.7.location"),
      category: t("eventsPage.category.cards.7.category"),
      price: "$499",
      attendees: 180,
    },
    {
      id: "8",
      title: t("eventsPage.category.cards.8.title"),
      image: concertImage,
      date: t("eventsPage.category.cards.8.data"),
      location: t("eventsPage.category.cards.8.location"),
      category: t("eventsPage.category.cards.8.category"),
      price: "$75",
      attendees: 650,
    },
    {
      id: "9",
      title: t("eventsPage.category.cards.9.title"),
      image: conferenceImage,
      date: t("eventsPage.category.cards.9.data"),
      location: t("eventsPage.category.cards.9.location"),
      category: t("eventsPage.category.cards.9.category"),
      price: "$399",
      attendees: 920,
    },
    {
      id: "10",
      title: t("eventsPage.category.cards.10.title"),
      image: conferenceImage,
      date: t("eventsPage.category.cards.10.data"),
      location: t("eventsPage.category.cards.10.location"),
      category: t("eventsPage.category.cards.10.category"),
      price: "$299",
      attendees: 850,
    },
    {
      id: "11",
      title: t("eventsPage.category.cards.11.title"),
      image: concertImage,
      date: t("eventsPage.category.cards.11.data"),
      location: t("eventsPage.category.cards.11.location"),
      category: t("eventsPage.category.cards.11.category"),
      price: "$149",
      attendees: 2400,
    },
    {
      id: "12",
      title: t("eventsPage.category.cards.12.title"),
      image: workshopImage,
      date: t("eventsPage.category.cards.12.data"),
      location: t("eventsPage.category.cards.12.location"),
      category: t("eventsPage.category.cards.12.category"),
      price: "Free",
      attendees: 456,
    },
  ];

  const filterQuery = useSelector((state) =>
    state.eventsSearchAndFilter.filter.toLowerCase()
  );
  console.log(filterQuery);

  const filterSearch =
    filterQuery == "all" || filterQuery == "الجميع"
      ? allEvents.filter((el) => el.title.toLowerCase().trim().includes(query))
      : allEvents
          .filter((el) => el.title.toLowerCase().trim().includes(query))
          .filter((el) => el.category.toLowerCase() === filterQuery);
  const visibleEvents = useSelector(
    (state) => state.eventsSearchAndFilter.visibleCount
  );

  const categories = [
    {
      name: t("eventsPage.category.cateCards.title0"),
      icon: Grid3x3,
      count: 300,
    },
    {
      name: t("eventsPage.category.cateCards.title1"),
      icon: Music,
      count: 245,
    },
    {
      name: t("eventsPage.category.cateCards.title2"),
      icon: Briefcase,
      count: 189,
    },
    {
      name: t("eventsPage.category.cateCards.title3"),
      icon: Dumbbell,
      count: 156,
    },
    {
      name: t("eventsPage.category.cateCards.title4"),
      icon: Palette,
      count: 132,
    },
    {
      name: t("eventsPage.category.cateCards.title5"),
      icon: GraduationCap,
      count: 298,
    },
    {
      name: t("eventsPage.category.cateCards.title6"),
      icon: Users,
      count: 167,
    },
  ];

  const viewEvents = filterSearch.slice(0, visibleEvents);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PagesHeader
        search={`${t("eventsPage.header.search")}`}
        title={`${t("eventsPage.header.title")}`}
        subtitle={`${t("eventsPage.header.subTitle")}`}
        type="event"
      />
      <main className="flex-1">
        <section className="py-16 md:py-10 bg-muted/30">
          <div className="container px-4 md:px-6">
            <div className="grid grid-cols-2 mb-10 md:grid-cols-3 lg:grid-cols-7 gap-4 md:gap-6">
              {categories.map((category, index) => (
                <div
                  key={category.name}
                  className="animate-scale-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CategoryCard {...category} type="event" />
                </div>
              ))}
            </div>

            <div className="py-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {viewEvents.map((el) => (
                <EventCard
                  key={el.id}
                  id={el.id}
                  title={el.title}
                  image={el.image}
                  date={el.date}
                  location={el.location}
                  category={el.category}
                  price={el.price}
                  attendees={el.attendees}
                />
              ))}
            </div>

            {visibleEvents < filterSearch.length && (
              <div className="w-fit mx-auto">
                <Button
                  onClick={() => dispatch(setVisibleCount())}
                  size="CTA"
                  variant="amber"
                >
                  {t("eventsPage.category.viewMore")}
                </Button>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
