import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  LayoutDashboard,
  MessageCircle,
  Facebook,
  Instagram,
} from "lucide-react";
import { useDirection } from "@/hooks/useDirection";
import { supabase } from "@/lib/supabaseClient";
import Spinner from "@/components/SpinnerLoader";
import avatarPlaceholderImg from "@/assets/user_placeholder3.png";
import { useSelector } from "react-redux";
import { createOrGetConversation } from "@/lib/chatService";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Swal from "sweetalert2";

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
      Swal.fire({
        title:
          lang === "ar"
            ? "يرجى تسجيل الدخول كمضيف لإرسال الرسائل."
            : "Please log in as a host to send messages.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "var(--primary)",
        cancelButtonColor: "var(--secondary)",
        confirmButtonText: lang === "ar" ? "تسجيل الدخول" : "Login",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/signin");
        }
      });
    }

    if (!provider_id) {
      return alert("Provider ID missing!");
    }

    try {
      const convoId = await createOrGetConversation(user.id, provider_id);
      if (convoId && user?.role === "host") {
        navigate(`/host/messages?cid=${convoId}`);
      } else if (convoId && user?.role === "client") {
        navigate(`/user/messages?cid=${convoId}`);
      } else {
        Swal.fire({
          title:
            lang === "ar"
              ? "فشل في بدء المحادثة. يرجى المحاولة مرة أخرى."
              : "Failed to start conversation. Please try again.",
          icon: "error",
          confirmButtonColor: "var(--primary)",
          confirmButtonText: lang === "ar" ? "حسناً" : "OK",
        });
      }
    } catch (err) {
      console.error("Message start error:", err);
    }
  };

  if (!provider) {
    return <Spinner />;
  }

  return (
    // <Link to={`/user/${provider_id}`}>
    <div className="group gradient-card rounded-xl p-4 flex md:flex-col gap-4 items-center text-center">
      <Avatar className="size-28">
        <AvatarImage src={provider.avatar || avatarPlaceholderImg} />
        <AvatarFallback>{provider.full_name.charAt(0)}</AvatarFallback>
      </Avatar>

      <div className="text-start md:text-center flex flex-col gap-2 items-start md:items-center w-full">
        <h3 className="text-lg font-bold">{provider.full_name}</h3>

        <p className="text-sm text-foreground">
          {provider.bio && provider.bio.length > 50
            ? provider.bio.slice(0, 50) + "..."
            : provider.bio || "Has no bio yet!"}
        </p>

        <div className="flex items-center gap-2">
          {provider.facebook_url && (
            <Link
              to={provider.facebook_url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full p-2 aspect-square bg-foreground/30"
              title="Facebook"
            >
              <Facebook className="w-4 h-4" />
            </Link>
          )}
          {provider.instagram_url && (
            <Link
              to={provider.instagram_url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full p-2 aspect-square bg-foreground/30"
              title="Instagram"
            >
              <Instagram className="w-4 h-4" />
            </Link>
          )}
        </div>
        {provider_id !== user?.id ? (
          <button
            onClick={handleMessageClick}
            className="mt-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-violet text-white font-semibold hover:bg-violet/80 transition-colors"
            type="button"
          >
            <MessageCircle className="w-4 h-4" />
            {lang === "en" ? "Message" : "مراسلة"}
          </button>
        ) : (
          <Button
            variant="default"
            asChild
            className="mt-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-violet text-white font-semibold hover:bg-violet/80 transition-colors"
          >
            <Link to={`/user/overview`}>
              <LayoutDashboard className="w-4 h-4" />
              {lang === "en" ? "Dashboard" : "لوحة التحكم"}
            </Link>
          </Button>
        )}
      </div>
    </div>
    // </Link>
  );
};

export default ProviderCard;
