export type UserRole = 'super_admin' | 'owner' | 'adopter';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  location?: string;
  createdAt: Date;
  isVerified: boolean;
  // Propriétaire/Association fields
  organizationType?: 'individual' | 'association' | 'shelter';
  organizationName?: string;
  siretNumber?: string;
  // Stats
  totalAnimals?: number;
  totalAdoptions?: number;
}

export interface Animal {
  id: string;
  name: string;
  breed: string;
  age: string;
  location: string;
  images: string[];
  description: string;
  type: "Chien" | "Chat";
  purpose: "Adoption" | "Reproduction" | "Socialisation";
  ownerId: string;
  ownerName: string;
  status: "available" | "reserved" | "adopted";
  price?: number;
  vaccinated: boolean;
  sterilized: boolean;
  microchipped: boolean;
  healthCertificate: boolean;
  createdAt: Date;
  updatedAt: Date;
  isVerified: boolean;
  viewCount: number;
  favoriteCount: number;
}

export interface AdoptionRequest {
  id: string;
  animalId: string;
  adopterId: string;
  ownerId: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  message: string;
  createdAt: Date;
  updatedAt: Date;
}