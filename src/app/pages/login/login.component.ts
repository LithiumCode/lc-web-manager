import { CommonModule } from '@angular/common'
import { Component, inject } from '@angular/core'
import { Auth } from '@angular/fire/auth'
import { FormsModule } from '@angular/forms'
import { Router } from '@angular/router'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { Firestore, doc, getDoc } from '@angular/fire/firestore'
import { User } from '../../models/user'

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  email = ''
  password = ''
  errorMessage = ''
  userData: any
  private auth = inject(Auth)
  private firestore = inject(Firestore)

  constructor (private route: Router) {
    this.auth.onAuthStateChanged(async user => {
      if (user) {
        const uid = user.uid
        // Busca os dados do usuário na coleção Skater
        const userDocRef = doc(this.firestore, 'Skater', uid)
        const userSnap = await getDoc(userDocRef)
        if (userSnap.exists()) {
          this.userData = userSnap.data()
          const user: User = {
            userId: uid,
            email: this.userData.email,
            name: this.userData.name,
            imageURL: this.userData.imageURL || 'assets/user-placeholder.png',
            phoneNumber: this.userData.phoneNumber,
            rule: this.userData.rule
          }
          this.route.navigate(['/home'], { state: { user } })
        } else {
          this.route.navigate(['/home'])
        }
      }
    })
  }

  async login () {
    this.errorMessage = ''
    try {
      const userCredential = await signInWithEmailAndPassword(
        this.auth,
        this.email,
        this.password
      )
      const uid = userCredential?.user?.uid
      if (uid) {
        // Busca os dados do usuário na coleção Skater
        const userDocRef = doc(this.firestore, 'Skater', uid)
        const userSnap = await getDoc(userDocRef)
        if (userSnap.exists()) {
          this.userData = userSnap.data()
          // Envie os dados para a home
          this.route.navigate(['/home'], {
            state: {
              nome: this.userData.name,
              telefone: this.userData.phoneNumber,
              email: this.userData.email,
              foto: this.userData.imageUrl || 'assets/user-placeholder.png'
            }
          })
        } else {
          this.errorMessage = 'Usuário não encontrado na base de dados.'
        }
      }
    } catch (error: any) {
      this.errorMessage = error.message
    }
  }
}
