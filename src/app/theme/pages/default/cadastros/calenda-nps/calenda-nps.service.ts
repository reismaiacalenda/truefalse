import { Injectable } from "@angular/core";
import { NgbModal, NgbModalOptions } from "@ng-bootstrap/ng-bootstrap";
import { consoleLog } from "../../../../../globals";
import { Helpers } from "../../../../../helpers";
import { CalendaNpsFormComponent } from "./calenda-nps-form/calenda-nps-form.component";

@Injectable()
export class CalendaNpsService {
  
  constructor(public modalNgb: NgbModal){}

  abrirCustomModal(questionario_id):Promise<any>{
    Helpers.setLoading(true);
    let ngbModalOptions: NgbModalOptions={
    }
    let modal = this.modalNgb.open(CalendaNpsFormComponent, ngbModalOptions);
    modal.componentInstance.carregarQuestionario(questionario_id);
    modal.result.then(r=>{
      consoleLog("retornando do submmit?")
      consoleLog(r);
      switch (r) {
        case 'pessoa':
            // this.abrirModalPessoaPegarEquipamento();
          break;

        default:
          break;
      } 
    })
    return modal.result;
  }

}