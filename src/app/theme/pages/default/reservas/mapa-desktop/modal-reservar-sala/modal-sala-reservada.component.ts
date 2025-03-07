// import { Validators, FormGroup } from '@angular/forms';
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, AfterViewChecked, OnDestroy, Renderer2, Output, EventEmitter, Input } from '@angular/core';
// import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal, NgbModalOptions, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { Subscription } from 'rxjs';
import { WebService } from '../../../../../../_services/web.service';
import { Helpers } from '../../../../../../helpers';
import { ReservaModalService } from '../../reserva-modal/reserva-modal.service';
import { ModalService } from '../../../modal/modal.service';
import { consoleLog } from '../../../../../../globals';
import { ModalContinuacaoReservaComponent } from '../modal-continuacao-reserva/modal-continuacao-reserva.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

declare function montarTreeLocalizacoes(data: any);

@Component({
  selector: 'modal-sala-reservada',
  templateUrl: 'modal-sala-reservada.component.html'
})
export class ModalSalaReservadaComponent implements OnInit, AfterViewInit, OnDestroy {
  private subscriptions: Subscription = new Subscription();
  // @ViewChild('modalSala', {static: false}) public rodape: ElementRef;
  @Input() espacoSelecionado;
  @Input() date;
  @Input() textData = "";
  @Input() hora = "";
  @Output() reservaRealizada = new EventEmitter<any>();
  @Output() modalFechada = new EventEmitter<any>();
  loading: boolean = false;
  rodapeAberto: boolean = false;
  responseNew;
  // modalNgb: any;
  // activeModal: any;
  
  constructor(public renderer:Renderer2,
    public reservaModalService: ReservaModalService,
    public webService: WebService,
    public modalService: ModalService,
    public activeModal: NgbActiveModal){}

  ngOnInit(){
  }

  ngAfterViewInit(){
  }

  onSubmit() {
  }

  formulario(formulario: any) {
    throw new Error('Method not implemented.');
  }

  compartilhar(){

    https://web.whatsapp.com/send?text=https%3A%2F%2Fngx-sharebuttons.stackblitz.io%2F%23%2Flazy-test

    var texto = "Ei! Acabei de fazer uma reserva na Calenda para ir ao escritório. O que acha de ir trabalhar comigo?\n\n🕑 "
     + this.textData + " - " + this.espacoSelecionado.atual
     + "\n\n📍 " + this.espacoSelecionado.nome
     + "\n\nDá uma olhada na nossa plataforma como está sua agenda? Segue o link: " + window.location.origin;


    var url = "https://web.whatsapp.com/send?text=" + encodeURIComponent(texto);
    window.open(url, '_blank')

    // console.log('canvasElement');
    // const canvasElement = document.getElementById('planta');
    // console.log(canvasElement);

    // console.log('dataUrl');
    // const dataUrl = (<any>canvasElement).toDataURL();
    // console.log(dataUrl);

    // console.log('blob');
    // // const blob = dataUrl.blob();
    // fetch(dataUrl)
    // .then(res => res.blob())
    // .then(blob => {
    //   console.log(blob)
    //   const filesArray = [
    //     new File(
    //       [blob],
    //       'Reserva Calenda no mapa interativo.png',
    //       {
    //         type: blob.type,
    //         lastModified: new Date().getTime()
    //       }
    //     )
    //   ];
    //   // const item = new ClipboardItem({ "image/png": blob });
    //   // const text = new ClipboardItem({ "text": 'ooi' });
    //   // navigator.clipboard.write([item, text]);

    //   alert('ooopa')
    //   }
    // )
  


    // const img = new Image;
    // const c = document.createElement("canvas");
    // const ctx = c.getContext("2d");
    // img.crossOrigin = "";
    // img.src = imageURL;
    // return new Promise(resolve => {
    //   img.onload = function () {
    //     c.width = this.naturalWidth;
    //     c.height = this.naturalHeight;
    //     ctx.drawImage(this, 0, 0);
    //     c.toBlob((blob) => {
    //       // here the image is a blob
    //       resolve(blob)
    //     }, "image/png", 0.75);
    //   };
    // })

    // const blob = await imageToBlob(imageURL)


    // https://web.whatsapp.com/send?text=https%3A%2F%2Fngx-sharebuttons.stackblitz.io%2F%23%2F
  }

  // fecharModal(){
  //   this.activeModal.close();
  // }
  
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe()
  }
}