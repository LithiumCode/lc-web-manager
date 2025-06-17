import { Component } from '@angular/core'
import { Router } from '@angular/router'
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms'
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth'
import { Firestore, doc, setDoc } from '@angular/fire/firestore'
import { User } from '../../models/user'
import { CommonModule } from '@angular/common'

@Component({
  selector: 'app-user-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class UserRegisterComponent {
  registerForm: FormGroup
  errorMessage = ''
  successMessage = ''
  loading = false
  isSaving = false;

  constructor (
    private fb: FormBuilder,
    private auth: Auth,
    private firestore: Firestore,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: [''],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rule: ['', [Validators.required, Validators.minLength(3)]],
      imageURL: ['']
    })
  }

  async onSubmit () {
    this.isSaving = true;
    this.errorMessage = ''
    this.successMessage = ''
    if (this.registerForm.invalid) return

    const { name, email, phoneNumber, password, imageURL, rule } =
      this.registerForm.value
    this.loading = true
    try {
      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password
      )
      const userId = userCredential.user.uid

      const user: User = {
        userId,
        email,
        name,
        imageURL:
          imageURL ||
          'https://ui-avatars.com/api/?name=' + encodeURIComponent(name),
        phoneNumber,
        rule
      }

      const userDoc = doc(this.firestore, 'User', userId)
      await setDoc(userDoc, user)

      this.successMessage = 'Usuário cadastrado com sucesso!'
      this.registerForm.reset()
      this.isSaving = false;
    } catch (error: any) {
      this.errorMessage = error.message
    }
    this.loading = false
  }
}
