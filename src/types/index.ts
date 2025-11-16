// User types
export interface User {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  role: 'student' | 'landlord';
  profilePhoto?: string;
  isVerified: boolean;
  createdAt: string;
}

export interface Student extends User {
  role: 'student';
  registrationNumber: string;
  department: string;
  level: string;
  studentIdCard?: string;
  bankName?: string;
  accountNumber?: string;
  accountName?: string;
}

export interface Landlord extends User {
  role: 'landlord';
  residentialAddress: string;
  state: string;
  lga: string;
  identificationType: string;
  identificationNumber: string;
  identificationDocument?: string;
  proofOfResidence?: string;
  whatsappNumber: string;
}

// Listing types
export interface Listing {
  id: string;
  listing_id?: string; // Backend returns listing_id
  landlordId: string;
  landlord?: Landlord;
  lodgeName: string;
  lodgeAddress: string;
  area: string;
  pricePerYear: number;
  availableSlots: number;
  distanceFromUNN: number;
  description: string;
  photos: string[];
  video?: string;
  status: 'active' | 'closed';
  createdAt: string;
  updatedAt: string;
}

// Purchase types
export interface Purchase {
  purchase_id: string;
  studentId: string;
  student?: Student;
  landlordId: string;
  landlord?: Landlord;
  listingId: string;
  listing?: Listing;
  paymentStatus: 'Pending' | 'Paid' | 'Released' | 'Refunded';
  inspectionStatus: 'Pending' | 'Approved' | 'Rejected';
  amount: number;
  bookingRef: string;
  paymentDate?: string;
  inspectionDate?: string;
  releaseDate?: string;
  paystackReference?: string;
  createdAt: string;
  updatedAt: string;
}

// Filter types
export interface ListingFilters {
  area?: string;
  minPrice?: number;
  maxPrice?: number;
  maxDistance?: number;
  searchQuery?: string;
}

// Form data types
export interface StudentSignupData {
  fullName: string;
  email: string;
  password: string;
  phoneNumber: string;
  registrationNumber: string;
  department: string;
  level: string;
  profilePhoto?: File;
  studentIdCard?: File;
}

export interface LandlordSignupData {
  fullName: string;
  email: string;
  password: string;
  phoneNumber: string;
  residentialAddress: string;
  state: string;
  lga: string;
  identificationType: string;
  identificationNumber: string;
  identificationDocument?: File;
  proofOfResidence?: File;
  profilePhoto?: File;
  whatsappNumber: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface CreateListingData {
  lodgeName: string;
  lodgeAddress: string;
  area: string;
  pricePerYear: number;
  availableSlots: number;
  distanceFromUNN: number;
  description: string;
  photos: File[];
  video?: File;
}
