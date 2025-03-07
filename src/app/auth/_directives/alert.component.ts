import { Component, OnInit } from "@angular/core";
import { AlertService } from "../_services/index";

@Component({
  templateUrl: "./alert.component.html",
  selector: 'app-alert'
})

export class AlertComponent implements OnInit {
  message: any;

  constructor(private _alertService: AlertService) {
  }

  ngOnInit() {
    this._alertService.getMessage().subscribe(message => {
      this.message = message;
    });
  }
}
