export interface User {
  skaterId: string;  
  email: string;
  name: string;
  imageURL: string;
  phoneNumber: string;
  challengeId?: string;
  challengeCreated?: [];
  followers?: string[];
  following?: string[];
  trophies?: string[];
}