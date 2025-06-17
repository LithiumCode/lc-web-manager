import { CommonModule } from '@angular/common'
import { Component, inject, OnInit } from '@angular/core'
import { Router, RouterModule } from '@angular/router'
import { Firestore, collection, collectionData } from '@angular/fire/firestore'
import { firstValueFrom } from 'rxjs'
import { Auth } from '@angular/fire/auth'
import { doc, getDoc } from '@angular/fire/firestore'
import { FormsModule } from '@angular/forms'

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

  async ngOnInit (): Promise<void> {
    this.loadUserRule()
    this.loadSkaters()
    this.loadChallengers()
    const state = history.state
  }

  async loadUserRule () {
    const user = this.auth.currentUser
    if (user) {
      const userDocRef = doc(this.firestore, 'User', user.uid)

      const userSnap = await getDoc(userDocRef)
      if (userSnap.exists()) {
        const userData = userSnap.data() as any
        this.rule = userData.rule || ''
        this.userName = userData.nome || 'Usuário'
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
    this.router.navigate(['/home/nova-campanha']);
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
