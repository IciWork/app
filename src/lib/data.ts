export interface Provider {
  id: string;
  name: string;
  photo: string;
  profession: string;
  rating: number;
  reviewCount: number;
  city: string;
  startingPrice: number;
  description: string;
  skills: string[];
  category: string;
  available: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  count: number;
}

export interface Review {
  id: string;
  author: string;
  avatar: string;
  rating: number;
  date: string;
  comment: string;
}

export const categories: Category[] = [
  { id: "plomberie", name: "Plomberie", icon: "🔧", count: 234 },
  { id: "jardinage", name: "Jardinage", icon: "🌿", count: 189 },
  { id: "electricite", name: "Électricité", icon: "⚡", count: 156 },
  { id: "menage", name: "Ménage", icon: "✨", count: 312 },
  { id: "demenagement", name: "Déménagement", icon: "📦", count: 98 },
  { id: "informatique", name: "Informatique", icon: "💻", count: 167 },
];

export const providers: Provider[] = [
  {
    id: "1",
    name: "Jean Dupont",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
    profession: "Plombier",
    rating: 4.9,
    reviewCount: 127,
    city: "Paris",
    startingPrice: 45,
    description: "Plombier certifié avec plus de 15 ans d'expérience. Spécialisé dans les réparations d'urgence et les installations complètes.",
    skills: ["Réparation fuite", "Installation sanitaire", "Chauffage", "Débouchage"],
    category: "plomberie",
    available: true,
  },
  {
    id: "2",
    name: "Marie Laurent",
    photo: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face",
    profession: "Jardinière paysagiste",
    rating: 4.8,
    reviewCount: 89,
    city: "Lyon",
    startingPrice: 35,
    description: "Paysagiste passionnée, je transforme vos espaces extérieurs en véritables havres de paix.",
    skills: ["Taille", "Plantation", "Aménagement", "Entretien"],
    category: "jardinage",
    available: true,
  },
  {
    id: "3",
    name: "Thomas Bernard",
    photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
    profession: "Électricien",
    rating: 4.7,
    reviewCount: 203,
    city: "Marseille",
    startingPrice: 50,
    description: "Électricien agréé, intervention rapide pour tous vos travaux électriques résidentiels et commerciaux.",
    skills: ["Installation", "Dépannage", "Mise aux normes", "Domotique"],
    category: "electricite",
    available: false,
  },
  {
    id: "4",
    name: "Sophie Martin",
    photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face",
    profession: "Aide ménagère",
    rating: 5.0,
    reviewCount: 312,
    city: "Bordeaux",
    startingPrice: 25,
    description: "Service de ménage professionnel et méticuleux. Produits écologiques utilisés sur demande.",
    skills: ["Ménage", "Repassage", "Vitres", "Organisation"],
    category: "menage",
    available: true,
  },
  {
    id: "5",
    name: "Lucas Petit",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face",
    profession: "Déménageur",
    rating: 4.6,
    reviewCount: 67,
    city: "Toulouse",
    startingPrice: 60,
    description: "Déménagements soignés et rapides. Équipe professionnelle et matériel adapté.",
    skills: ["Déménagement", "Montage meuble", "Emballage", "Transport"],
    category: "demenagement",
    available: true,
  },
  {
    id: "6",
    name: "Emma Roux",
    photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face",
    profession: "Technicienne informatique",
    rating: 4.9,
    reviewCount: 145,
    city: "Nantes",
    startingPrice: 40,
    description: "Dépannage informatique à domicile. Configuration, réparation et formation personnalisée.",
    skills: ["Dépannage PC", "Réseau", "Sécurité", "Formation"],
    category: "informatique",
    available: true,
  },
];

export const reviews: Review[] = [
  {
    id: "1",
    author: "Pierre V.",
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcabd9c?w=80&h=80&fit=crop&crop=face",
    rating: 5,
    date: "Il y a 2 jours",
    comment: "Excellent travail, très professionnel et ponctuel. Je recommande vivement !",
  },
  {
    id: "2",
    author: "Claire M.",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=80&h=80&fit=crop&crop=face",
    rating: 5,
    date: "Il y a 1 semaine",
    comment: "Intervention rapide et efficace. Le résultat est impeccable.",
  },
  {
    id: "3",
    author: "Marc D.",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&h=80&fit=crop&crop=face",
    rating: 4,
    date: "Il y a 2 semaines",
    comment: "Très bon service, prix raisonnable. Petit retard à l'arrivée mais travail de qualité.",
  },
];
