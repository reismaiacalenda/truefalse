import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { WorkspaceService } from '../../../../../_services/workspace.service';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { DomainService } from '../../../../../_services/domain.service';
import { Helpers } from '../../../../../helpers';
import { ModalService } from '../modal.service';

@Component({
  selector: 'trocar-unidade-modal',
  templateUrl: 'trocar-unidade-modal.html'
})
export class TrocarUnidadeModalComponent implements OnInit {
  public unidade: any;
  public unidades = this.workspaceService.unidades;
  public unidadeSelecionada = this.workspaceService.unidadeSelecionada;
  public currentUser = this.workspaceService.currentUser;

  constructor(public activeModal: NgbActiveModal,
    public workspaceService: WorkspaceService,
    public http: HttpClient,
    public ds: DomainService,
    public modalService: ModalService) { }

  ngOnInit() {
  }

	desabilitarRadio(id){
		// consoleLog("desabilita rradio::");
		// consoleLog(this.currentUser);
		return this.currentUser.unidades.find(u=>u.id==id) == undefined;
		//this.currentUser.unidades.indexOf(id)==-1;
  }
  
  setarRadio(u) {
		var header = new HttpHeaders();
		header.append('Content-Type', 'application/json');
		let funcionario = {
			unidade_id: u.id
		};
		var body = (funcionario);
		this.putForm(header, body);
  }
  
  putForm(header, body) {
		// consoleLog(body);
    this.http.put(`${this.ds.getApiUrl()}/funcionarios/${this.currentUser.id}/selecionar_unidade.json`,
      body, { headers: header, observe: 'response'})
      .subscribe(
      (response) => {
				Helpers.setLoading(false);
				// window.location.assign('/');
				// consoleLog("caiu aqui dsigraça");
				this.unidade = this.currentUser.unidades.find(e=>e.id==body.unidade_id)

				// this.unidade = u.id;
				// consoleLog(this.unidade);
				// consoleLog(this.unidade);
				this.unidadeSelecionada = this.unidade;
        // this.closeModal.nativeElement.click();
				// this.modalService.tratarSucesso(response);
				// this.renavegar();
				location.reload(true);
      },
      (error: any) => {
        Helpers.setLoading(false);
        this.modalService.tratarError(error);
      }
    );
	}

}
