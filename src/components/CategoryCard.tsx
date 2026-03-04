import { Link } from "react-router-dom";
import { Category } from "@/lib/data";
import { getAuthSession } from "@/lib/auth";

interface CategoryCardProps {
  category: Category;
}

const CategoryCard = ({ category }: CategoryCardProps) => {
  const session = getAuthSession();
  const target = session
    ? `/prestataires?cat=${category.id}`
    : `/inscription-client?next=${encodeURIComponent(`/prestataires?cat=${category.id}`)}`;

  return (
    <Link
      to={target}
      className="group flex flex-col items-center gap-3 p-6 rounded-lg bg-card border border-border hover:border-gold/40 hover:shadow-md transition-all duration-300"
    >
      <span className="text-4xl group-hover:scale-110 transition-transform duration-300">
        {category.icon}
      </span>
      <h3 className="font-semibold text-foreground text-sm">{category.name}</h3>
      <span className="text-xs text-muted-foreground">{category.count} prestataires</span>
    </Link>
  );
};

export default CategoryCard;
