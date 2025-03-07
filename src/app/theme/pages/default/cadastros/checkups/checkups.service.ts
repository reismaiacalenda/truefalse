import { Injectable } from "@angular/core";
import { NgbModal, NgbModalOptions } from "@ng-bootstrap/ng-bootstrap";
import { consoleLog } from "../.../../../../../../globals";
import { Helpers } from "../../../../../helpers";
import { BurnoutFormComponent } from "./burnout-form/burnout-form.component";
import { CheckupCovidFormComponent } from "./checkup-covid-form/checkup-covid-form.component";
import { CheckupFormComponent } from "./checkup-form/checkup-form.component";
import { CheckupsComponent } from "./checkups.component";
import { VacinadoFormComponent } from "./vacinado-form/vacinado-form.component";

@Injectable()
export class CheckupsService {
  
  constructor(public modalNgb: NgbModal){
    
  }

    //#region Checkups

  abrirModalCheckups():Promise<any>{
    // this.construirFormulario();
    Helpers.setLoading(true);
    let ngbModalOptions: NgbModalOptions={
      // backdrop: 'static',
      // keyboard: false,
    }
    let modal = this.modalNgb.open(CheckupsComponent, ngbModalOptions);
    modal.result.then(r=>{
      if (r != undefined){
        this.abrirCustomModal(r);
      }
      // switch (r.template) {
      // //   case 'covid':
      // //       this.abrirModalCheckupCovid();
      // //     break;

      // //   case 'vacinado':
      // //       this.abrirModalVacinado();
      // //     break;

      //   // case 'burnout':
      //   //   this.abrirModalBurnout();
      //   //   break;

      //   default:
      //     this.abrirCustomModal(r);
      //     break;
      // } 
    })
    // modal.componentInstance.reservaModalService = this;
    // modal.componentInstance.formulario = this.formulario;
    // modal.componentInstance.rowId = this.formulario.get('id').value;
    // modal.componentInstance.formArrayName = 'recursos_reservados_attributes';
    return modal.result;

  }


  abrirModalCheckupCovid():Promise<any>{
    // this.construirFormulario();
    Helpers.setLoading(true);
    let ngbModalOptions: NgbModalOptions={
      // backdrop: 'static',
      // keyboard: false,
    }
    let modal = this.modalNgb.open(CheckupCovidFormComponent, ngbModalOptions);
    modal.result.then(r=>{
      switch (r) {
        case 'pessoa':
            // this.abrirModalPessoaPegarEquipamento();
          break;

        default:
          break;
      } 
    })
    // modal.componentInstance.reservaModalService = this;
    // modal.componentInstance.formulario = this.formulario;
    // modal.componentInstance.rowId = this.formulario.get('id').value;
    // modal.componentInstance.formArrayName = 'recursos_reservados_attributes';
    return modal.result;

  }

  abrirModalVacinado():Promise<any>{
    // this.construirFormulario();
    Helpers.setLoading(true);
    let ngbModalOptions: NgbModalOptions={
      // backdrop: 'static',
      // keyboard: false,
    }
    let modal = this.modalNgb.open(VacinadoFormComponent, ngbModalOptions);
    modal.result.then(r=>{
      switch (r) {
        case 'pessoa':
            // this.abrirModalPessoaPegarEquipamento();
          break;

        default:
          break;
      } 
    })
    // modal.componentInstance.reservaModalService = this;
    // modal.componentInstance.formulario = this.formulario;
    // modal.componentInstance.rowId = this.formulario.get('id').value;
    // modal.componentInstance.formArrayName = 'recursos_reservados_attributes';
    return modal.result;

  }

  abrirModalBurnout():Promise<any>{
    // this.construirFormulario();
    Helpers.setLoading(true);
    let ngbModalOptions: NgbModalOptions={
      // backdrop: 'static',
      // keyboard: false,
    }
    let modal = this.modalNgb.open(BurnoutFormComponent, ngbModalOptions);
    // modal.result.then(r=>{
    //   switch (r) {
    //     case 'pessoa':
    //         // this.abrirModalPessoaPegarEquipamento();
    //       break;

    //     default:
    //       break;
    //   } 
    // })
    // modal.componentInstance.reservaModalService = this;
    // modal.componentInstance.formulario = this.formulario;
    // modal.componentInstance.rowId = this.formulario.get('id').value;
    // modal.componentInstance.formArrayName = 'recursos_reservados_attributes';
    return modal.result;
  }

  abrirCustomModal(response):Promise<any>{
    Helpers.setLoading(true);
    let ngbModalOptions: NgbModalOptions={
      // backdrop: 'static',
      // keyboard: false,
    }
    let modal = this.modalNgb.open(CheckupFormComponent, ngbModalOptions);
    modal.componentInstance.receberParametros(response);
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
    // modal.componentInstance.reservaModalService = this;
    // modal.componentInstance.formulario = this.formulario;
    // modal.componentInstance.rowId = this.formulario.get('id').value;
    // modal.componentInstance.formArrayName = 'recursos_reservados_attributes';
    return modal.result;
  }

}