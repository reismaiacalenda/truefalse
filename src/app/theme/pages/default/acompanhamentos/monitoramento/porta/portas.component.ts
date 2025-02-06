import { Component, OnInit, ViewEncapsulation, Inject, OnDestroy, EventEmitter, ElementRef } from '@angular/core';
import { Helpers } from '../../../../../../helpers';
import { DomainService } from '../../../../../../_services/domain.service';
import { ModalService } from '../../../modal/modal.service';
import { DOCUMENT } from "@angular/common";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NgbModalOptions, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PortasFormComponent } from './portas-form/portas-form.component';
import { WebService } from '../../../../../../_services/web.service';
import { consoleLog } from '../../../../../../globals';
import { WorkspaceService } from '../../../../../../_services/workspace.service';

// declare function bindPortas(): any;
// declare function closePortas(): any;

@Component({
  selector: ".m-grid__item.m-grid__item--fluid.m-wrapper",
  templateUrl: "./portas.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class PortasComponent implements OnInit, OnDestroy {
  displays: any[];
  apiUrl: string;

  constructor(private modalNgb: NgbModal,
    private http: HttpClient,
    private webService:WebService,
    private domainService: DomainService,
    private modalService: ModalService,
    public workspaceService: WorkspaceService,
    @Inject(DOCUMENT) private document: any
  ) {
    // this.apiUrl = `${this.domainService.getApiUrl()}/displays`;
  }

  openFormModal(rowId?: string) {
    let ngbModalOptions: NgbModalOptions={
          backdrop: 'static',
          keyboard: false
      }
    const modalRef = this.modalNgb.open(PortasFormComponent, ngbModalOptions);
    modalRef.componentInstance.rowId = rowId;
    modalRef.result.then((responseSuccess) => {
      consoleLog("Como está vindo o console success")
      consoleLog(responseSuccess)
      if (responseSuccess) {
        this.carregarPortas();
        consoleLog("Passou pela chamada do carregarPortas")
      }
    })
  }

  ngOnInit() {
    this.carregarPortas();
    // bindPortas();
  }

  carregarPortas() {
    Helpers.setLoading(true);
    consoleLog("Entrou no carregarPortas")
    this.webService.get(`displays/cards_porta`)
       .subscribe(
         dados => {this.displays = (<any>dados).displays
          consoleLog("Como está vindo o dados portas")
          consoleLog(dados)
         },
         (error: any) => this.modalService.tratarError(error)
       )
       .add(() => Helpers.setLoading(false))
  }

  ngOnDestroy() {
    // closePortas();
  }

  alteracaoCollapse(event){
    Helpers.setLoading(true);
    var elementI = event.target.querySelector('i');
    var elementFoco = event.target;
    if (elementI != null){
      if (elementI.classList.contains('la-angle-down')){
          elementI.classList.remove('la-angle-down');
          elementI.classList.add('la-angle-right');
      } else{
          elementI.classList.remove('la-angle-right');
          elementI.classList.add('la-angle-down');
      }
    } else{
      if (elementFoco.classList.contains('la-angle-down')){
        elementFoco.classList.remove('la-angle-down');
        elementFoco.classList.add('la-angle-right');
      } else{
        elementFoco.classList.remove('la-angle-right');
        elementFoco.classList.add('la-angle-down');
      }
    }
    Helpers.setLoading(false);
  }

}