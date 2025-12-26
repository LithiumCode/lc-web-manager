export interface User {
  userId: string;  
  email: string;
  password?: string;
  name: string;
  imageURL: string;
  phoneNumber: string;
  rule?: string;
}