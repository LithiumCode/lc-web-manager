import { inject, Injectable } from '@angular/core'
import {
  collection,
  Firestore,
  getDocs,
  CollectionReference
} from 'firebase/firestore'
import { map, Observable } from 'rxjs'
import { Campaign } from '../models/campaign'
import { collectionData } from '@angular/fire/firestore'

@Injectable({
  providedIn: 'root'
})
export class CampaignService {

  constructor(private firestore: Firestore) {}

  getCampaigns(): Observable<Campaign[]> {
    const ref = collection(this.firestore, 'Campaign');
    return collectionData(ref, { idField: 'id' }) as Observable<Campaign[]>;
  }
}
