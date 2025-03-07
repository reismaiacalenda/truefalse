import { Component, OnInit,  AfterViewInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { WebService } from '../../../../../../_services/web.service';
import { Helpers } from '../../../../../../helpers';


@Component({
  selector: 'modal-selecionar-data',
  templateUrl: 'modal-selecionar-data.component.html'
})
export class ModalSelecionarDataComponent implements OnInit, AfterViewInit {
  public selectedDay;
  public today;

  constructor(public activeModal: NgbActiveModal,
    public webService: WebService){}

  ngOnInit(){
  }
  
  ngAfterViewInit(){
    Helpers.setLoading(false);
  }

  aplicarData(){
    Helpers.setLoading(true);
    this.activeModal.close({
      date: this.selectedDay,
      today: this.selectedDay == this.today
    });
  }
  
  aplicarHoje() {
    console.log('como tá o today?');
    console.log(this.today)
    this.selectedDay = this.today;
    this.aplicarData();
  }
}