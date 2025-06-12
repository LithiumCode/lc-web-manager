import { CommonModule } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  protected title = 'Bem-vindo ao Web Manager'
  protected description = ''

  userName = ''
  userEmail = ''
  userPhone = ''
  userPhoto = ''
  currentDate = new Date()

  constructor (private router: Router) {
    
  }

  ngOnInit (): void {
    console.log('====================================')
    console.log('Entrando na Home Page')
    console.log('====================================')
    const state = history.state;
    this.userName = state.nome || 'Usuário';
    this.userEmail = state.email || '';
    this.userPhone = state.telefone || '';
    this.userPhoto = state.foto || 'assets/user-placeholder.png';
    console.log('Trazendo a foto do usuário:', this.userPhoto);
    console.log('Trazendo a email do usuário:', this.userEmail);
    console.log('Trazendo a nome do usuário:', this.userName);
    console.log('Trazendo a telefone do usuário:', this.userPhone);
    this.description = `Olá, ${this.userName}. Bem-vindo ao Web Manager!`
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
