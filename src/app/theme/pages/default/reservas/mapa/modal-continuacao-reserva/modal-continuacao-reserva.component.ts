// import { Validators, FormGroup } from '@angular/forms';
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, AfterViewChecked, OnDestroy, Renderer2, Output, EventEmitter, Input } from '@angular/core';
// import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { WebService } from '../../../../../../_services/web.service';
import { Helpers } from '../../../../../../helpers';
import { ReservaModalService } from '../../reserva-modal/reserva-modal.service';
import { ModalService } from '../../../modal/modal.service';
import { consoleLog } from '../../../../../../globals';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { isThisTypeNode } from 'typescript';

declare function montarTreeLocalizacoes(data: any);
declare function abrirChat(): any;

@Component({
  selector: 'modal-continuacao-reserva',
  templateUrl: 'modal-continuacao-reserva.component.html'
})
export class ModalContinuacaoReservaComponent implements OnInit, AfterViewInit, OnDestroy {
  private subscriptions: Subscription = new Subscription();
  @ViewChild('rodape', {static: false}) public rodape: ElementRef;
  @Input() espacoSelecionado;
  @Input() date;
  @Input() textData = "";
  @Input() hora = "";
  @Output() reservaRealizada = new EventEmitter<any>();
  @Output() modalFechada = new EventEmitter<any>();
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
    public router:Router){}

  ngOnInit(){
  }

  ngAfterViewInit(){
  }

  onAbrirChat(){
		abrirChat()
	}

  onSubmit() {
  }
  
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe()
  }
}