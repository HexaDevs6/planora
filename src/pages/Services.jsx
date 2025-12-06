import CategoryCard from "@/components/Cards/CategoryCard";
import PagesHeader from "@/components/PagesHeader";
import i18next, { t } from "i18next";
import {
  Grid3x3,
  UtensilsCrossed,
  Flower2,
  UserCheck,
  Lightbulb,
  Music2,
  Camera,
  CalendarCheck2,
  ShieldCheck,
  Bus,
  Sparkles,
  LoaderPinwheel,
} from "lucide-react";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { setServiceVisibleCount } from "@/store/searchAndFilterServiceSlice";
import ServiceCard from "@/components/Cards/ServiceCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
// import "swiper/css";
import { fetchCategories } from "@/store/fetchCategoriesThunk";
import { fetchServices } from "@/store/fetchServicesThunk";
import loremService from "@/assets/loremService.jfif";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";
import { getPublicUrl } from "@/lib/storage";
import { Link } from "react-router-dom";

export default function Services() {
  const query = useSelector((state) =>
    state.servicesSearchAndFilter.queryService.toLowerCase().trim()
  );
  const dispatch = useDispatch();
  const currentLang = i18next.language;

  // get categories from supabase
  const { data, loading } = useSelector((state) => state.categories);

  const filterData = data.filter((cat) => cat.type === "service");
  console.log(filterData);

  const icons = [
    UtensilsCrossed,
    Sparkles,
    Flower2,
    UserCheck,
    Lightbulb,
    Music2,
    Camera,
    CalendarCheck2,
    ShieldCheck,
    Bus,
  ];

  const interestOptions = data
    .filter((category) => category.type === "service")
    .map((category) => ({
      ...category,
      displayName: currentLang === "ar" ? category.name_ar : category.name,
    }));

  // get services from supabase
  const {
    items: servicesData,
    loading: servicesLoading,
    error,
  } = useSelector((state) => state.services);

  useEffect(() => {
    if (!data.length) dispatch(fetchCategories());
    if (!servicesData.length) dispatch(fetchServices());
  }, [dispatch, servicesData.length, data.length]);

  // filter category
  const filterQuery = useSelector((state) =>
    state.servicesSearchAndFilter.filterService.toLowerCase()
  );

  // apply search
  const filterSearch =
    filterQuery == "all" || filterQuery == "الجميع"
      ? servicesData.filter((el) =>
        el.name.toLowerCase().trim().includes(query)
      )
      : servicesData
        .filter((el) => el.name.toLowerCase().trim().includes(query))
        .filter(
          (el) =>
            interestOptions
              .filter((item) => item.id === el.category_id)[0]
              ?.displayName.toLowerCase() === filterQuery
        );

  const visibleServices = useSelector(
    (state) => state.servicesSearchAndFilter.visibleCountService
  );
  // get visible services from redux store
  const viewService = filterSearch.slice(0, visibleServices);

  const handleThumbnail = function (el) {
    if (el) {
      if (el.startsWith("http")) {
        return el;
      } else {
        return getPublicUrl("services", el);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PagesHeader
        search={`${t("servicesPage.header.search")}`}
        title={`${t("servicesPage.header.title")}`}
        subtitle={`${t("servicesPage.header.subTitle")}`}
        type="service"
      />
      <main className="flex-1">
        <section className="pt-16 md:pt-10 bg-muted/30">
          <div className="container px-4 md:px-6">
            {loading ? (
              <p className="text-primary text-md font-semibold drop-shadow-2xl py-10 text-center">
                <LoaderPinwheel className="inline-block mx-3 animate-spin text-accent" />
                {t("servicesPage.loading.category")}
                <LoaderPinwheel className="inline-block mx-3 animate-spin text-accent" />
              </p>
            ) : (
              <div
                className="w-full h-full px-4 py-6"
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
                        name={t("servicesPage.category.cateCards.title0")}
                        icon={Grid3x3}
                        type="service"
                      />
                    </div>
                  </SwiperSlide>

                  {/* باقي الكاتيجوريز */}
                  {interestOptions.map((category, index) => (
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
                          type="service"
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            )}

            {/* <div className="py-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
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
            </div> */}

            {servicesLoading ? (
              <p className="text-primary text-md font-semibold drop-shadow-2xl py-10 text-center">
                <LoaderPinwheel className="inline-block mx-3 animate-spin text-accent" />
                {t("servicesPage.loading.cards")}
                <LoaderPinwheel className="inline-block mx-3 animate-spin text-accent" />
              </p>
            ) : (
              <div className="py-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {viewService.map((el, i) => (
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    key={el.id}
                  >
                    <ServiceCard
                      id={el.id}
                      title={currentLang === "ar" ? el.name_ar : el.name}
                      image={handleThumbnail(el.thumbnail) || loremService}
                      description={
                        currentLang === "ar"
                          ? el.description_ar
                          : el.description
                      }
                      category={
                        interestOptions.filter(
                          (item) => item.id === el.category_id
                        )[0]?.displayName
                      }
                      priceRange={
                        el.price ? `$${el.price}` : t("servicesPage.free")
                      }
                      available={el.available}
                      date={
                        el.created_at
                          ? new Date(el.created_at).toLocaleDateString(
                            currentLang
                          )
                          : "N/A"
                      }
                      provider_id={el.client_id}
                    />
                  </motion.div>
                ))}
              </div>
            )}

            {visibleServices < filterSearch.length && (
              <div className="w-fit mx-auto">
                <Button
                  onClick={() => dispatch(setServiceVisibleCount())}
                  size="CTA"
                  variant="amber"
                >
                  {t("servicesPage.cards.viewMore")}
                </Button>
              </div>
            )}
          </div>
          <section className="py-16 mt-15 bg-amber">
            <div className="container px-4 md:px-6">
              <div className="max-w-3xl mx-auto text-center space-y-6 text-white">
                <h2 className="text-3xl md:text-4xl font-bold">
                  {t("servicesPage.join.title")}
                </h2>
                <p className="text-lg text-white/90">
                  {t("servicesPage.join.description")}
                </p>
                <Link to="/user/create-service">
                  <Button
                    variant="primary"
                    size="lg"
                    className="text-white bg-violet hover:scale-105 transition-transform"
                  >
                    {t("servicesPage.join.button")}
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        </section>
      </main>
    </div>
  );
}
