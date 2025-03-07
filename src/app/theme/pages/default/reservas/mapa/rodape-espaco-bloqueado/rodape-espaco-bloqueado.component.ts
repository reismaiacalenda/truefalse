// import { Validators, FormGroup } from '@angular/forms';
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, AfterViewChecked, OnDestroy, Renderer2, Output, EventEmitter, Input } from '@angular/core';
// import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { WebService } from '../../../../../../_services/web.service';
import { Helpers } from '../../../../../../helpers';
import { ModalService } from '../../../modal/modal.service';
import { consoleLog } from '../../../../../../globals';
import { NgbModal, NgbModalOptions, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'rodape-espaco-bloqueado',
  templateUrl: 'rodape-espaco-bloqueado.component.html'
})
export class RodapeEspacoBloqueadoComponent implements OnInit, AfterViewInit, OnDestroy {
  private subscriptions: Subscription = new Subscription();
  @ViewChild('rodapeEspacoBloqueado', {static: false}) public rodape: ElementRef;
  @Input() espacoSelecionado;
  @Output() modalFechada = new EventEmitter<any>();
  loading: boolean = false;
  rodapeAberto: boolean = false;

  constructor(public modalNgb: NgbModal,
    public renderer:Renderer2,
    public webService: WebService,
    public modalService: ModalService){}

  ngOnInit(){
  }

  ngAfterViewInit(){
  }

  onSubmit() {
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe()
  }

  abrirRodape(){
    console.log("to caindo aqui também");
    Helpers.setLoading(true);
    consoleLog("como estão as propriedes")
    if (this.rodapeAberto == true){
      Helpers.setLoading(false);
      return;
    };
    this.rodapeAberto = true;
    this.renderer.removeClass(this.rodape.nativeElement, 'slideOutDown');
    this.renderer.addClass(this.rodape.nativeElement, 'slideInUp');
    this.renderer.removeClass(this.rodape.nativeElement, 'd-none'); 
    setTimeout(()=>{
      Helpers.setLoading(false);
    },751);
  }

  fecharRodape(){
    console.log("to caindo aqui pelo menos");
    if (this.rodapeAberto == false){return};
    this.rodapeAberto = false;
    this.renderer.removeClass(this.rodape.nativeElement, 'slideInUp');
    this.renderer.addClass(this.rodape.nativeElement, 'slideOutDown');
    setTimeout(()=>{
      this.renderer.addClass(this.rodape.nativeElement, 'd-none'); 
      this.modalFechada.emit(true);
    },751)
  }
}