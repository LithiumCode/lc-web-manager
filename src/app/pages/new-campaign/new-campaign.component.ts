import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Firestore } from '@angular/fire/firestore';
import { Storage } from '@angular/fire/storage';
import { ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';
import { addDoc, collection } from '@angular/fire/firestore';

@Component({
  selector: 'app-new-campaign-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './new-campaign.component.html',
  styleUrl: './new-campaign.component.scss'
})
export class NewCampaignComponent {
  step = 1;
  newCampaign: any = {};
  showNewCampaign = false;
  isSaving = false;

  private firestore = inject(Firestore)
  private storage = inject(Storage)

  constructor(
    private router: Router,
  ) {}

  nextStep(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.step++;
    }
  }

  onVideoSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.newCampaign.video = file;
      this.step++;
    }
  }
  cancelNewCampaign () {
    this.showNewCampaign = false
    this.newCampaign = {}
  }

  
  async submitCampaign() {
    if (!this.newCampaign.name || !this.newCampaign.advertiser || !this.newCampaign.days || !this.newCampaign.video) {
      alert('Preencha todos os campos!');
      return;
    }
    this.isSaving = true;
    try {
      // 1. Salva o vídeo no Storage
      const file = this.newCampaign.video;
      const storageRef = ref(this.storage, `campaign-videos/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const videoUrl = await getDownloadURL(storageRef);

      // 2. Salva os dados no Firestore
      const campaignData = {
        name: this.newCampaign.name,
        advertiser: this.newCampaign.advertiser,
        days: this.newCampaign.days,
        videoUrl: videoUrl,
        createdAt: new Date()
      };
      await addDoc(collection(this.firestore, 'Campaign'), campaignData);

      this.router.navigate(['/home']);
    } catch (error) {
      alert('Erro ao salvar campanha: ' + (error as any).message);
    } finally {
      this.isSaving = false;
    }
  }
}
