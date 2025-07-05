import {Injectable } from '@angular/core'
import {
  collection,
  doc,
  updateDoc
} from 'firebase/firestore'
import { Observable } from 'rxjs'
import { Campaign } from '../models/campaign'
import { collectionData, Firestore } from '@angular/fire/firestore'

@Injectable({
  providedIn: 'root'
})
export class CampaignService {

  constructor(private firestore: Firestore) {}

  getCampaigns(): Observable<Campaign[]> {
    const ref = collection(this.firestore, 'Campaign');
    return collectionData(ref, { idField: 'id' }) as Observable<Campaign[]>;
  }

  toggleCampaignStatus(campaignId: string, status: string): Promise<void> {
    const campaignDoc = doc(this.firestore, `Campaign/${campaignId}`);
    return updateDoc(campaignDoc, { status });
  }
}
