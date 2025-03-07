import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { globals } from '../../../globals';
import { Helpers } from '../../../helpers';
import { version } from '../../../../../package.json';

@Component({
  selector: "app-footer",
  templateUrl: "./footer.component.html",
  encapsulation: ViewEncapsulation.None
})
export class FooterComponent implements OnInit {
  isMobile:boolean = Helpers.isMobile();
  ano = new Date().getFullYear();
	_version = version;

  constructor() {

  }
  ngOnInit() {

  }

  printable(){
    if (globals == undefined || globals.printable == undefined){
			return false;
		}else{
			return !globals.printable;
		}
	}

}
