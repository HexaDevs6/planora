import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users } from "lucide-react";
import { t } from "i18next";

const EventCard = ({
  id,
  title,
  image,
  date,
  location,
  category,
  price,
  attendees,
}) => {
  return (
    <Card
      key={id}
      className="group overflow-hidden border-0 shadow-card hover:shadow-hover transition-all duration-300 hover:scale-[1.02]"
    >
      <div className="overflow-hidden aspect-[4/3]">
        <img
          src={image}
          alt={title}
          className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
        />
      </div>

      <CardContent className="px-5 pb-5 space-y-3">
        <h3 className="font-semibold text-lg line-clamp-2 text-primary transition-colors">
          {title}
        </h3>

        <div className="space-y-2 text-sm text-text">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            <span className="line-clamp-1">{location}</span>
          </div>
          {attendees && (
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              <span>{attendees} {t('eventsPage.category.cards.attendees')}</span>
            </div>
          )}
          <div className="flex gap-3 pt-2">
            <div>
              <Badge className="bg-violet text-white border-0 shadow-lg">
                {category}
              </Badge>
            </div>
            {price === "Free" && (
              <div>
                <Badge
                  variant="secondary"
                  className="bg-amber text-white border-0 shadow-lg"
                >
                  Free
                </Badge>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="text-lg font-bold text-primary">{price}</div>
          <Link to={`/events/${id}`}>
            <Button variant="amber" size="lg">
              {t('eventsPage.category.cards.viewDetails')}
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default EventCard;
