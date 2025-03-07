// import { Validators, FormGroup } from '@angular/forms';
import { Component, OnInit, AfterViewInit} from '@angular/core';
import { ReservaModalService } from '../../reserva-modal.service';
import { Helpers } from '../../../../../../../helpers';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

@Component({
  selector: 'selecionar-mapa-quadros',
  templateUrl: 'selecionar-mapa-quadros.component.html'
})
export class SelecionarMapaQuadrosComponent implements OnInit, AfterViewInit {

  reservaModalService:ReservaModalService;
  
  constructor(public activeModal: NgbActiveModal,
    private _router: Router){}

  ngOnInit(){
  }
  
  ngAfterViewInit(){
    Helpers.setLoading(false);
  }
  
  onSubmit() {
  }

  escolherMapaQuadros(tela){
    if (tela == 'quadros'){
      this._router.navigate(['reservas/quadros/espacos'])
    }else{
      if (Helpers.isMobile()){
        this._router.navigate(['reservas/mapa'], { queryParams: {categoria: 'sala'} })
      }else{
        this._router.navigate(['reservas/mapa-desktop'], { queryParams: {categoria: 'sala'} })
      }
    }
    this.activeModal.close(true)
  }
}