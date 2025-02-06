import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit } from '@angular/core';
import { Helpers } from '../../../../../../helpers';
import { consoleLog } from '../../../../../../globals';

@Component({
  selector: 'camera-modal',
  templateUrl: 'camera-modal.html'
})
export class CameraModalComponent implements OnInit {
  public videoDevices;
  public oldDevice;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

  setarRadioUnidadeModal(device){
    Helpers.setLoading(true);
    consoleLog("escolheu no radio o device:");
    consoleLog(device);
    consoleLog("fechando modal...");
    this.activeModal.close(device);
	}
}
