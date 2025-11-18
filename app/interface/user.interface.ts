
export interface UserInterface {
  name: string;
  email: string;
  phone: string;
  address: string;
  profileImage?: string;
  password: string;
  role: "admin" | "user";
  createdAt?: Date;
  updatedAt?: Date;
}
