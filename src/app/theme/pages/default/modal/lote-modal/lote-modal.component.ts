import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit, Input } from '@angular/core';
import { Helpers } from '../../../../../helpers';

@Component({
  selector: 'lote-modal',
  templateUrl: 'lote-modal.html'
})
export class LoteModalComponent implements OnInit {
  @Input() titulo: string = "Exclusão em lote";
  @Input() primeiraOpcao: string = "Apenas este";
  @Input() segundaOpcao: string = "Todos do lote";
  apenas:boolean = true;
  lote:boolean = false;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
    Helpers.setLoading(false);
  }

  setarRadio(radio){
    if (radio=='lote'){
      this.lote = true;
      this.apenas = false;
    }else{
      this.lote = false;
      this.apenas = true;
    }
  }

  confirmarModal(){
    var radio;
    if (this.lote==true){
      radio = 'lote'
    }else{
      radio = 'apenas'
    }
    this.activeModal.close(radio);

  }

}
