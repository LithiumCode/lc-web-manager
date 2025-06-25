import { CommonModule } from '@angular/common'
import { Component, inject, OnInit } from '@angular/core'
import { Router, RouterModule } from '@angular/router'
import { Firestore, collection, collectionData } from '@angular/fire/firestore'
import { firstValueFrom } from 'rxjs'
import { Auth } from '@angular/fire/auth'
import { doc, getDoc } from '@angular/fire/firestore'
import { FormsModule } from '@angular/forms'
import { User } from '../../models/user'

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  protected title = 'Web Skt Manager'
  protected description = ''
  user: User | null = null
  currentDate = new Date()

  skaters: any[] = []
  challenges: any[] = []

  private firestore = inject(Firestore)
  private auth = inject(Auth)

  constructor (private router: Router) {
    // Só pega do state se vier de navegação
    const nav = this.router.getCurrentNavigation()
    if (nav?.extras.state && nav.extras.state['user']) {
      this.user = nav.extras.state['user'] as User
    }
  }

  async ngOnInit (): Promise<void> {
    this.loadUserRule()
    this.loadSkaters()
    this.loadChallengers()
    this.loadUserData()
    const state = history.state
  }

  async loadUserData () {
    if (!this.user) {
      const currentUser = this.auth.currentUser
      if (currentUser) {
        const userDocRef = doc(this.firestore, 'User', currentUser.uid)
        const userSnap = await getDoc(userDocRef)
        if (userSnap.exists()) {
          this.user = userSnap.data() as User
        }
      }
    }
  }

  async loadUserRule () {
    const user = this.auth.currentUser
    if (user) {
      const userDocRef = doc(this.firestore, 'User', user.uid)

      const userSnap = await getDoc(userDocRef)
      if (userSnap.exists()) {
        const userData = userSnap.data() as any
      }
    }
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

  showNewCampaign = false
  newCampaign: any = {}

  onStepChange () {
    // Força atualização do Angular para mostrar próximo campo
  }

  onVideoSelected (event: any) {
    const file = event.target.files[0]
    if (file) {
      this.newCampaign.video = file
    }
  }

  cancelNewCampaign () {
    this.showNewCampaign = false
    this.newCampaign = {}
  }

  submitCampaign () {
    // Aqui você pode salvar a campanha (mock ou API)
    alert('Campanha criada!')
    this.cancelNewCampaign()
  }

  goToRegister () {
    this.router.navigate(['/register'])
  }

  goToNewCampaign () {
    this.router.navigate(['/home/nova-campanha'])
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

  goOut () {
    this.auth
      .signOut()
      .then(() => {
        console.log('====================================')
        console.log('Usuário deslogado com sucesso')
        console.log('====================================')
        this.router.navigate(['/login'])
      })
      .catch(error => {
        console.error('Erro ao deslogar:', error)
      })
  }
}
