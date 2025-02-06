// import { Validators, FormGroup } from '@angular/forms';
import { Component, Input, OnInit, ViewChild, ElementRef, AfterViewInit, AfterViewChecked } from '@angular/core';
import { FormArray, FormControl } from '@angular/forms';
// import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { WebService } from '../../../../../_services/web.service';
import { Helpers } from '../../../../../helpers';
import { ModalService } from '../../modal/modal.service';
import { ReservaModalService } from '../../reservas/reserva-modal/reserva-modal.service';

@Component({
  selector: 'checkups',
  templateUrl: 'checkups.component.html'
})
export class CheckupsComponent implements OnInit, AfterViewInit {
  questionarios:any[] = [];

  constructor(public activeModal: NgbActiveModal,
    public webService: WebService,
		public modalService: ModalService){}

  ngOnInit(){
    this.recuperarQuestionarios()
  }
  
  ngAfterViewInit(){
    Helpers.setLoading(false);
  }
  
  onSubmit() {
    // consoleLog(this.formulario);
    // this.activeModal.close(this.formulario);
  }

  recuperarQuestionarios(){
    Helpers.setLoading(true);
		this.webService.get(`questionarios/checkups.json`)
		.subscribe(
			response =>{
				Helpers.setLoading(false);
        this.questionarios = response.questionarios;
				//this.modalService.tratarSucesso(response)
			},
			(error) => {
				Helpers.setLoading(false);
				this.modalService.tratarError(error);
			}
		)
  }

}