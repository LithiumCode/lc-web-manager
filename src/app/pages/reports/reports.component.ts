import { CommonModule } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { CampaignService } from '../../services/campaign-service'
import { Campaign } from '../../models/campaign'
import { Observable } from 'rxjs'
import { CampaignStatus } from '../../commons/campaign-status'

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss'
})
export class ReportsComponent implements OnInit {
  campaigns$!: Observable<Campaign[]>
  isLoading: boolean = false
  error: string = ''
  newStatus: string = ''

  constructor (private campaignService: CampaignService) {}

  ngOnInit (): void {
    this.fetchCampaigns()
  }

  fetchCampaigns (): void {
    this.isLoading = true
    this.campaigns$ = this.campaignService.getCampaigns()
    this.isLoading = false
  }

  toggleStatus (campaign: Campaign, event: Event): void {
    console.log('Toggling status for campaign:', campaign)
    const input = event.target as HTMLInputElement
    if (input.checked===true) {
      this.newStatus = CampaignStatus.ACTIVE
    } else {
      this.newStatus = CampaignStatus.INACTIVE
    }

    this.campaignService
      .toggleCampaignStatus(campaign.id, this.newStatus)
      .catch(err => {
        console.error('Erro ao atualizar status', err)
        this.error = 'Erro ao atualizar status'
      })
  }
}
