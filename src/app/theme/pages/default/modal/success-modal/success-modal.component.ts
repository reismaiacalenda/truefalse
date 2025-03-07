import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'success-modal',
  templateUrl: 'success-modal.html'
})
export class SuccessModalComponent implements OnInit {
  @Input() titulo: string = "Dados processados com sucesso!";
  @Input() corpo: string = "";

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

}
