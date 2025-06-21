import { Component, inject, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { FormsModule } from '@angular/forms'
import { CommonModule } from '@angular/common'
import {
  collectionData,
  doc,
  Firestore,
  getDoc,
  getDocs,
  query,
  where
} from '@angular/fire/firestore'
import { Storage } from '@angular/fire/storage'
import { ref, uploadBytes, getDownloadURL } from '@angular/fire/storage'
import { addDoc, collection } from '@angular/fire/firestore'
import { CampaignStatus } from '../../commons/campaign-status'
import { Auth } from '@angular/fire/auth'
import { Client } from '../../models/client'
import { firstValueFrom } from 'rxjs'

@Component({
  selector: 'app-new-campaign-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './new-campaign.component.html',
  styleUrl: './new-campaign.component.scss'
})
export class NewCampaignComponent implements OnInit {
  public step = 1
  public newCampaign: any = {}
  public client: any = []
  public advertiser: any = []
  public selectedAd: any = null
  public showNewCampaign = false
  public isSaving = false
  public cnpj = ''
  public buscaCnpj = ''
  public cliente: any = null
  public errorMsg: string = ''
  public successCampaign: any = null
  public user: any = null
  public clienteNaoEncontradoMsg = ''
  public isSearching = false
  public isBuscandoCliente = false
  public isCnpjValid: boolean = false

  private auth = inject(Auth)
  private firestore = inject(Firestore)
  private storage = inject(Storage)

  constructor (private router: Router) {}

  async ngOnInit () {
    const advertisingCol = collection(this.firestore, 'Advertising')
    const snapshot = await getDocs(advertisingCol)
    this.advertiser = snapshot.docs.map(doc => doc.data())
    this.auth.onAuthStateChanged(user => {
      if (user) {
        this.user = {
          userId: user.uid,
          name: user.displayName,
          email: user.email
        }
      }
    })
  }

  nextStep (event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault()
      this.step++
    }
  }

  async buscarClientePorCnpj () {
    this.isBuscandoCliente = true
    this.clienteNaoEncontradoMsg = ''
    try {
      const clientesRef = collection(this.firestore, 'Client')
      const q = query(clientesRef, where('cnpj', '==', this.cnpj))
      const result = await firstValueFrom(collectionData(q, { idField: 'id' }))
      if (result.length > 0) {
        this.cliente = result[0]
        this.clienteNaoEncontradoMsg = ''
      } else {
        this.cliente = null
        this.clienteNaoEncontradoMsg = 'Cliente não encontrado!'
      }
    } catch (error) {
      this.clienteNaoEncontradoMsg = 'Erro ao buscar cliente!'
    } finally {
      this.isBuscandoCliente = false
    }
  }

  isCnpjValido (cnpj: string): boolean {
    return !!cnpj && cnpj.replace(/\D/g, '').length === 14
  }

  onAdSelected () {
    if (this.selectedAd) {
      this.newCampaign.name = this.selectedAd.name
      this.newCampaign.advertiser = this.selectedAd.advertiser
      this.newCampaign.days = this.selectedAd.days
      this.step = 4 // Avança para o campo de CNPJ
    }
  }

  onVideoSelected (event: any) {
    const file = event.target.files[0]
    if (file) {
      this.newCampaign.video = file
      this.step++
    }
  }
  cancelNewCampaign () {
    this.cnpj = ''
    this.cliente = null
    this.selectedAd = null
    this.newCampaign = { days: null, media: null }
  }

  async submitCampaign () {
    console.log({
      cliente: this.cliente,
      selectedAd: this.selectedAd,
      newCampaign: this.newCampaign,
      user: this.user
    })

    if (
      !this.cliente ||
      !this.cliente.companyName ||
      !this.cliente.address ||
      !this.selectedAd ||
      !this.selectedAd.type ||
      !this.selectedAd.price ||
      !this.selectedAd.period ||
      !this.newCampaign.name ||
      !this.newCampaign.days ||
      !this.newCampaign.media ||
      !this.user ||
      !this.user.userId ||
      !this.user.name
    ) {
      this.errorMsg = 'Preencha todos os campos obrigatórios!'
      return
    }

    this.isSaving = true

    try {
      // Upload da mídia
      const file = this.newCampaign.media
      const filePath =
        this.selectedAd.type === 'video'
          ? `campaign-videos/${Date.now()}_${file.name}`
          : `campaign-images/${Date.now()}_${file.name}`

      const storageRef = ref(this.storage, filePath)
      await uploadBytes(storageRef, file)
      const mediaUrl = await getDownloadURL(storageRef)

      // Monta objeto da campanha
      const campaignData = {
        name: this.newCampaign.name,
        price: this.selectedAd.price,
        period: this.selectedAd.period,
        days: Number(this.newCampaign.days),
        mediaUrl,
        mediaType: this.selectedAd.type,
        advertiser: this.selectedAd.type,
        client: {
          id: this.cliente.id || null,
          companyName: this.cliente.companyName,
          tradeName: this.cliente.tradeName,
          cnpj: this.cliente.cnpj,
          stateRegistration: this.cliente.stateRegistration || '',
          municipalRegistration: this.cliente.municipalRegistration || '',
          address: this.cliente.address,
          contact: this.cliente.contact,
          representative: this.cliente.representative
        },
        createdById: this.user.userId,
        createdByName: this.user.displayName || this.user.name,
        createdAt: new Date(),
        status: CampaignStatus.INACTIVE
      }
      console.log('====================================')
      console.log('Dados da campanha:', campaignData)
      console.log('====================================')

      // Salva no Firestore
      await addDoc(collection(this.firestore, 'Campaign'), campaignData)

      // Sucesso
      alert('Campanha criada com sucesso!')
      this.successCampaign = campaignData
      this.newCampaign = {}
      this.selectedAd = null
      this.isSaving = false
      this.router.navigate(['/home'])
    } catch (error: any) {
      alert('Erro ao salvar campanha: ' + error.message)
      this.isSaving = false
    }

    this.errorMsg = ''
  }

  onMediaSelected (event: any) {
    console.log('Arquivo selecionado:', event)

    const file = event.target.files[0]
    if (file) {
      this.newCampaign.media = file
    }
  }

  // Mover para uma pasta apartada no futuro
  maskCnpj (event: any) {
    let value = event.target.value.replace(/\D/g, '')
    if (value.length > 14) value = value.slice(0, 14)
    value = value.replace(/^(\d{2})(\d)/, '$1.$2')
    value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    value = value.replace(/\.(\d{3})(\d)/, '.$1/$2')
    value = value.replace(/(\d{4})(\d)/, '$1-$2')
    this.cnpj = value
    this.isCnpjValid = true
  }
}
