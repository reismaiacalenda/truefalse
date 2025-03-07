import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Helpers } from '../../../../../helpers';

@Component({
  selector: ".m-grid__item.m-grid__item--fluid.m-wrapper",
  templateUrl: "./instituicao.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class InstituicaoComponent implements OnInit {

  constructor() {
  }

  ngOnInit() {
    //alterçaão ficticia para dfemonstrar gitflow.
    //algum codigo legal de instituicao
  }

}
