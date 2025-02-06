import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'error-modal',
  templateUrl: 'error-modal.html'
})
export class ErrorModalComponent implements OnInit {
  @Input() message: string;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

}
