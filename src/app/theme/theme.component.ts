import { User } from './../auth/_models/user';
import { AfterViewInit, Component, Injector, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, RouterOutlet } from '@angular/router';
import { Helpers } from '../helpers';
import { ScriptLoaderService } from '../_services/script-loader.service';
import { WebsocketService } from '../_services/websocket.service';
import { environment } from '../..//environments/environment';
import { WorkspaceService } from '../_services/workspace.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { consoleLog, globals } from '../globals';
import { ModalService } from './pages/default/modal/modal.service';
import { version } from '../../../package.json';
import { FooterComponent } from './layouts/footer/footer.component';
import { HeaderNavComponent } from './layouts/header-nav/header-nav.component';

declare function construirChatOculto(currentUser: User, versao: string): any;
declare function construirChatExposto(currentUser: User, versao: string): any;
declare function esconderChat(): any;

declare function initLeftAsideToggle():any;
declare let mApp: any;
declare let mLayout: any;

@Component({
  selector: ".m-grid.m-grid--hor.m-grid--root.m-page",
  templateUrl: "./theme.component.html",
  encapsulation: ViewEncapsulation.None,
  imports: [RouterOutlet, HeaderNavComponent, FooterComponent]
})
export class ThemeComponent implements OnInit, AfterViewInit {
  currentUser: User;
	isMobile: boolean = Helpers.isMobile();
  _version = version;

  constructor(private _script: ScriptLoaderService,
    private _router: Router,
    public workspaceService: WorkspaceService,
    private injector: Injector,
    private ws: WebsocketService) {
      consoleLog("theme component")
      this.currentUser = this.workspaceService.currentUser;
      this.tratarRedirecionamentos();
    consoleLog("construtor theme")

  }

  ngOnInit() {
    consoleLog("ngoinit theme")

    this._script.load('body',
    'assets/vendors/base/vendors.bundle.min.js',
    'assets/vendors/base/vendors2.bundle.min.js',
    'assets/demo/default/base/scripts.bundle.min.js',
    'assets/app/js/tawk.js',
    'assets/app/js/picker.js')
    .then(result => {
      consoleLog("estamos no load do script")

      // se porventura alguns scripts falharem em alguns casos de ordem de paralelismo indevido,
      // verifica-se antes se o elemento #m_aside_left já foi construído.
      // caso não tenho sido construído, significa q a thread prioritária é a do aside.nav.component.
      // e nela será inicialido o m.layout

      if ($('#m_aside_left').length > 0){
        consoleLog("init them component")
        mLayout.initAside();
        let menu = (<any>$('#m_aside_left')).mMenu();
        let item = $(menu).find('a[href="' + window.location.pathname + '"]').parent('.m-menu__item');
        (<any>$(menu).data('menu')).setActiveItem(item);
        globals.flagAside = true;
      }

      if(this.workspaceService.autorizar('suporte_live_chat')){
        if (this.isMobile){
          construirChatOculto(this.currentUser, this._version);
        }else{
          construirChatExposto(this.currentUser, this._version);
        }
      }
      Helpers.setLoading(false);
    });

    this._router.events.subscribe((route) => {
      if (route instanceof NavigationStart) {
        (<any>mApp).scrollTop();
        consoleLog("navigation start them.eocmponent")
        consoleLog(globals.asideOpen);

        if (!Helpers.isMobile() && globals.asideOpen == true && document.getElementById('m_aside_left_minimize_toggle') != undefined && $('#m_aside_left').length > 0){
          document.getElementById('m_aside_left_minimize_toggle').click();
        }
        Helpers.setLoading(true);
      }
      if (route instanceof NavigationEnd) {
        Helpers.setLoading(false);
        consoleLog("tchau")
        // content m-wrapper animation
        let animation = 'm-animate-fade-in-up';
        $('.m-wrapper').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(e) {
          $('.m-wrapper').removeClass(animation);
        }).removeClass(animation).addClass(animation);
      }
    });
    
    consoleLog("estamos no fim ngonit");
    // Helpers.setLoading(false);

    this.workspaceService.inicializarCoresWhitelabel();
    
    // document.documentElement.style.setProperty('--primary-hover', 'red');
  }

  ngAfterViewInit(){
    consoleLog("viewinit theme")
    if(this.workspaceService.workspace.plano == "pro_lite" && this.workspaceService.workspace.ativo == true){return;}
    if (this.workspaceService.workspace.trial == false &&
      this.workspaceService.workspace.ativo == false &&
      this.workspaceService.workspace.experimentado == true){

      const modalService = this.injector.get(ModalService)
      modalService.abrirTrialExpirado().then((result: any)=>{
        
      })

    }
  }

  tratarRedirecionamentos(){
    consoleLog("construiu theme.component.ts");
    consoleLog("recebendo o qrcode... no theme.componenet.ts");
    var qr = localStorage.getItem('qrcode');
    var redirectFallback = localStorage.getItem('redirectFallback') || "/";
    var qrEspacoId = localStorage.getItem('qrEspacoId') || "/";
    var qrRecursoId = localStorage.getItem('qrRecursoId') || "/";
    var qrUnidadeId = localStorage.getItem('qrUnidadeId') || "/";
    consoleLog("Oi to aqui no theme. olha o espaco:")
    consoleLog(qrEspacoId);
    consoleLog(qr);
    consoleLog("RedirectFallback no theme.nEw()");
    consoleLog(redirectFallback);
    
    if (qr != null && qr != undefined && qr != '/'){
      consoleLog("navegando pro qrcalenda...");
      this._router.navigate(['/workspace/qrcalenda'], { queryParams: { q: qr} });
    }else if(qrEspacoId != '/'){
      localStorage.removeItem('qrEspacoId');
      this._router.navigate(['/reservas/quadros/espacos'], { queryParams: { e: qrEspacoId} });
    }else if(qrRecursoId != '/'){
      localStorage.removeItem('qrRecursoId');
      this._router.navigate(['/reservas/recursos-alocados'], { queryParams: { recurso_ids: qrRecursoId} });
      // if (qrRecursoId != '/'){
      //   // this.reservaModalService.fabricarAssessorista()
      //   //TODO. se o recurso for serializavel, chama a modal de check. se não for, datatable RecursoAlocaoda
      // }
    }else if(qrUnidadeId != '/'){
      localStorage.removeItem('qrUnidadeId');
      // this._router.navigate(['/reservas/quadros/espacos'], { queryParams: { e: qrUnidadeId} });
      this._router.navigate(['/index'], { queryParams: { u: qrUnidadeId} });
    }else if(!environment.production){
      return;
    }else if (redirectFallback != "/" && redirectFallback != "/login"){
      localStorage.setItem('redirectFallback', "/");
      consoleLog("vai navegar pra ele:");
      this._router.navigate([redirectFallback]);
    }else{
      this._router.navigate(['/index']);
    }

  }
}