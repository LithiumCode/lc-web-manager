import { CommonModule } from '@angular/common'
import { Component, inject, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { Firestore, collection, collectionData } from '@angular/fire/firestore'
import { firstValueFrom } from 'rxjs'

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  protected title = 'Web Skt Manager'
  protected description = ''

  userName = ''
  userEmail = ''
  userPhone = ''
  userPhoto = ''
  currentDate = new Date()

  skaters: any[] = [];
  challenges: any[] = [];

  private firestore = inject(Firestore)

  constructor (private router: Router) {
    
  }

  ngOnInit (): void {
    this.loadSkaters();
    this.loadChallengers();
    const state = history.state;
    this.userName = state.nome || 'Usuário';
    this.userEmail = state.email || '';
    this.userPhone = state.telefone || '';
    this.userPhoto = state.foto || 'assets/user-placeholder.png';
    this.description = `Olá, ${this.userName}. Bem-vindo ao ${this.title}!`
  }

  async loadSkaters() {
    const skaterCol = collection(this.firestore, 'Skater');
    const skaters$ = collectionData(skaterCol, { idField: 'id' });
    this.skaters = await firstValueFrom(skaters$);
  }
  async loadChallengers() {
    const challengerCol = collection(this.firestore, 'Challenges');
    const challengers$ = collectionData(challengerCol, { idField: 'id' });
    this.challenges = await firstValueFrom(challengers$);
    
  }

  goToCampaigns () {
    console.log('====================================')
    console.log('Navegando para campanhas')
    console.log('====================================')
  }

  goToReports () {
    console.log('====================================')
    console.log('Navegando para relatórios')
    console.log('====================================')
  }

  goToSettings () {
    console.log('====================================')
    console.log('Navegando para Configurações')
    console.log('====================================')
  }
}
