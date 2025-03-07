// import { Validators, FormGroup } from '@angular/forms';
import { Component, Input, OnInit, ViewChild, ElementRef, AfterViewInit, AfterViewChecked } from '@angular/core';
import { TfFormBaseComponent } from '../../../../../../../_andaime/tf-forms/tf-form-base.component';
import { FormArray, FormControl } from '@angular/forms';
import { ReservaModalService } from '../../reserva-modal.service';
// import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Helpers } from '../../../../../../../helpers';
import { consoleLog } from '../../../../../../../globals';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'trabalhar-escritorio',
  templateUrl: 'trabalhar-escritorio.component.html'
})
export class TrabalharEscritorioComponent implements OnInit, AfterViewInit {

  reservaModalService:ReservaModalService;

  constructor(public activeModal: NgbActiveModal){}

  ngOnInit(){
  }
  
  ngAfterViewInit(){
    Helpers.setLoading(false);
  }
  
  onSubmit() {
    // consoleLog(this.formulario);
    // this.activeModal.close(this.formulario);
  }

  

}