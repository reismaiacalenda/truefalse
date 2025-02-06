// import { Validators, FormGroup } from '@angular/forms';
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, AfterViewChecked, OnDestroy, Renderer2, Output, EventEmitter, Input } from '@angular/core';
// import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { WebService } from '../../../../../../_services/web.service';
import { ReservaModalService } from '../../reserva-modal/reserva-modal.service';
import { ModalService } from '../../../modal/modal.service';
import { consoleLog } from '../../../../../../globals';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { WorkspaceService } from '../../../../../../_services/workspace.service';
// declare function montarTreeLocalizacoes(data: any);

@Component({
  selector: 'modal-termo',
  templateUrl: 'modal-termo.component.html'
})
export class ModalTermoComponent implements OnInit, AfterViewInit, OnDestroy {
  private subscriptions: Subscription = new Subscription();
  loading: boolean = false;
  rodapeAberto: boolean = false;
  responseNew;
  // activeModal: any;
  // router: any;

  constructor(public renderer:Renderer2,
    public reservaModalService: ReservaModalService,
    public webService: WebService,
    public modalService: ModalService,
    public activeModal: NgbActiveModal,
    public workspaceService: WorkspaceService,
    public router:Router){}

  ngOnInit(){
  }
  
  ngAfterViewInit(){
    console.log("to aqui")
  }

  onSubmit() {
  }
  
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe()
  }
}