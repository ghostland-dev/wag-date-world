import dog1 from "@/assets/dog1.jpg";
import cat1 from "@/assets/cat1.jpg";
import dog2 from "@/assets/dog2.jpg";
import cat2 from "@/assets/cat2.jpg";

export interface Animal {
  id: string;
  name: string;
  breed: string;
  age: string;
  location: string;
  image: string;
  description: string;
  type: "Chien" | "Chat";
  purpose: "Reproduction" | "Socialisation" | "Les deux";
}

export const animals: Animal[] = [
  {
    id: "1",
    name: "Buddy",
    breed: "Golden Retriever",
    age: "3 ans",
    location: "Paris, 75",
    image: dog1,
    description: "Golden Retriever très sociable et en excellente santé. Recherche une compagne pour reproduction. Pedigree disponible.",
    type: "Chien",
    purpose: "Reproduction",
  },
  {
    id: "2",
    name: "Luna",
    breed: "Chat Persan",
    age: "2 ans",
    location: "Lyon, 69",
    image: cat2,
    description: "Chatte persane au caractère doux et affectueux. Idéale pour socialisation avec d'autres chats ou reproduction.",
    type: "Chat",
    purpose: "Les deux",
  },
  {
    id: "3",
    name: "Max",
    breed: "Husky Sibérien",
    age: "4 ans",
    location: "Marseille, 13",
    image: dog2,
    description: "Husky énergique et playful. Cherche des compagnons de jeu et potentielle partenaire. Très sociable avec les autres chiens.",
    type: "Chien",
    purpose: "Les deux",
  },
  {
    id: "4",
    name: "Mia",
    breed: "Chat Tigré",
    age: "1 an",
    location: "Toulouse, 31",
    image: cat1,
    description: "Jeune chatte très joueuse et curieuse. Parfaite pour socialisation avec d'autres jeunes chats.",
    type: "Chat",
    purpose: "Socialisation",
  },
];