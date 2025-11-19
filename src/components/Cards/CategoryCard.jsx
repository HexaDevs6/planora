import { Link } from "react-router-dom";
import { Card, CardContent } from "../ui/card";
import { useDispatch } from "react-redux";
import { setServiceFilterQuery } from "@/store/searchAndFilterServiceSlice";
import { setFilterQuery } from "@/store/searchAndFilterEventsSlice";

const CategoryCard = ({ name, icon: Icon, type }) => {
  const dispatch = useDispatch();

  const handleClick = () => {
    if (type === "service") {
      dispatch(setServiceFilterQuery(name.toLowerCase()));
    } else if (type === "event") {
      dispatch(setFilterQuery(name.toLowerCase()));
    }
  };

  return (
    <Link onClick={handleClick}>
      <Card className="group drop-shadow-xl h-full overflow-hidden border-0 shadow-card hover:shadow-hover transition-all duration-300 hover:scale-105 cursor-pointer bg-gradient-to-br from-background to-muted/30">
        <CardContent className="pt-4 pb-3 flex flex-col items-center text-center space-y-3">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white group-hover:scale-110 transition-transform duration-300">
            <Icon className="h-8 w-8" />
          </div>
          <div>
            <h3 className="font-semibold text-primary text-sm transition-colors">
              {name}
            </h3>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default CategoryCard;
