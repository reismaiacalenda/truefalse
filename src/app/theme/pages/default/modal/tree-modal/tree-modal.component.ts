import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'tree-modal',
  templateUrl: 'tree-modal.html'
})
export class TreeModalComponent implements OnInit {
  @Input() titulo: string;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

}
