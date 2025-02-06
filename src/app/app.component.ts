import { Meta } from '@angular/platform-browser';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, Scroll, RouterOutlet } from '@angular/router';
import { Helpers } from "./helpers";
import { environment } from '../environments/environment';
import { consoleLog } from './globals';
import { LoadingService } from './_services/loading.service';
import { LoadingSpinComponent } from "./theme/layouts/loading-spin/loading-spin.component";
import { QuickSidebarComponent } from './theme/layouts/quick-sidebar/quick-sidebar.component';
import { ScrollTopComponent } from './theme/layouts/scroll-top/scroll-top.component';
@Component({
  selector: 'body',
  templateUrl: "./app.component.html",
  encapsulation: ViewEncapsulation.None,
  imports: [RouterOutlet, LoadingSpinComponent, QuickSidebarComponent, ScrollTopComponent],
})
export class AppComponent implements OnInit {
  title = 'app';
  globalBodyClass = 'm-page--loading-non-block m-page--fluid m--skin- m-content--skin-light2 m-header--fixed m-header--fixed-mobile m-aside-left--enabled m-aside-left--skin-light m-aside-left--offcanvas m-footer--push m-aside--offcanvas-default m-brand--minimize m-aside-left--minimize';
  // 'header-fixed header-mobile-fixed subheader-enabled subheader-fixed aside-enabled aside-fixed aside-minimize-hoverable page-loading clickup-chrome-ext_installed aside-minimize'
  // 'm-page--fluid m--skin- m-content--skin-light2 m-header--fixed m-header--fixed-mobile m-aside-left--enabled m-aside-left--skin-light m-aside-left--offcanvas m-footer--push m-aside--offcanvas-default clickup-chrome-ext_installed'
  

  constructor(private _router: Router,
      private metaService: Meta) {
        consoleLog("app.component.ts.constructor");
  }

  ngOnInit() {
    consoleLog("app.component.ts.constructor");
    this._router.events.subscribe((route) => {
      if (route instanceof NavigationStart) {
        Helpers.setLoading(true);
        Helpers.bodyClass(this.globalBodyClass);
      }
      if (route instanceof NavigationEnd) {
        Helpers.setLoading(false);
      }
    });
    this.setarSeguranca()
  }

  setarSeguranca(){
    if (environment.production){
      var tag = { "http-equiv" : 'Content-Security-Policy', "content": "upgrade-insecure-requests"};
      this.metaService.addTag(tag, false);
    }
  }
}
