import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { LoadingService } from '../../../_services/loading.service';
import { Helpers } from '../../../helpers';


@Component({
  selector: "loading-spin",
  templateUrl: "./loading-spin.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class LoadingSpinComponent implements OnInit {


  constructor(public loadingService: LoadingService) {

  }
  ngOnInit() {

  }

}
