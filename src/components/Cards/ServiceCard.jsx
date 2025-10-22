import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, CheckCircle } from "lucide-react";

const ServiceCard = ({
  id,
  title,
  provider,
  image,
  category,
  location,
  rating,
  reviews,
  priceRange,
  verified,
}) => {
  return (
    <Card className="group overflow-hidden border-0 shadow-card hover:shadow-hover transition-all duration-300 hover:scale-[1.02]">
      <div className="overflow-hidden aspect-square">
        <img
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

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-accent text-accent" />
              <span className="font-semibold text-sm">{rating}</span>
            </div>
            <span className="text-sm text-muted-foreground">
              ({reviews} reviews)
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 text-primary" />
            <span className="line-clamp-1">{location}</span>
          </div>
        </div>

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
          <Link to={`/marketplace/${id}`}>
            <Button variant="hero" size="sm">
              View Service
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceCard;
