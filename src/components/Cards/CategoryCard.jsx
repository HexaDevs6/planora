import { Link } from "react-router-dom";
import { Card, CardContent } from "../ui/card";
import { t } from "i18next";
import { useDispatch } from "react-redux";
import { setFilterQuery } from "@/store/searchSlice";


const CategoryCard = ({ name, icon: Icon, count }) => {

  const dispatch = useDispatch()


  return (
    <Link onClick={()=>dispatch(setFilterQuery(name))} >
      <Card className="group drop-shadow-xl overflow-hidden border-0 shadow-card hover:shadow-hover transition-all duration-300 hover:scale-105 cursor-pointer bg-gradient-to-br from-background to-muted/30">
        <CardContent className="py-8 flex flex-col items-center text-center space-y-3">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary dark:text-violet text-white group-hover:scale-110 transition-transform duration-300">
            <Icon className="h-8 w-8" />
          </div>
          <div>
            <h3 className="font-semibold text-primary text-lg transition-colors">
              {name}
            </h3>
            <p className="text-sm text-text mt-1">
              {count} {t('eventsPage.category.cateCards.subTitle')}
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default CategoryCard;
