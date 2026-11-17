export type Role = {
  id: number;
  name: string;
};

export type Account = {
  id: number;
  email: string;
  name: string;
  lastName: string;
  role: Role | null;
};

export type Shop = {
  id: number;
  name: string;
  city: string;
  street: string;
  streetNumber: number;
  phone: string | null;
  chair: number;
  ownerId: number | null;
};

export type SlotUser = {
  id: number;
  name: string;
  lastName: string;
};

export type Slot = {
  id: number;
  bookingStart: string;
  bookingEnd: string;
  reserved: boolean;
  state: boolean;
  barberShopId: number | null;
  barberShopName: string | null;
  user: SlotUser | null;
};

export type ShopInput = {
  name: string;
  city: string;
  street: string;
  streetNumber: number;
  phone?: string;
  chair: number;
};

export type RegisterInput = {
  email: string;
  name: string;
  lastName: string;
  password: string;
  rolId: number;
};
