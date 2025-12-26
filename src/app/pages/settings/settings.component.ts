import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import {
  addDoc,
  collection,
  collectionData,
  doc,
  Firestore,
  updateDoc
} from '@angular/fire/firestore'
import { ReactiveFormsModule } from '@angular/forms'
import { CommonModule } from '@angular/common'

@Component({
  selector: 'app-settings.component',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent implements OnInit {
  featureToggleForm!: FormGroup
  toggles: any[] = []
  loading = false
  success = false

  constructor (private fb: FormBuilder, private firestore: Firestore) {}

  ngOnInit () {
    this.loadToggles()
    this.featureToggleForm = this.fb.group({
      key: ['', Validators.required],
      feature: ['', Validators.required],
      description: [''],
      enabled: [true] // valor padrão true
    })
  }

  async onSubmit () {
    if (this.featureToggleForm.invalid) return

    this.loading = true
    this.success = false

    try {
      const toggleData = this.featureToggleForm.value
      const collectionRef = collection(this.firestore, 'Feature-toggle')
      await addDoc(collectionRef, toggleData)
      this.success = true
      this.featureToggleForm.reset({
        key: '',
        feature: '',
        description: '',
        enabled: true
      })
      this.loadToggles() // Atualiza lista
    } catch (error) {
      console.error('Erro ao salvar:', error)
      alert('Erro ao salvar. Veja o console.')
    } finally {
      this.loading = false
    }
  }

  loadToggles () {
    const collectionRef = collection(this.firestore, 'Feature-toggle')
    collectionData(collectionRef, { idField: 'id' }).subscribe(data => {
      this.toggles = data
    })
  }

  async toggleEnabled (toggle: any) {
    const docRef = doc(this.firestore, `Feature-toggle/${toggle.id}`)
    try {
      await updateDoc(docRef, { enabled: !toggle.enabled })
      toggle.enabled = !toggle.enabled // otimiza a UX
    } catch (err) {
      console.error('Erro ao atualizar toggle:', err)
      alert('Erro ao atualizar toggle.')
    }
  }
}
