import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, CheckCircle, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import loremService from '@/assets/loremService.jfif';
import { useDirection } from "@/hooks/useDirection";

const ServiceCard = ({
  id,
  title = "Service Title",
  image,
  category = "General",
  rating = 0,
  reviews = 0,
  priceRange = "Contact for price",
  verified = false,
  provider_id = null,
}) => {
  // Fetch provider data from supabase by provider_id

  const [provider, setProvider] = useState("Unknown Provider");
  const { lang } = useDirection();
  const fetchProvider = async () => {
    if (!provider_id) return;
    const { data, error } = await supabase
      .from("users").select("full_name").eq("id", provider_id).single();

    if (error) {
      console.error(error);
      setProvider("Unknown Provider");
      return;
    } else {
      setProvider(data.full_name || "Unknown Provider");
    }
  };
  useEffect(() => {
    fetchProvider();
  }, [provider_id]);

  return (
    <Card className="group overflow-hidden border-0 gap-4 shadow-card hover:shadow-hover transition-all duration-300">
      <div className="overflow-hidden aspect-square h-75 ">
        <motion.img
          onError={(e) => {
            e.target.src = loremService;
          }}
          src={image}
          alt={title}
          className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
        />
      </div>

      <CardContent className="p-5 space-y-3">
        <div>
          <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground">{provider}</p>
        </div>

        {/* <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-accent text-accent" />
              <span className="font-semibold text-sm">{rating}</span>
            </div>
            <span className="text-sm text-muted-foreground">
              ({reviews} reviews)
            </span>
          </div>
        </div> */}

        <div className="flex items-center gap-3">
          <div>
            <Badge className="bg-violet text-white  border-0 shadow-lg">
              {category}
            </Badge>
          </div>
          {verified && (
            <div>
              <Badge
                variant="secondary"
                className="bg-amber text-white  border-0 shadow-lg gap-1"
              >
                <CheckCircle className="h-3 w-3" />
                Verified
              </Badge>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-2 border-t">
          <div className="text-sm font-semibold text-primary">{priceRange}</div>
          <Link to={`/services/${id}`}>
            <Button variant="outline" size="sm">
              <ArrowRight />
              {lang === "en" ? "View Service" : "تفاصيل الخدمة"}
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceCard;
