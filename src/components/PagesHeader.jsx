import React, { useState } from "react";
import SecondHeaderImg from "../assets/HeaderImg.jpg";
import { Search } from "lucide-react";
import { t } from "i18next";
import { Input } from "./ui/input";
import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from "./ui/select";
import { useDispatch, useSelector } from "react-redux";
import { setSearchQuery } from "@/store/searchAndFilterEventsSlice";
import { setServiceSearchQuery } from "@/store/searchAndFilterServiceSlice";
export default function PagesHeader({ img, title, subtitle, search, type }) {
  img = img || SecondHeaderImg;

  const [sortBy, setSortBy] = useState();

  const dispatch = useDispatch();
  const query =
    type === "event"
      ? useSelector((state) => state.eventsSearchAndFilter.query)
      : useSelector((state) => state.servicesSearchAndFilter.queryService);

  const setQuery = type === "event" ? setSearchQuery : setServiceSearchQuery;

  return (
    <header
      id="allArticles"
      className="relative min-h-[60vh] py-12 px-8 flex items-center justify-center text-center bg-cover bg-center"
      style={{
        backgroundImage: `url(${img})`,
      }}
    >
      <div className="absolute inset-0 bg-violet/70 dark:bg-violet/50 "></div>

      <div className="relative z-10 flex flex-col gap-5 max-w-4xl w-full mx-auto text-center">
        <div className=" space-y-4">
          <h1 className="text-white text-4xl md:text-5xl font-bold drop-shadow-2xl">
            {title}
          </h1>
          <p className="text-lg md:text-xl text-white/70">{subtitle}</p>
        </div>
        <div>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white" />
              <Input
                type="text"
                placeholder={search}
                value={query}
                onChange={(e) => dispatch(setQuery(e.target.value))}
                className="pl-10 h-12 border focus:outline-amber-300"
              />
            </div>
            <div className="relative">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="sm:w-[100px] py-6">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="">
                  <SelectItem
                    className="text-white hover:bg-white hover:text-black"
                    value="latest"
                  >
                    Latest
                  </SelectItem>
                  <SelectItem
                    className="text-white hover:bg-white hover:text-black"
                    value="popular"
                  >
                    Most Popular
                  </SelectItem>
                  <SelectItem
                    className="text-white hover:bg-white hover:text-black"
                    value="price-low"
                  >
                    Price: Low to High
                  </SelectItem>
                  <SelectItem
                    className="text-white hover:bg-white hover:text-black"
                    value="price-high"
                  >
                    Price: High to Low
                  </SelectItem>
                  <SelectItem
                    className="text-white hover:bg-white hover:text-black"
                    value="date"
                  >
                    Date
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
