import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit, Input } from '@angular/core';
import { Helpers } from '../../../../../helpers';

@Component({
  selector: 'confirmacao-modal',
  templateUrl: 'confirmacao-modal.html'
})
export class ConfirmacaoModalComponent implements OnInit {
  @Input() titulo: string = "Deseja realmente processar isso?";
  @Input() corpo: string = "";

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
    Helpers.setLoading(false);
  }

}
