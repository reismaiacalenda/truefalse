import { AfterViewChecked, Component, DoCheck, OnInit, ViewEncapsulation } from '@angular/core';
import { LoadingService } from '../../../../../../_services/loading.service';
import { Helpers } from '../../../../../../helpers';

@Component({
  selector: ".m-grid__item.m-grid__item--fluid.m-wrapper",
  templateUrl: "./tipo.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class TipoComponent implements OnInit {

  constructor(private loadingService: LoadingService) {
    this.loadingService.addRequest();
  }

  ngOnInit() {
    this.loadingService.removeRequest();
  }

}
