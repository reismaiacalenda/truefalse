import { ExclusaoModalComponent } from './exclusao-modal/exclusao-modal.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalService } from './modal.service';
import { SuccessModalComponent } from './success-modal/success-modal.component';
import { ErrorModalComponent } from './error-modal/error-modal.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MessageModalComponent } from './message-modal/message-modal.component';
import { TreeModalComponent } from './tree-modal/tree-modal.component';
import { ConfirmacaoModalComponent } from './confirmacao-modal/confirmacao-modal.component';
import { ServiceModalComponent } from './service-modal/service-modal.component';
import { AnQrcodeModule } from 'an-qrcode';
import { BoasVindasModalComponent } from './boas-vindas-modal/boas-vindas-modal.component';
import { AndaimeModule } from '../../../../_andaime/andaime.module';
import { RouterModule } from '@angular/router';
import { TrocarUnidadeModalComponent } from './trocar-unidade-modal/trocar-unidade-modal.component';
import { TrialExpiradoModalComponent } from './trial-expirado-modal/trial-expirado-modal.component';
import { LoteModalComponent } from './lote-modal/lote-modal.component';
import { TrialAgendadorModalComponent } from './trial-agendador-modal/trial-agendador-modal.component';

// RouterModule.forChild(routes),
@NgModule({
  imports: [
    AnQrcodeModule,
    CommonModule,
    NgbModule,
    RouterModule
    // AndaimeModule
  ],
  exports: [
  ],
  declarations: [
    SuccessModalComponent,
    ErrorModalComponent,
    ConfirmacaoModalComponent,
    ExclusaoModalComponent,
    MessageModalComponent,
    ServiceModalComponent,
    TreeModalComponent,
    BoasVindasModalComponent,
    TrocarUnidadeModalComponent,
    TrialExpiradoModalComponent,
    LoteModalComponent,
    TrialAgendadorModalComponent
  ],
  providers: [
    ModalService
  ],
  entryComponents: [
    SuccessModalComponent,
    ErrorModalComponent,
    ConfirmacaoModalComponent,
    ExclusaoModalComponent,
    MessageModalComponent,
    ServiceModalComponent,
    TreeModalComponent,
    BoasVindasModalComponent,
    TrocarUnidadeModalComponent,
    TrialExpiradoModalComponent,
    TrialAgendadorModalComponent,
    LoteModalComponent
  ]
})
export class ModalModule { }
