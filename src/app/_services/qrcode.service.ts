import { HttpClient } from '@angular/common/http';
import { DomainService } from './domain.service';
import { ModalService } from '../theme/pages/default/modal/modal.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Helpers } from '../helpers';
import { WebService } from './web.service';

export class QrCodeService{
  public entidade_nome:string;
  public entidade_url:string;
  public activeModal: NgbActiveModal;
  public webService: WebService;

  constructor(protected http: HttpClient,
    private domainService: DomainService,
    private modalService: ModalService){}

  inicializar(activeModal){
    this.entidade_url = `${this.domainService.getApiUrl()}/${this.entidade_nome}`;
    if (activeModal){this.activeModal = activeModal}
  }

  qrCode(action, titulo, corpo){
    Helpers.setLoading(true);
    // this.http.get(`${this.entidade_url}/${action}`, {})
    this.webService.get(action, {})
      .subscribe(
        (response) => {
          Helpers.setLoading(false);
          if (response){
            this.modalService.tratarMensagem(titulo, corpo)
          }
          },
        (error: any) => {
          this.modalService.tratarError(error);
          Helpers.setLoading(false);
        }
      );
  }

}
