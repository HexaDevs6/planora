import CategoryCard from "@/components/Cards/CategoryCard";
import PagesHeader from "@/components/PagesHeader";
import { t } from "i18next";
import {
  Briefcase,
  Camera,
  ChartGantt,
  Disc3,
  Dumbbell,
  GraduationCap,
  Grid3x3,
  Music,
  Palette,
  SprayCan,
  Users,
  Utensils,
  VenetianMask,
} from "lucide-react";

import React from "react";

import photographerImage from "@/assets/service-photographer.jpg";
import plannerImage from "@/assets/service-planner.jpg";
import djImage from "@/assets/service-dj.jpg";
import cateringImage from "@/assets/service-catering.jpg";

import EventCard from "@/components/Cards/EventCard";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { setVisibleCount } from "@/store/searchSlice";
import ServiceCard from "@/components/Cards/ServiceCard";

export default function Services() {
  const query = useSelector((state) => state.search.query.toLowerCase().trim());
  const dispatch = useDispatch();
  const services = [
    {
      id: "1",
      title: t("servicesPage.cards.1.title"),
      provider: "LensMaster Studios",
      image: photographerImage,
      category: t("servicesPage.cards.1.category"),
      location: t("servicesPage.cards.1.location"),
      rating: 4.9,
      reviews: 128,
      priceRange: "$800-$2,000",
      verified: true,
    },
    {
      id: "2",
      title: t("servicesPage.cards.2.title"),
      provider: "Elite Events Co.",
      image: plannerImage,
      category: t("servicesPage.cards.2.category"),
      location: t("servicesPage.cards.2.location"),
      rating: 4.8,
      reviews: 95,
      priceRange: "$1,500-$5,000",
      verified: true,
    },
    {
      id: "3",
      title: t("servicesPage.cards.3.title"),
      provider: "SoundWave Productions",
      image: djImage,
      category: t("servicesPage.cards.3.category"),
      location: t("servicesPage.cards.3.location"),
      rating: 4.9,
      reviews: 156,
      priceRange: "$500-$1,500",
      verified: true,
    },
    {
      id: "4",
      title: t("servicesPage.cards.4.title"),
      provider: "Culinary Delights",
      image: cateringImage,
      category: t("servicesPage.cards.4.category"),
      location: t("servicesPage.cards.4.location"),
      rating: 4.7,
      reviews: 203,
      priceRange: "$30-$80/person",
      verified: true,
    },
    {
      id: "5",
      title: t("servicesPage.cards.5.title"),
      provider: "Moment Capture Studio",
      image: photographerImage,
      category: t("servicesPage.cards.5.category"),
      location: t("servicesPage.cards.5.location"),
      rating: 4.8,
      reviews: 87,
      priceRange: "$1,200-$3,000",
      verified: false,
    },
    {
      id: "6",
      title: t("servicesPage.cards.6.title"),
      provider: "ProEvent Solutions",
      image: plannerImage,
      category: t("servicesPage.cards.6.category"),
      location: t("servicesPage.cards.6.location"),
      rating: 4.9,
      reviews: 142,
      priceRange: "$2,000-$10,000",
      verified: true,
    },
    {
      id: "7",
      title: t("servicesPage.cards.7.title"),
      provider: "Party Vibes Entertainment",
      image: djImage,
      category: t("servicesPage.cards.7.category"),
      location: t("servicesPage.cards.7.location"),
      rating: 4.6,
      reviews: 73,
      priceRange: "$800-$2,500",
      verified: false,
    },
    {
      id: "8",
      title: t("servicesPage.cards.8.title"),
      provider: "Gourmet Events",
      image: cateringImage,
      category: t("servicesPage.cards.8.category"),
      location: t("servicesPage.cards.8.location"),
      rating: 4.9,
      reviews: 167,
      priceRange: "$50-$150/person",
      verified: true,
    },
  ];

  const filterQuery = useSelector((state) => state.search.filter.toLowerCase());
  console.log(filterQuery);

  const filterSearch =
    filterQuery == "all" || filterQuery == "الجميع"
      ? services.filter((el) => el.title.toLowerCase().trim().includes(query))
      : services
          .filter((el) => el.title.toLowerCase().trim().includes(query))
          .filter((el) => el.category.toLowerCase() === filterQuery);
  const visibleEvents = useSelector((state) => state.search.visibleCount);

  const categories = [
    {
      name: t("servicesPage.category.cateCards.title0"),
      icon: Grid3x3,
      count: 300,
    },
    {
      name: t("servicesPage.category.cateCards.title1"),
      icon: Camera,
      count: 245,
    },
    {
      name: t("servicesPage.category.cateCards.title2"),
      icon: ChartGantt,
      count: 189,
    },
    {
      name: t("servicesPage.category.cateCards.title3"),
      icon: Disc3,
      count: 156,
    },
    {
      name: t("servicesPage.category.cateCards.title4"),
      icon: Utensils,
      count: 132,
    },
    {
      name: t("servicesPage.category.cateCards.title5"),
      icon: SprayCan,
      count: 298,
    },
    {
      name: t("servicesPage.category.cateCards.title6"),
      icon: VenetianMask,
      count: 167,
    },
  ];

  const viewService = filterSearch.slice(0, visibleEvents);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PagesHeader
        search={`${t("servicesPage.header.search")}`}
        title={`${t("servicesPage.header.title")}`}
        subtitle={`${t("servicesPage.header.subTitle")}`}
      />
      <main className="flex-1">
        <section className="py-16 md:pt-20 bg-muted/30">
          <div className="container px-4 md:px-6">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl text-primary md:text-4xl font-bold">
                {t("eventsPage.category.title")}
              </h2>
              <p className="text-lg text-text max-w-2xl mx-auto">
                {t("eventsPage.category.subTitle")}
              </p>
            </div>

            <div className="grid grid-cols-2 mb-10 md:grid-cols-3 lg:grid-cols-7 gap-4 md:gap-6">
              {categories.map((category, index) => (
                <div
                  key={category.name}
                  className="animate-scale-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CategoryCard {...category} />
                </div>
              ))}
            </div>

            <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {viewService.map((el) => (
                <ServiceCard
                  key={el.id}
                  id={el.id}
                  title={el.title}
                  image={el.image}
                  rating={el.rating}
                  reviews={el.reviews}
                  location={el.location}
                  category={el.category}
                  priceRange={el.priceRange}
                  verified={el.verified}
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
          <section className="py-16 mt-15 bg-amber">
              <div className="container px-4 md:px-6">
                <div className="max-w-3xl mx-auto text-center space-y-6 text-white">
                  <h2 className="text-3xl md:text-4xl font-bold">
                    Are You a Service Provider?
                  </h2>
                  <p className="text-lg text-white/90">
                    Join our marketplace and connect with thousands of event
                    organizers looking for professional services
                  </p>
                  <Button
                    variant="primary"
                    size="lg"
                    className="text-white hover:scale-105 transition-transform"
                  >
                    Become a Provider
                  </Button>
                </div>
              </div>
            </section>
        </section>
      </main>
    </div>
  );
}
