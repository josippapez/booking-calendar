export interface Apartment {
  name: string;
  address: string;
  id: string;
  email: string;
  image: File | string;
  pid: string;
  iban: string;
  owner: string;
  pricePerNight?: number;
}
