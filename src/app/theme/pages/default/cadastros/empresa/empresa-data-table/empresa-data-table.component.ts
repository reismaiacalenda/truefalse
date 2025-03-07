import { Component, ViewChild, OnInit } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ModalDismissReasons, NgbDateStruct, NgbModal, NgbActiveModal, NgbModalOptions } from "@ng-bootstrap/ng-bootstrap";
import { EmpresaFormComponent } from '../empresa-form/empresa-form.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ModalService } from '../../../modal/modal.service';
import { DomainService } from '../../../../../../_services/domain.service';
import { Helpers } from '../../../../../../helpers';
import { User } from '../../../../../../auth/_models';
import { WorkspaceService } from '../../../../../../_services/workspace.service';
import { consoleLog } from '../../../../../../globals';

@Component({
  selector: 'empresa-data-table',
  templateUrl: './empresa-data-table.html'
})
export class EmpresaDataTableComponent implements OnInit {
  @ViewChild(DatatableComponent, {static: false}) minhaTable: DatatableComponent;

  dados: any[];
  rows: any[];
  private apiUrl: string;
  public currentUser: User;

  constructor(private modalNgb: NgbModal,
    private http: HttpClient,
    public workspaceService: WorkspaceService,
    private modalService: ModalService,
    private domainService: DomainService) {
    this.currentUser = this.workspaceService.currentUser;
    this.apiUrl = `${domainService.getApiUrl()}/empresas`
  }

  ngOnInit() {
    // Helpers.setLoading(true);
    this.carregarTable();
  }

  carregarTable() {
    consoleLog("setando curretUserpara empresa datatable");
    consoleLog(this.currentUser.id.toString());
    Helpers.setLoading(true);
    var h:HttpHeaders = new HttpHeaders({
      // 'unidade': Helpers.getUnidade().id.toString(),
      'funcionarioid': this.currentUser.id.toString()});
    this.http.get(`${this.apiUrl}.json`, {headers: h})
      //FIX
      .subscribe(
        dados => {
          this.rows = this.dados = (<any>dados).empresas
          Helpers.setLoading(false);
        }
      );
  }

  openFormModal(rowId?: string) {
    let ngbModalOptions: NgbModalOptions={
      backdrop: 'static',
      keyboard: false
    }
    const modalRef = this.modalNgb.open(EmpresaFormComponent, ngbModalOptions);
    modalRef.componentInstance.rowId = rowId;
    modalRef.result.then((responseSuccess) => {
      if (responseSuccess) {
        this.carregarTable();
      }
    })
  }

  removeItem(rowId) {
    this.modalService.tratarExclusao().then(
      r => {
        if (r) {
          this.http.delete(`${this.apiUrl}/${rowId}.json`,
          {observe: 'response'})
            .subscribe((response) => {
              this.modalService.tratarSucesso(response);
              //FIX
              if ((<any>response).status == 200) {
                var index = this.rows.findIndex(i => i.id == rowId);
                this.rows.splice(index, 1);
              }
            },
            (error: any) => this.modalService.tratarError(error)
            );
        }
      }
    );
  }

  updateFilter(event) {
    const busca = event.target.value.toLowerCase();
    const temp = this.dados.filter(
      f => String(f.nome).toLowerCase().indexOf(busca) !== -1
        || String(f.email).toLowerCase().indexOf(busca) !== -1
        || !busca
    );
    // update the rows
    this.rows = temp;
    // Whenever the filter changes, always go back to the first page
    this.minhaTable.offset = 0;
  }

  toggleExpandRow(row) {
    // consoleLog('Toggled Expand Row!', row);
    this.minhaTable.rowDetail.toggleExpandRow(row);
  }

  toggleExpandAllRow() {
    // this.minhaTable.rowDetail.expandAllRows();
    this.minhaTable.rowDetail.collapseAllRows();
  }
}
