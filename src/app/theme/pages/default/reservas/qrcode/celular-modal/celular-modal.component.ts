import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit } from '@angular/core';
import { Helpers } from '../../../../../../helpers';

@Component({
  selector: 'celular-modal',
  templateUrl: 'celular-modal.html'
})
export class CelularModalComponent implements OnInit {
  public OS;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

  setarRadio(mobile){
    Helpers.setLoading(true);
    this.activeModal.close(mobile);
	}
}
