import { Component, OnInit, ViewEncapsulation, AfterViewInit, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { Helpers } from '../../../helpers';
import { User } from '../../../auth/_models';
import { globals, consoleLog } from '../../../globals';
import { WorkspaceService } from '../../../_services/workspace.service';
import { ReservaModalService } from '../../pages/default/reservas/reserva-modal/reserva-modal.service';

declare let mLayout: any;
@Component({
  selector: "app-aside-nav",
  templateUrl: "./aside-nav.component.html",
  encapsulation: ViewEncapsulation.None
})
export class AsideNavComponent implements OnInit, AfterViewInit, AfterViewChecked {
  private currentUser = this.workspaceService.currentUser;
  debugGlobal = globals.debug;
  flagAside:boolean = false;

  constructor(private workspaceService: WorkspaceService,
    public reservaModalService: ReservaModalService,
    private cdRef : ChangeDetectorRef) { 
    consoleLog("construtor aside-nav.component")
    consoleLog("construtor:")
    consoleLog(globals.asideOpen)
  }

  ngOnInit() {
    consoleLog("ngonit aside")
    consoleLog("ngonit aside")
    consoleLog(globals.asideOpen)
  }

  ngAfterViewInit() {
    consoleLog("afterviewinit aside")
    if ($('#m_aside_left').length > 0 && this.flagAside == false && globals.flagAside == true){
      mLayout.initAside();
      let menu = (<any>$('#m_aside_left')).mMenu();
      let item = $(menu).find('a[href="' + window.location.pathname + '"]').parent('.m-menu__item');
      (<any>$(menu).data('menu')).setActiveItem(item);
      this.flagAside = true;
    }
    consoleLog("ngafterviewinitt aside")
    consoleLog(globals.asideOpen)
  }

  ngAfterViewChecked(): void {
    // consoleLog("ngafterviechecjed aside")
    // consoleLog(globals.asideOpen)
    // this.cdRef.detectChanges();
  }

  printable(){
		if (globals == undefined && globals.printable == undefined){
			return false;
		}else{
			return !globals.printable;
		}
  }

  isAsideOpen(){
    return !$('body').hasClass('m-aside-left--minimize');
    // return !!globals.asideOpen;
  }

  predefinidos(){
    this.reservaModalService.predefinidos()
  }

  parametrizacoes(){
    this.reservaModalService.parametrizacoes()
  }

  isMobile(){
    return Helpers.isMobile();
  }
  
}
