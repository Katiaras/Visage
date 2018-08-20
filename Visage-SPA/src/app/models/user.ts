import { Photo } from './photo';

export interface User {
  id: number;
  username: string;
  gender: string;
  age: number;
  knownAs: string;
  created: Date;
  lastActive: Date;
  dateOfBirth: Date;
  country: string;
  city: string;
  photoUrl: string;
  interests?: string;
  introduction?: string;
  photos?: Photo[];
}
