import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Phone,
  Video,
  Ellipsis,
  CirclePlus,
  Smile,
} from "lucide-react";
import i18n from "@/i18n";

export default function UserMessages() {
  const conversations = [
    {
      id: 1,
      name: "Jane Doe",
      lastMessage: "Sure, that sounds great!",
      avatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCSe4QfvY7U_DQUNpwE0lsca7chE-YfiuszC_DES_oqvr3p14WvI1QvnWK2DTwTrMQHWTj2F5ClvI9QOa5cXpZlDUVWJ6fLxSidggPOB34KB_OIw0wdegx_mgtTasdB5ag1zk7UgVlPzKw4hrJrS3_U1xsQiJxFcoMK0TQn88V_hzk7_BnXmwQEbqek3Es8FAQ_eLkRNMtEwkyB0fNo-ybMX1FhRX13jEX00JhPFb4eOHf-RVduyhNyTgqyD7gP-HO7LgiOyxLOEZYx",
      time: "2:45 PM",
      unread: 0,
      online: true,
    },
    {
      id: 2,
      name: "Acme Corp",
      lastMessage: "Perfect, we will proceed with the payment.",
      avatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDxhEWPxFOdvhzU1FzcY-98OyC5SXv0PRGkEPCGY0wlDsF4HrATrXT62Ld3ddJcwQrlX07n-VoFwHcNyvJMW4XiCME3oAW3NvfAkH_tfU9FCeRMKDxhFxozUwUr8ZoPcfvfVwlBCu-HQ5kYBCL6wWZDhPo3vvEsUgM4NCV03igPGmkDsI8KYNpmfxIqbccZEz7N8Kle0glJiI7pfdyK7ET-00fJ8OdtmzR9PH1erDWUn-C5zKGJbuqdrICZP899XjMhcBhVwoUICRDb",
      time: "Yesterday",
      unread: 2,
      online: false,
    },
    {
      id: 3,
      name: "John Smith",
      lastMessage: "Thanks for the update!",
      avatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDlfvoRqPDjnKvTdB10HRmW6S7-nxxBpomO1PjjFIixF6DqNInMN49oCdfynkvwgDkC5mS5NpD0yQVduSVdhfrAdHooWfQn2z4lzx4Y-ZHNqIkmVpS4wu40-c91_S7UMyo92ADy0A6ZUMnaKvqsHqwSIbwpAiUX5x3fO6M5U66noyfsk2P9DsXl7FWKR7CSIejXr3ctuVexN3lqEN0ZDWaH9yswa12iMoiY1FrexrF7LXhKVjLXDYgFi1eOjtcSNrsXIBWHaOEaDws1",
      time: "3d ago",
      unread: 0,
      online: false,
    },
  ];

  const [activeConversation, setActiveConversation] = useState(
    conversations[0]?.id || null
  );

  const activeConv = (id) => {
    setActiveConversation(id);
  };

  const [searchTerm, setSearchTerm] = useState("");

  const filteredConversations = conversations.filter((el) =>
    el.name.toLowerCase().trim().includes(searchTerm.toLowerCase().trim())
  );

  return (
    <>
      <div>
        <header className="flex items-center justify-between whitespace-nowrap border-b border-gray-200 dark:border-white px-6 py-5 bg-content-light dark:bg-content-dark shadow-subtle">
          <div className="flex items-center gap-2 text-sm text-primary ">
            <Link className="text-semibold" to={"/user/overview"}>
              Dashboard
            </Link>
            <span className="text-primary">/</span>
            <Link to={"/user/messages"} className="font-semibold text-primary ">
              Messages
            </Link>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          <div
            className={`lg:col-span-1 ${
              i18n.language === "en"
                ? " border-r-none md:border-r "
                : " border-l-none md:border-l"
            }`}
          >
            <div
              className={`p-5 flex items-center gap-3 border-b border-gray-200 dark:border-white`}
            >
              <Search className=" cursor-pointer" size={20} strokeWidth={2} />
              <input
                className="py-2 px-3 w-full placeholder:text-text placeholder:text-[12px] border rounded-sm focus:outline-amber-300"
                type="search"
                placeholder="Search conversations"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div
              className={` border-gray-200 dark:border-white flex flex-row  md:flex-col overflow-y-auto`}
            >
              {conversations.length === 0 ? (
                <p className="text-center text-text">No conversations found.</p>
              ) : (
                filteredConversations.map((conv) => (
                  <div
                    onClick={() => activeConv(conv.id)}
                    key={conv.id}
                    className={`${
                      activeConversation === conv.id
                        ? ` bg-amber-100 dark:bg-card ${
                            i18n.language === "en"
                              ? "md:border-l-5 md:border-l-amber "
                              : "md:border-r-5 md:border-r-amber"
                          } : "" }`
                        : ""
                    } flex items-center cursor-pointer gap-0 md:gap-3 p-2 md:p-5 border-b-none md:border-b border-gray-200 dark:border-white`}
                  >
                    <div className="relative">
                      <img
                        src={conv.avatar}
                        alt={conv.name}
                        className="w-10 h-10 rounded-full"
                      />
                      {activeConversation === conv.id ? (
                        <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-500 border-2 border-content-light dark:border-content-dark"></span>
                      ) : (
                        ""
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-primary hidden md:block">
                        {conv.name}
                      </p>
                      <p className="text-[12px] text-text hidden md:block leading-normal truncate">
                        {conv.lastMessage}
                      </p>
                    </div>
                    <div className="text-sm flex flex-col items-end  text-text">
                      <span className="text-text text-[12px] hidden md:block">
                        {conv.time}
                      </span>
                      {conv.unread > 0 && (
                        <span className="font-semibold  w-5 h-5 hidden md:flex justify-center items-center text-white text-[12px] rounded-full bg-amber">
                          {conv.unread}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="lg:col-span-2">
            <header className="flex justify-between items-center p-5 md:border-b border-1 border-gray-200 dark:border-white">
              {conversations[0] ? (
                <div className="flex gap-3">
                  <div className="relative">
                    <img
                      className="w-10 h-10 rounded-full"
                      src={conversations[0].avatar}
                      alt={conversations[0].name}
                    />
                    {conversations[0].online && (
                      <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-500 border-2 border-content-light dark:border-content-dark"></span>
                    )}
                  </div>

                  <div className="flex flex-col">
                    <h1 className="font-bold text-primary">
                      {conversations[0].name}
                    </h1>
                    <h6 className="text-[12px] text-green-500">
                      {conversations[0].online ? "Online" : "Offline"}
                    </h6>
                  </div>
                </div>
              ) : (
                <p className="text-text">Select a conversation...</p>
              )}

              {/* <div className="flex items-center gap-7">
                <Phone
                  size={20}
                  strokeWidth={2}
                  className="text-primary cursor-pointer"
                />
                <Video
                  size={20}
                  strokeWidth={2}
                  className="text-primary cursor-pointer "
                />
                <Ellipsis
                  size={20}
                  strokeWidth={2}
                  className="text-primary cursor-pointer "
                />
              </div> */}
            </header>
            <div className="flex-1 p-6 overflow-y-auto space-y-3 max-h-[60vh] bg-chat-bg-light dark:bg-chat-bg-dark">
              <div className="text-center my-4">
                <span className="text-xs text-text-body-light dark:text-text-body-dark bg-gray-200 dark:bg-gray-700 rounded-full px-3 py-1">
                  --- Today ---
                </span>
              </div>
              <div className="flex gap-3 items-end mt-5">
                <img
                  className="w-10 h-10 rounded-full"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDxhEWPxFOdvhzU1FzcY-98OyC5SXv0PRGkEPCGY0wlDsF4HrATrXT62Ld3ddJcwQrlX07n-VoFwHcNyvJMW4XiCME3oAW3NvfAkH_tfU9FCeRMKDxhFxozUwUr8ZoPcfvfVwlBCu-HQ5kYBCL6wWZDhPo3vvEsUgM4NCV03igPGmkDsI8KYNpmfxIqbccZEz7N8Kle0glJiI7pfdyK7ET-00fJ8OdtmzR9PH1erDWUn-C5zKGJbuqdrICZP899XjMhcBhVwoUICRDb"
                  alt="Acme Corp"
                />
                <div className="flex flex-col gap-1 max-w-md">
                  <div className="bg-white dark:bg-violet p-3 rounded-lg rounded-bl-sm shadow-subtle">
                    <p className="text-sm text-violet dark:text-white">
                      Hey, just following up on the catering options for the
                      "Summer Gala" event. Have you had a chance to review the
                      proposals?
                    </p>
                  </div>
                  <span className="text-xs text-text-body-light dark:text-text-body-dark self-start">
                    2:40 PM
                  </span>
                </div>
              </div>
              <div className="flex gap-3 items-end justify-end mt-5">
                <div className="flex flex-col gap-1 max-w-md">
                  <div className="bg-primary text-white p-3 rounded-lg rounded-br-sm shadow-subtle">
                    <p className="text-sm text-white dark:text-violet">
                      Hi Jane! Yes, I've looked them over. 'Gourmet Delights'
                      looks promising. What are your thoughts on their
                      vegetarian menu?
                    </p>
                  </div>
                  <span className="text-xs text-text-body-light dark:text-text-body-dark self-end">
                    2:42 PM
                  </span>
                </div>
                <img
                  className="w-10 h-10 rounded-full"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCSe4QfvY7U_DQUNpwE0lsca7chE-YfiuszC_DES_oqvr3p14WvI1QvnWK2DTwTrMQHWTj2F5ClvI9QOa5cXpZlDUVWJ6fLxSidggPOB34KB_OIw0wdegx_mgtTasdB5ag1zk7UgVlPzKw4hrJrS3_U1xsQiJxFcoMK0TQn88V_hzk7_BnXmwQEbqek3Es8FAQ_eLkRNMtEwkyB0fNo-ybMX1FhRX13jEX00JhPFb4eOHf-RVduyhNyTgqyD7gP-HO7LgiOyxLOEZYx"
                  alt="Acme Corp"
                />
              </div>
              <div className="flex gap-3 items-end mt-5">
                <img
                  className="w-10 h-10 rounded-full"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDxhEWPxFOdvhzU1FzcY-98OyC5SXv0PRGkEPCGY0wlDsF4HrATrXT62Ld3ddJcwQrlX07n-VoFwHcNyvJMW4XiCME3oAW3NvfAkH_tfU9FCeRMKDxhFxozUwUr8ZoPcfvfVwlBCu-HQ5kYBCL6wWZDhPo3vvEsUgM4NCV03igPGmkDsI8KYNpmfxIqbccZEz7N8Kle0glJiI7pfdyK7ET-00fJ8OdtmzR9PH1erDWUn-C5zKGJbuqdrICZP899XjMhcBhVwoUICRDb"
                  alt="Acme Corp"
                />
                <div className="flex flex-col gap-1 max-w-md">
                  <div className="bg-white dark:bg-violet p-3 rounded-lg rounded-bl-sm shadow-subtle">
                    <p className="text-sm text-violet dark:text-white">
                      Sure, that sounds great! Their options seem varied enough
                      to satisfy all our guests. Let's proceed with them.
                    </p>
                  </div>
                  <span className="text-xs text-text-body-light dark:text-text-body-dark self-start">
                    2:45 PM
                  </span>
                </div>
              </div>
            </div>
            <footer className="flex justify-between items-center p-5 border-t border-gray-200 dark:border-white bg-content-light dark:bg-content-dark">
              <div className="flex items-center gap-3 w-full p-4 bg-gray-100 dark:bg-gray-700 rounded-sm">
                <CirclePlus
                  size={20}
                  strokeWidth={2}
                  className="text-primary cursor-pointer"
                />
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 border rounded-sm focus:outline-amber-300"
                />
                <Smile
                  size={20}
                  strokeWidth={2}
                  className="text-primary cursor-pointer"
                />
                <button className="bg-amber text-white px-4 py-2 rounded-sm hover:bg-amber/90 transition-all ease-in-out duration-300">
                  Send
                </button>
              </div>
            </footer>
          </div>
        </div>
      </div>
    </>
  );
}
