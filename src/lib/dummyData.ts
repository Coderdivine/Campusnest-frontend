import { Listing, Purchase, Student, Landlord } from '@/types';

// Dummy Students
export const dummyStudents: Student[] = [
  {
    id: 'student-1',
    fullName: 'Chidinma Okafor',
    email: 'chidinma.okafor@unn.edu.ng',
    phoneNumber: '08012345678',
    role: 'student',
    department: 'Computer Science',
    level: '300',
    profilePhoto: '/assets/images/student1.jpg',
    studentIdCard: '/assets/images/id1.jpg',
    isVerified: true,
    createdAt: '2024-09-15T10:00:00Z',
  },
  {
    id: 'student-2',
    fullName: 'Emeka Nwosu',
    email: 'emeka.nwosu@unn.edu.ng',
    phoneNumber: '08087654321',
    role: 'student',
    department: 'Electrical Engineering',
    level: '400',
    profilePhoto: '/assets/images/student2.jpg',
    isVerified: true,
    createdAt: '2024-08-20T10:00:00Z',
  },
];

// Dummy Landlords
export const dummyLandlords: Landlord[] = [
  {
    id: 'landlord-1',
    fullName: 'Mr. Chukwuma Eze',
    email: 'chukwuma.eze@gmail.com',
    phoneNumber: '08023456789',
    role: 'landlord',
    residentialAddress: '45 Enugu Road, Nsukka',
    state: 'Enugu',
    lga: 'Nsukka',
    identificationType: 'National ID',
    identificationDocument: '/assets/images/landlord1-id.jpg',
    proofOfResidence: '/assets/images/landlord1-proof.jpg',
    whatsappNumber: '08023456789',
    profilePhoto: '/assets/images/landlord1.jpg',
    isVerified: true,
    createdAt: '2024-07-10T10:00:00Z',
  },
  {
    id: 'landlord-2',
    fullName: 'Mrs. Ngozi Okonkwo',
    email: 'ngozi.okonkwo@yahoo.com',
    phoneNumber: '08034567890',
    role: 'landlord',
    residentialAddress: '12 University Road, Nsukka',
    state: 'Enugu',
    lga: 'Nsukka',
    identificationType: 'Voter\'s Card',
    whatsappNumber: '08034567890',
    profilePhoto: '/assets/images/landlord2.jpg',
    isVerified: true,
    createdAt: '2024-06-05T10:00:00Z',
  },
  {
    id: 'landlord-3',
    fullName: 'Chief Ikenna Mbah',
    email: 'ikenna.mbah@hotmail.com',
    phoneNumber: '08045678901',
    role: 'landlord',
    residentialAddress: '78 Odim Road, Nsukka',
    state: 'Enugu',
    lga: 'Nsukka',
    identificationType: 'Driver\'s License',
    whatsappNumber: '08045678901',
    profilePhoto: '/assets/images/landlord3.jpg',
    isVerified: true,
    createdAt: '2024-05-12T10:00:00Z',
  },
];

// Dummy Listings
export const dummyListings: Listing[] = [
  {
    id: 'listing-1',
    landlordId: 'landlord-1',
    lodgeName: 'Sunshine Lodge',
    lodgeAddress: '15 Peace Street, Odenigwe, Nsukka',
    area: 'Odenigwe',
    pricePerYear: 150000,
    availableSlots: 8,
    distanceFromUNN: 1.2,
    description: 'Modern self-contained apartments with 24/7 power supply, water, and security. Close to campus with easy access to transportation. Each room comes with wardrobe, bed, and reading table.',
    photos: [
      '/assets/images/lodge1-1.jpg',
      '/assets/images/lodge1-2.jpg',
      '/assets/images/lodge1-3.jpg',
    ],
    video: '/assets/videos/lodge1.mp4',
    status: 'active',
    createdAt: '2024-10-01T10:00:00Z',
    updatedAt: '2024-10-01T10:00:00Z',
  },
  {
    id: 'listing-2',
    landlordId: 'landlord-2',
    lodgeName: 'Kings Palace',
    lodgeAddress: '22 University Avenue, Hilltop, Nsukka',
    area: 'Hilltop',
    pricePerYear: 180000,
    availableSlots: 5,
    distanceFromUNN: 0.8,
    description: 'Luxurious accommodation with modern amenities. Features include constant power, treated water, spacious rooms, and excellent security. Perfect for serious students.',
    photos: [
      '/assets/images/lodge2-1.jpg',
      '/assets/images/lodge2-2.jpg',
    ],
    status: 'active',
    createdAt: '2024-09-25T10:00:00Z',
    updatedAt: '2024-09-25T10:00:00Z',
  },
  {
    id: 'listing-3',
    landlordId: 'landlord-1',
    lodgeName: 'Green Valley Apartments',
    lodgeAddress: '8 Garden Close, Green House, Nsukka',
    area: 'Green House',
    pricePerYear: 120000,
    availableSlots: 12,
    distanceFromUNN: 1.5,
    description: 'Affordable and comfortable lodges in a serene environment. Good ventilation, secure compound, and close to market. Ideal for budget-conscious students.',
    photos: [
      '/assets/images/lodge3-1.jpg',
      '/assets/images/lodge3-2.jpg',
      '/assets/images/lodge3-3.jpg',
      '/assets/images/lodge3-4.jpg',
    ],
    status: 'active',
    createdAt: '2024-09-20T10:00:00Z',
    updatedAt: '2024-09-20T10:00:00Z',
  },
  {
    id: 'listing-4',
    landlordId: 'landlord-3',
    lodgeName: 'Royal Heights',
    lodgeAddress: '34 Abuja Street, Abuja Building Area, Nsukka',
    area: 'Abuja Building Area',
    pricePerYear: 200000,
    availableSlots: 3,
    distanceFromUNN: 0.5,
    description: 'Premium accommodation very close to campus. Features include air conditioning, high-speed internet, modern kitchen, and 24/7 security with CCTV coverage.',
    photos: [
      '/assets/images/lodge4-1.jpg',
      '/assets/images/lodge4-2.jpg',
    ],
    video: '/assets/videos/lodge4.mp4',
    status: 'active',
    createdAt: '2024-09-18T10:00:00Z',
    updatedAt: '2024-09-18T10:00:00Z',
  },
  {
    id: 'listing-5',
    landlordId: 'landlord-2',
    lodgeName: 'Arts Villa',
    lodgeAddress: '11 Creative Lane, Faculty of Arts Area, Nsukka',
    area: 'Faculty of Arts Area',
    pricePerYear: 140000,
    availableSlots: 6,
    distanceFromUNN: 1.0,
    description: 'Quiet and conducive environment for studying. Close to Faculty of Arts. Features include reliable power supply, water, and good road access.',
    photos: [
      '/assets/images/lodge5-1.jpg',
      '/assets/images/lodge5-2.jpg',
      '/assets/images/lodge5-3.jpg',
    ],
    status: 'active',
    createdAt: '2024-09-15T10:00:00Z',
    updatedAt: '2024-09-15T10:00:00Z',
  },
  {
    id: 'listing-6',
    landlordId: 'landlord-3',
    lodgeName: 'Onuiyi Suites',
    lodgeAddress: '27 Market Road, Onuiyi, Nsukka',
    area: 'Onuiyi',
    pricePerYear: 130000,
    availableSlots: 10,
    distanceFromUNN: 1.8,
    description: 'Spacious rooms in a lively area close to the market. Good for students who like busy environments. Includes kitchen facilities and parking space.',
    photos: [
      '/assets/images/lodge6-1.jpg',
      '/assets/images/lodge6-2.jpg',
    ],
    status: 'active',
    createdAt: '2024-09-10T10:00:00Z',
    updatedAt: '2024-09-10T10:00:00Z',
  },
  {
    id: 'listing-7',
    landlordId: 'landlord-1',
    lodgeName: "Zik's Comfort Lodge",
    lodgeAddress: "18 Monument Street, Zik's Flats Area, Nsukka",
    area: "Zik's Flats Area",
    pricePerYear: 160000,
    availableSlots: 7,
    distanceFromUNN: 0.6,
    description: "Named after the great Zik himself! Very close to campus with excellent facilities. Features include Wi-Fi, backup generator, and a quiet study environment.",
    photos: [
      '/assets/images/lodge7-1.jpg',
      '/assets/images/lodge7-2.jpg',
      '/assets/images/lodge7-3.jpg',
    ],
    video: '/assets/videos/lodge7.mp4',
    status: 'active',
    createdAt: '2024-09-05T10:00:00Z',
    updatedAt: '2024-09-05T10:00:00Z',
  },
  {
    id: 'listing-8',
    landlordId: 'landlord-2',
    lodgeName: 'Elite Residence',
    lodgeAddress: '5 Campus Drive, Hilltop, Nsukka',
    area: 'Hilltop',
    pricePerYear: 220000,
    availableSlots: 2,
    distanceFromUNN: 0.7,
    description: 'Ultra-modern apartments with top-notch amenities. Perfect for postgraduate students and final years. Includes gym, laundry service, and study lounge.',
    photos: [
      '/assets/images/lodge8-1.jpg',
      '/assets/images/lodge8-2.jpg',
      '/assets/images/lodge8-3.jpg',
      '/assets/images/lodge8-4.jpg',
    ],
    status: 'active',
    createdAt: '2024-09-01T10:00:00Z',
    updatedAt: '2024-09-01T10:00:00Z',
  },
];

// Dummy Purchases
export const dummyPurchases: Purchase[] = [
  {
    id: 'purchase-1',
    studentId: 'student-1',
    landlordId: 'landlord-1',
    listingId: 'listing-1',
    paymentStatus: 'Released',
    inspectionStatus: 'Approved',
    amount: 150000,
    bookingRef: 'CN-2024-001',
    paymentDate: '2024-10-10T14:30:00Z',
    inspectionDate: '2024-10-12T10:00:00Z',
    releaseDate: '2024-10-12T11:00:00Z',
    createdAt: '2024-10-10T14:30:00Z',
    updatedAt: '2024-10-12T11:00:00Z',
  },
  {
    id: 'purchase-2',
    studentId: 'student-2',
    landlordId: 'landlord-2',
    listingId: 'listing-2',
    paymentStatus: 'Paid',
    inspectionStatus: 'Pending',
    amount: 180000,
    bookingRef: 'CN-2024-002',
    paymentDate: '2024-11-05T09:20:00Z',
    createdAt: '2024-11-05T09:20:00Z',
    updatedAt: '2024-11-05T09:20:00Z',
  },
];

// Helper function to get listing with landlord data
export const getListingWithLandlord = (listingId: string): Listing | undefined => {
  const listing = dummyListings.find(l => l.id === listingId);
  if (!listing) return undefined;

  const landlord = dummyLandlords.find(ll => ll.id === listing.landlordId);
  return {
    ...listing,
    landlord,
  };
};

// Helper function to get purchase with full data
export const getPurchaseWithDetails = (purchaseId: string): Purchase | undefined => {
  const purchase = dummyPurchases.find(p => p.id === purchaseId);
  if (!purchase) return undefined;

  const student = dummyStudents.find(s => s.id === purchase.studentId);
  const landlord = dummyLandlords.find(l => l.id === purchase.landlordId);
  const listing = dummyListings.find(l => l.id === purchase.listingId);

  return {
    ...purchase,
    student,
    landlord,
    listing,
  };
};

// Helper function to get landlord's listings
export const getLandlordListings = (landlordId: string): Listing[] => {
  return dummyListings.filter(l => l.landlordId === landlordId);
};

// Helper function to get landlord's purchases
export const getLandlordPurchases = (landlordId: string): Purchase[] => {
  return dummyPurchases.filter(p => p.landlordId === landlordId).map(purchase => ({
    ...purchase,
    student: dummyStudents.find(s => s.id === purchase.studentId),
    listing: dummyListings.find(l => l.id === purchase.listingId),
  }));
};

// Helper function to get student's purchases
export const getStudentPurchases = (studentId: string): Purchase[] => {
  return dummyPurchases.filter(p => p.studentId === studentId).map(purchase => ({
    ...purchase,
    landlord: dummyLandlords.find(l => l.id === purchase.landlordId),
    listing: dummyListings.find(l => l.id === purchase.listingId),
  }));
};
