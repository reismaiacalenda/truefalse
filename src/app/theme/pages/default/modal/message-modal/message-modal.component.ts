import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'message-modal',
  templateUrl: 'message-modal.html'
})
export class MessageModalComponent implements OnInit {
  @Input() titulo: string;
  @Input() corpo: string;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

}
