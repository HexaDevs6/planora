import CategoryCard from "@/components/Cards/CategoryCard";
import PagesHeader from "@/components/PagesHeader";
import i18next, { t } from "i18next";
import {
  BookOpen,
  Briefcase,
  Building2,
  Clapperboard,
  Cpu,
  Dumbbell,
  Gift,
  GraduationCap,
  Grid3x3,
  Hammer,
  HeartPulse,
  Medal,
  Music,
  Palette,
  Presentation,
  Sparkles,
  Store,
  Utensils,
} from "lucide-react";
import React, { useEffect } from "react";
import EventCard from "@/components/Cards/EventCard";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { setVisibleCount } from "@/store/searchAndFilterEventsSlice";
import { fetchCategories } from "@/store/fetchCategoriesThunk";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { fetchEvents } from "@/store/fetchEventsThunk";
export default function Events() {
  7;
  const query = useSelector((state) =>
    state.eventsSearchAndFilter.query.toLowerCase().trim()
  );
  const dispatch = useDispatch();
  const currentLang = i18next.language;

  // get categories from supabase
  const { data, loading } = useSelector((state) => state.categories);

  const filterData = data.filter((category) => category.type === "event");
  const icons = [
    Palette,
    Gift,
    Briefcase,
    Presentation,
    Building2,
    GraduationCap,
    Clapperboard,
    Store,
    Utensils,
    Medal,
    HeartPulse,
    Music,
    BookOpen,
    Dumbbell,
    Cpu,
    Sparkles,
    Hammer,
  ];

  // get events from supabase
  const { eventsData, eventsLoading } = useSelector((state) => state.events);
  console.log(eventsData);

  useEffect(() => {
    dispatch(fetchEvents());
    dispatch(fetchCategories());
  }, [dispatch]);

  // filter category
  const filterQuery = useSelector((state) =>
    state.eventsSearchAndFilter.filter.toLowerCase()
  );

  // apply search
  const filterSearch =
    filterQuery == "all" || filterQuery == "الجميع"
      ? eventsData.filter((el) => el.name.toLowerCase().trim().includes(query))
      : eventsData
          .filter((el) => el.name.toLowerCase().trim().includes(query))
          .filter((el) => el.category.toLowerCase() === filterQuery);
  const visibleEvents = useSelector(
    (state) => state.eventsSearchAndFilter.visibleCount
  );

  // get visible events from redux store
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
            {loading ? (
              <p className="text-primary text-4xl md:text-3xl font-bold drop-shadow-2xl py-30 text-center">
                {t("eventsPage.loading.category")}
              </p>
            ) : (
              <div
                className="w-full px-4 py-6"
                dir={currentLang === "ar" ? "rtl" : "ltr"}
              >
                <Swiper
                  key={currentLang === "ar" ? "rtl" : "ltr"} // ✅ يعيد تهيئة السلايدر عند تغيير اللغة
                  dir={currentLang === "ar" ? "rtl" : "ltr"} // ✅ يضبط الاتجاه
                  modules={[Autoplay]}
                  spaceBetween={20}
                  slidesPerView={2}
                  autoplay={{ delay: 4000, disableOnInteraction: false }}
                  breakpoints={{
                    640: { slidesPerView: 3 },
                    768: { slidesPerView: 4 },
                    1024: { slidesPerView: 5 },
                  }}
                  className="w-full"
                  style={{ padding: "8px" }}
                >
                  {/* العنصر الأول (All) */}
                  <SwiperSlide>
                    <div className="animate-scale-in">
                      <CategoryCard
                        name={t("eventsPage.category.cateCards.title0")}
                        icon={Grid3x3}
                        type="event"
                      />
                    </div>
                  </SwiperSlide>

                  {/* باقي الكاتيجوريز */}
                  {filterData.map((category, index) => (
                    <SwiperSlide key={category.name}>
                      <div
                        className="animate-scale-in"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <CategoryCard
                          name={
                            currentLang === "ar"
                              ? category.name_ar
                              : category.name
                          }
                          icon={icons[index]}
                          type="event"
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            )}

            {eventsLoading ? (
              <p className="text-primary text-4xl md:text-3xl font-bold drop-shadow-2xl py-30 text-center">
                {t("eventsPage.loading.cards")}
              </p>
            ) : (
              <div className="py-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {viewEvents.map((el) => (
                  <EventCard
                    key={el.id}
                    id={el.id}
                    title={currentLang === "ar" ? el.name_ar : el.name}
                    image={el.thumbnail || "https://placehold.co/400x300"}
                    date={
                      el.date
                        ? new Date(el.date).toLocaleDateString(currentLang)
                        : "N/A"
                    }
                    location={el.location || "Unspecified"}
                    category={el.category}
                    price={el.is_free ? t("eventsPage.free") : `$${el.price}`}
                    attendees={el.capacity}
                  />
                ))}
              </div>
            )}

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
