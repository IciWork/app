import { Link } from "react-router-dom";
import { MapPin, BadgeCheck } from "lucide-react";
import StarRating from "./StarRating";
import { Provider } from "@/lib/data";
import { Badge } from "@/components/ui/badge";

interface ProviderCardProps {
  provider: Provider;
}

const ProviderCard = ({ provider }: ProviderCardProps) => {
  return (
    <Link
      to={`/prestataire/${provider.id}`}
      className="group block rounded-2xl border overflow-hidden transition-all duration-300 hover:-translate-y-1"
      style={{
        background: "#FFFFFF",
        borderColor: "#ECEAE5",
        boxShadow: "0 2px 10px rgba(0,0,0,0.02)",
      }}
    >
      <div className="p-5">
        <div className="flex items-start gap-4">
          <img
            src={provider.photo}
            alt={provider.name}
            className="w-16 h-16 rounded-full object-cover"
            style={{ boxShadow: "0 0 0 3px rgba(61,122,95,0.15)" }}
          />

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <h3 className="font-semibold truncate" style={{ color: "#1C1F23" }}>
                {provider.name}
              </h3>
              {provider.rating >= 4.8 && <BadgeCheck size={16} className="shrink-0" style={{ color: "#3D7A5F" }} />}
            </div>

            <p className="text-sm" style={{ color: "#8A8E96" }}>
              {provider.profession}
            </p>

            <div className="flex items-center gap-1.5 mt-1">
              <StarRating rating={provider.rating} size={14} />
              <span className="text-xs" style={{ color: "#8A8E96" }}>
                ({provider.reviewCount})
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-1 text-sm" style={{ color: "#8A8E96" }}>
            <MapPin size={14} />
            <span>{provider.city}</span>
          </div>

          <div className="text-right">
            <span className="text-lg font-bold" style={{ color: "#1C1F23" }}>
              {provider.startingPrice}€
            </span>
            <span className="text-xs ml-0.5" style={{ color: "#8A8E96" }}>
              /h
            </span>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {provider.skills.slice(0, 3).map((skill) => (
            <Badge
              key={skill}
              variant="secondary"
              className="text-xs font-normal border"
              style={{ background: "#F8F6F2", color: "#4A4F57", borderColor: "#ECEAE5" }}
            >
              {skill}
            </Badge>
          ))}
        </div>
      </div>
    </Link>
  );
};

export default ProviderCard;
