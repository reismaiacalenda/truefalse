import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { consoleLog } from '../../../../../globals';

@Component({
  selector: 'rqrcode-modal',
  templateUrl:'qrcode-modal.html'
})
export class QrCodeModalComponent implements OnInit {

  @Input() qrCode: any;
  @Input() titulo: string;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(){
    consoleLog("@Input() qrCode: any;");
    consoleLog(this.qrCode);
    consoleLog("@Input() titulo: any;");
    consoleLog(this.titulo);
  }

}