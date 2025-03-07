import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'service-modal',
  templateUrl: 'service-modal.html'
})
export class ServiceModalComponent implements OnInit {
  @Input() titulo: string;
  @Input() metodo: string;
  @Input() service: string;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

}
