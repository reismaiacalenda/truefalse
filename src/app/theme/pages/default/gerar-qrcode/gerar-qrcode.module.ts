import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AnQrcodeModule } from 'an-qrcode';
import { QrCodeModalComponent } from '../gerar-qrcode/qrcode-modal/qrcode-modal.component';
import { GerarQrCodeModalService } from './gerar-qrcode.service';

// RouterModule.forChild(routes),
@NgModule({
  imports: [
    AnQrcodeModule,
    CommonModule,
    NgbModule
  ],
  exports: [
  ],
  declarations: [
    QrCodeModalComponent
  ],
  providers: [
    GerarQrCodeModalService
  ],
  entryComponents: [
    QrCodeModalComponent
  ]
})
export class GerarQrCodeModule { }
