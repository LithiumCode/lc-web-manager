import { Component, inject } from '@angular/core'
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms'
import { CommonModule } from '@angular/common'
import {
  Storage,
  ref,
  uploadBytes,
  getDownloadURL
} from '@angular/fire/storage'
import { Firestore, doc, setDoc } from '@angular/fire/firestore'
import { environment } from '../../../environments/enviroments'
import { initializeApp } from 'firebase/app'
import { getAuth, createUserWithEmailAndPassword, signOut } from 'firebase/auth'
import { User } from '../../models/user'

@Component({
  selector: 'app-user-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class UserRegisterComponent {
  selectedPhotoFile: File | null = null
  selectedPhotoName: string | null = null
  isSaving = false
  loading = false
  errorMessage = ''
  successMessage = ''

  private storage = inject(Storage)
  private firestore = inject(Firestore)
  private fb = inject(FormBuilder)

  registerForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    phoneNumber: [''],
    rule: ['', Validators.required]
  })

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
    if (this.registerForm.invalid) {
      this.isSaving = false
      return
    }

    const { name, email, phoneNumber, rule, password } = this.registerForm.value as User & { password: string };
    this.loading = true
    try {
      const secondaryApp = initializeApp(environment.firebase, 'Secondary')
      const secondaryAuth = getAuth(secondaryApp)

      const userCredential = await createUserWithEmailAndPassword(
        secondaryAuth,
        email!,
        password!
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
          'https://ui-avatars.com/api/?name=' + encodeURIComponent(name!),
        phoneNumber,
        rule
      }
      const userDoc = doc(this.firestore, 'User', userId)
      await setDoc(userDoc, user)

      await signOut(secondaryAuth)

      this.successMessage = 'Usuário cadastrado com sucesso!'
      this.registerForm.reset()
      this.selectedPhotoFile = null
      this.selectedPhotoName = null
    } catch (error: any) {
      this.errorMessage = error.message
    } finally {
      this.isSaving = false
      this.loading = false
    }
  }
}
