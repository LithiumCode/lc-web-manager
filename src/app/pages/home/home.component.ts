import { CommonModule } from '@angular/common'
import { Component, inject, OnInit } from '@angular/core'
import { Router, RouterModule } from '@angular/router'
import { Firestore, collection, collectionData } from '@angular/fire/firestore'
import { firstValueFrom } from 'rxjs'
import { Auth } from '@angular/fire/auth'

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
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
  rule = ''
  currentDate = new Date()

  skaters: any[] = []
  challenges: any[] = []

  private firestore = inject(Firestore)
   private auth = inject(Auth)

  constructor (private router: Router) {}

  ngOnInit (): void {
    this.loadSkaters()
    this.loadChallengers()
    const state = history.state
    this.userName = state.nome || 'Usuário'
    this.userEmail = state.email || ''
    this.userPhone = state.telefone || ''
    this.userPhoto = state.foto || 'assets/user-placeholder.png'
    this.description = `Olá, ${this.userName}!`
  }

  async loadSkaters () {
    const skaterCol = collection(this.firestore, 'Skater')
    const skaters$ = collectionData(skaterCol, { idField: 'id' })
    this.skaters = await firstValueFrom(skaters$)
  }
  async loadChallengers () {
    const challengerCol = collection(this.firestore, 'Challenges')
    const challengers$ = collectionData(challengerCol, { idField: 'id' })
    this.challenges = await firstValueFrom(challengers$)
  }

  goToRegister () {
    this.router.navigate(['/register'])
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

  goOut() {
    this.auth.signOut().then(() => {
      console.log('====================================')
      console.log('Usuário deslogado com sucesso')
      console.log('====================================')
      this.router.navigate(['/login'])
    }).catch(error => {
      console.error('Erro ao deslogar:', error)
    })
  }
}
