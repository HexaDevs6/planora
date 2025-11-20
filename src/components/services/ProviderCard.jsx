import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import { useDirection } from "@/hooks/useDirection";
import { supabase } from "@/lib/supabaseClient";
import Spinner from "@/components/SpinnerLoader";
import avatarPlaceholderImg from "@/assets/user_placeholder3.png";
import { useSelector } from "react-redux";
import { createOrGetConversation } from "@/lib/chatService";

const ProviderCard = ({ provider_id }) => {
  const [provider, setProvider] = useState(null);
  const navigate = useNavigate();
  const { lang } = useDirection();
  const user = useSelector((state) => state.auth.user);

  const fetchProvider = async () => {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", provider_id);

    if (error) {
      console.error(error);
      return;
    } else {
      setProvider(data[0]);
    }
  };

  useEffect(() => {
    fetchProvider();
  }, [provider_id]);

  const handleMessageClick = async (e) => {
    e.preventDefault();

    if (!user?.id) {
      return alert("You must be logged in to message the provider.");
    }

    if (!provider_id) {
      return alert("Provider ID missing!");
    }

    try {
      const convoId = await createOrGetConversation(user.id, provider_id);

      navigate(`/user/messages?cid=${convoId}`);
    } catch (err) {
      console.error("Message start error:", err);
      alert("Cannot start conversation right now.");
    }
  };

  if (!provider) {
    return <Spinner />;
  }

  return (
    // <Link to={`/user/${provider_id}`}>
      <div className="group gradient-card rounded-xl p-4 flex md:flex-col gap-4 items-center text-center">
        <img
          src={provider.image || avatarPlaceholderImg}
          alt={provider.full_name}
          className="w-18 md:w-24 aspect-square object-cover rounded-full"
        />

        <div className="text-start md:text-center flex flex-col gap-2 items-start md:items-center w-full">
          <h3 className="text-lg font-bold">
            {provider.full_name}
          </h3>

          <p className="text-sm text-foreground">
            {provider.bio && provider.bio.length > 50
              ? provider.bio.slice(0, 50) + "..."
              : provider.bio || "Has no bio yet!"}
          </p>

          <button
            onClick={handleMessageClick}
            className="mt-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-violet text-white font-semibold hover:bg-violet/80 transition-colors"
            type="button"
          >
            <MessageCircle className="w-4 h-4" />
            {lang === "en" ? "Message" : "مراسلة"}
          </button>
        </div>
      </div>
    // </Link>
  );
};

export default ProviderCard;
