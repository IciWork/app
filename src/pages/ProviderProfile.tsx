import { useParams, Link } from "react-router-dom";
import { providers, reviews } from "@/lib/data";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StarRating from "@/components/StarRating";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, BadgeCheck, Calendar, MessageSquare, Clock } from "lucide-react";

const galleryImages = [
  "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=300&fit=crop",
];

const services = [
  { name: "Intervention standard", price: 45, duration: "1h" },
  { name: "Diagnostic complet", price: 60, duration: "1h30" },
  { name: "Réparation urgente", price: 80, duration: "Variable" },
  { name: "Installation complète", price: 120, duration: "Demi-journée" },
];

const availability = [
  { day: "Lun", slots: ["9h-12h", "14h-18h"] },
  { day: "Mar", slots: ["9h-12h", "14h-18h"] },
  { day: "Mer", slots: ["9h-12h"] },
  { day: "Jeu", slots: ["9h-12h", "14h-18h"] },
  { day: "Ven", slots: ["9h-12h", "14h-18h"] },
  { day: "Sam", slots: ["10h-13h"] },
  { day: "Dim", slots: [] },
];

const ProviderProfile = () => {
  const { id } = useParams();
  const provider = providers.find((p) => p.id === id);

  if (!provider) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-display font-bold text-foreground">Prestataire introuvable</h1>
            <Link to="/prestataires" className="mt-4 text-gold hover:text-gold-dark">
              ← Retour à la liste
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-gold">Accueil</Link>
          {" / "}
          <Link to="/prestataires" className="hover:text-gold">Prestataires</Link>
          {" / "}
          <span className="text-foreground">{provider.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Profile header */}
            <div className="bg-card rounded-lg border border-border p-6">
              <div className="flex flex-col sm:flex-row gap-6">
                <img
                  src={provider.photo}
                  alt={provider.name}
                  className="w-28 h-28 rounded-xl object-cover ring-2 ring-gold/20"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-display font-bold text-foreground">{provider.name}</h1>
                    {provider.rating >= 4.8 && <BadgeCheck size={20} className="text-gold" />}
                  </div>
                  <p className="text-muted-foreground mt-1">{provider.profession}</p>
                  <div className="flex items-center gap-4 mt-3">
                    <div className="flex items-center gap-1.5">
                      <StarRating rating={provider.rating} />
                      <span className="text-sm font-semibold">{provider.rating}</span>
                      <span className="text-sm text-muted-foreground">({provider.reviewCount} avis)</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
                    <MapPin size={14} />
                    <span>{provider.city}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {provider.skills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              <p className="mt-6 text-sm text-muted-foreground leading-relaxed">
                {provider.description}
              </p>
            </div>

            {/* Gallery */}
            <div>
              <h2 className="text-xl font-display font-bold text-foreground mb-4">Réalisations</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {galleryImages.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={`Réalisation ${i + 1}`}
                    className="rounded-lg object-cover w-full h-32 hover:opacity-90 transition-opacity cursor-pointer"
                  />
                ))}
              </div>
            </div>

            {/* Services */}
            <div>
              <h2 className="text-xl font-display font-bold text-foreground mb-4">Services & Tarifs</h2>
              <div className="bg-card rounded-lg border border-border overflow-hidden">
                {services.map((service, i) => (
                  <div
                    key={i}
                    className={`flex items-center justify-between p-4 ${
                      i < services.length - 1 ? "border-b border-border" : ""
                    }`}
                  >
                    <div>
                      <p className="font-medium text-foreground text-sm">{service.name}</p>
                      <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                        <Clock size={12} />
                        <span>{service.duration}</span>
                      </div>
                    </div>
                    <span className="font-bold text-foreground">{service.price}€</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div>
              <h2 className="text-xl font-display font-bold text-foreground mb-4">
                Avis clients ({reviews.length})
              </h2>
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="bg-card rounded-lg border border-border p-5">
                    <div className="flex items-start gap-3">
                      <img
                        src={review.avatar}
                        alt={review.author}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-foreground text-sm">{review.author}</h4>
                          <span className="text-xs text-muted-foreground">{review.date}</span>
                        </div>
                        <StarRating rating={review.rating} size={12} />
                        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                          {review.comment}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact card */}
            <div className="bg-card rounded-lg border border-border p-6 sticky top-24">
              <div className="text-center mb-5">
                <span className="text-3xl font-bold text-foreground">
                  {provider.startingPrice}€
                </span>
                <span className="text-muted-foreground">/h</span>
                <p className="text-xs text-muted-foreground mt-1">Tarif de départ</p>
              </div>
              <Button className="w-full bg-gold text-primary hover:bg-gold-dark font-semibold h-12">
                <MessageSquare size={18} className="mr-2" />
                Contacter
              </Button>
              <Button variant="outline" className="w-full mt-3 h-12">
                <Calendar size={18} className="mr-2" />
                Demander un devis
              </Button>
            </div>

            {/* Availability */}
            <div className="bg-card rounded-lg border border-border p-6">
              <h3 className="font-semibold text-foreground mb-4">Disponibilités</h3>
              <div className="space-y-3">
                {availability.map((day) => (
                  <div key={day.day} className="flex items-start gap-3">
                    <span className="text-sm font-medium text-foreground w-8">{day.day}</span>
                    <div className="flex flex-wrap gap-1.5">
                      {day.slots.length > 0 ? (
                        day.slots.map((slot) => (
                          <Badge key={slot} variant="secondary" className="text-xs font-normal">
                            {slot}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-xs text-muted-foreground">Indisponible</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProviderProfile;
