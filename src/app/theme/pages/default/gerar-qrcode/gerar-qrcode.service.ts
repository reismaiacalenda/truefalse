import { Injectable } from "@angular/core";
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Helpers } from './../../../../helpers';
import { QrCodeModalComponent } from '../gerar-qrcode/qrcode-modal/qrcode-modal.component';
import { WebService } from '../../../../_services/web.service';
import { ModalService } from '../modal/modal.service';
import { QrcodeComponent } from '../reservas/qrcode/qrcode.component';
import { consoleLog } from '../../../../globals';

@Injectable()
export class GerarQrCodeModalService {

  constructor(
    public modalNgb:NgbModal,
    public webService:WebService,
    public modalService:ModalService) { }

  tratarQrCode(id, titulo){
    Helpers.setLoading(true);
    consoleLog("id na service");
    consoleLog(id);
    this.webService.get(`checks/gerar_qrcode?${id}`, {})
      .subscribe(
        (response) => {
          Helpers.setLoading(false);
          consoleLog("response");
          consoleLog(response);
          if (response){
            let ngbModalOptions: NgbModalOptions;
              ngbModalOptions={
              backdrop: 'static',
              keyboard: true,
              size: 'sm'
            }
            const msgModal = this.modalNgb.open(QrCodeModalComponent, ngbModalOptions);
            msgModal.componentInstance.titulo = titulo;
            msgModal.componentInstance.qrCode = response.qrcode_link;
          }
        },
        (error: any) => {
          this.modalService.tratarError(error);
          Helpers.setLoading(false);
        }
      );
    }

}