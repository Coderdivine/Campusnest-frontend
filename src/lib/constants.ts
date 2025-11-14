// Top 7 UNN Areas for filtering
export const UNN_AREAS = [
  'Odenigwe',
  'Hilltop',
  'Green House',
  'Abuja Building Area',
  'Faculty of Arts Area',
  'Onuiyi',
  "Zik's Flats Area",
] as const;

export type UNNArea = typeof UNN_AREAS[number];

// Identification types
export const ID_TYPES = [
  'National ID',
  'Voter\'s Card',
  'Driver\'s License',
] as const;

export type IDType = typeof ID_TYPES[number];

// User roles
export const USER_ROLES = {
  STUDENT: 'student',
  LANDLORD: 'landlord',
} as const;

// Payment statuses
export const PAYMENT_STATUS = {
  PENDING: 'Pending',
  PAID: 'Paid',
  RELEASED: 'Released',
  REFUNDED: 'Refunded',
} as const;

// Inspection statuses
export const INSPECTION_STATUS = {
  PENDING: 'Pending',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
} as const;
