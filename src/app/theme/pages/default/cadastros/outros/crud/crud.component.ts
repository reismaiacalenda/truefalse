import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Helpers } from '../../../../../../helpers';

@Component({
  selector: ".m-grid__item.m-grid__item--fluid.m-wrapper",
  templateUrl: "./crud.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class CrudComponent implements OnInit {

  constructor() {
  }

  ngOnInit() {
    // Alterçaão fictícia para demonstrar gitflow.
  }

}
