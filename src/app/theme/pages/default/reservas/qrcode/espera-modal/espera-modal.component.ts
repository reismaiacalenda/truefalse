import { Component, OnInit} from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ModalService } from '../../../modal/modal.service';
import { DomainService } from '../../../../../../_services/domain.service';
import { ScriptLoaderService } from '../../../../../../_services/script-loader.service';

@Component({
  templateUrl: "espera-modal.html",
  selector: 'espera-modal'
})
export class EsperaModalComponent implements OnInit {
  constructor(public activeModal: NgbActiveModal) {
  }
  
  ngOnInit() {
    
  }
}