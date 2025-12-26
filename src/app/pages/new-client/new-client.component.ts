import { CommonModule } from '@angular/common'
import { Component, inject } from '@angular/core'
import { Client } from '../../models/client'
import { addDoc, collection } from 'firebase/firestore'
import { FormsModule } from '@angular/forms'
import { Firestore } from '@angular/fire/firestore'

@Component({
  selector: 'app-new-client.component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './new-client.component.html',
  styleUrl: './new-client.component.scss'
})
export class NewClientComponent {
  public isSaving = false
  public errorMsg: string = ''
  public successClient: any = null
  public successMsg: any = null

  novoCliente: Client = {
    razaoSocial: '',
    nomeFantasia: '',
    cnpj: '',
    inscricaoEstadual: '',
    endereco: '',
    telefone: '',
    email: '',
    responsavel: ''
  }

  private firestore = inject(Firestore)

  constructor () {}

  maskCnpj (event: any) {
    let value = event.target.value.replace(/\D/g, '')
    if (value.length > 14) value = value.slice(0, 14)
    value = value.replace(/^(\d{2})(\d)/, '$1.$2')
    value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    value = value.replace(/\.(\d{3})(\d)/, '.$1/$2')
    value = value.replace(/(\d{4})(\d)/, '$1-$2')
    this.novoCliente.cnpj = value
  }

  async cadastrarCliente () {
    this.isSaving = true
    this.errorMsg = ''
    this.successClient = null
    try {
      const docRef = await addDoc(
        collection(this.firestore, 'Client'),
        this.novoCliente
      )
      this.successClient = { ...this.novoCliente }
      this.novoCliente = {
        razaoSocial: '',
        nomeFantasia: '',
        cnpj: '',
        inscricaoEstadual: '',
        endereco: '',
        telefone: '',
        email: '',
        responsavel: ''
      }
    } catch (error: any) {
      this.errorMsg = 'Erro ao cadastrar cliente: ' + (error.message || error)
    } finally {
      this.isSaving = false
    }
  }

  cancelarCadastro () {
    this.novoCliente = {
      razaoSocial: '',
      nomeFantasia: '',
      cnpj: '',
      inscricaoEstadual: '',
      endereco: '',
      telefone: '',
      email: '',
      responsavel: ''
    }
  }
}
