import { Component, inject } from '@angular/core'
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
import {
  Storage,
  ref,
  uploadBytes,
  getDownloadURL
} from '@angular/fire/storage'

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
  isSaving = false

  selectedPhotoName: string | null = null
  selectedPhotoFile: File | null = null

  private storage = inject(Storage);

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

  onPhotoSelected (event: any) {
    const file = event.target.files[0]
    if (file) {
      this.selectedPhotoFile = file
      this.selectedPhotoName = file.name
    }
  }

  async onSubmit () {
    this.isSaving = true
    this.errorMessage = ''
    this.successMessage = ''
    if (this.registerForm.invalid) return

    const { name, email, phoneNumber, password, rule } = this.registerForm.value
    this.loading = true
    try {
      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password
      )
      const userId = userCredential.user.uid

      let photoURL = ''
      if (this.selectedPhotoFile) {
        const storageRef = ref(
          this.storage,
          `user-photos/${userId}_${this.selectedPhotoFile.name}`
        )
        await uploadBytes(storageRef, this.selectedPhotoFile)
        photoURL = await getDownloadURL(storageRef)
      }

      const user: User = {
        userId,
        email,
        name,
        imageURL:
          photoURL ||
          'https://ui-avatars.com/api/?name=' + encodeURIComponent(name),
        phoneNumber,
        rule
      }

      const userDoc = doc(this.firestore, 'User', userId)
      await setDoc(userDoc, user)

      this.successMessage = 'Usuário cadastrado com sucesso!'
      this.registerForm.reset()
      this.selectedPhotoFile = null
      this.selectedPhotoName = null
      this.isSaving = false
    } catch (error: any) {
      this.errorMessage = error.message
    }
    this.loading = false
  }
}
