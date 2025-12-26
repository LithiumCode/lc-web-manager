import { Component, inject, OnInit } from '@angular/core'
import { Router, RouterModule } from '@angular/router'
import { Auth, User as FirebaseUser } from '@angular/fire/auth'
import { CommonModule } from '@angular/common'
import { Firestore, doc, getDoc } from '@angular/fire/firestore'
import { ChangeDetectorRef } from '@angular/core'
import { registerLocaleData } from '@angular/common'
import ptBr from '@angular/common/locales/pt'
registerLocaleData(ptBr)

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss'
})
export class MainLayoutComponent implements OnInit {
  userName = ''
  userEmail = ''
  userPhone = ''
  userPhoto = ''
  description = ''
  rule = ''
  routerLinkActive = 'active'
  currentDate = new Date()

  constructor (
    public router: Router,
    private cdr: ChangeDetectorRef,
    private auth: Auth,
    private firestore: Firestore
  ) {}

  async ngOnInit () {
    const state = history.state
    if (state && (state.nome || state.email)) {
      this.userName = state.nome || 'Usuário'
      this.userEmail = state.email || ''
      this.userPhone = state.telefone || ''
      this.userPhoto = state.foto || 'assets/user-placeholder.png'
      this.rule = state.rule || ''
      this.description = `Olá, ${this.userName}!`
    } else {
      this.auth.onAuthStateChanged(async (user: FirebaseUser | null) => {
        if (user) {
          const userDocRef = doc(this.firestore, 'User', user.uid)
          const userSnap = await getDoc(userDocRef)
          if (userSnap.exists()) {
            const userData: any = userSnap.data()
            console.log('Dados do usuário Firestore:', userData)
            this.userName = userData.name || 'Usuário'
            this.userEmail = userData.email || ''
            this.userPhone = userData.phoneNumber || ''
            this.userPhoto = userData.imageURL || 'assets/user-placeholder.png'
            this.rule = userData.rule || ''
            this.description = `Olá, ${this.userName}!`
            this.cdr.detectChanges()
          } else {
            this.userName = user.displayName || 'Usuário'
            this.userEmail = user.email || ''
            this.userPhone = user.phoneNumber || ''
            this.userPhoto = user.photoURL || 'assets/user-placeholder.png'
            this.rule = ''
            this.description = `Olá, ${this.userName}!`
          }
        } else {
          this.router.navigate(['/'])
        }
      })
    }
  }

  get formattedDate (): string {
    const meses = [
      'janeiro',
      'fevereiro',
      'março',
      'abril',
      'maio',
      'junho',
      'julho',
      'agosto',
      'setembro',
      'outubro',
      'novembro',
      'dezembro'
    ]
    const dia = this.currentDate.getDate()
    const mes = meses[this.currentDate.getMonth()]
    const ano = this.currentDate.getFullYear()
    return `${dia} de ${mes} de ${ano}`
  }

  goToRegister () {
    this.router.navigate(['/home/register']);
  }
  goToCampaigns () {
    this.router.navigate(['/home/nova-campanha']);
  }
  goToNewClient () {
    this.router.navigate(['/home/new-client']);
  }

  goToReports () {
    this.router.navigate(['/home/reports']);
  }

  goToSettings () {
    this.router.navigate(['/home/settings']);
  }

  goToChangePassword () {
    this.router.navigate(['/home/change-password']);
  }

  goOut () {
    this.auth.signOut().then(() => {
      this.router.navigate(['/'])
    })
  }
}
