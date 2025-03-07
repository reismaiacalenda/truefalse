import { HttpClient, HttpHeaders } from '@angular/common/http';
import { take } from 'rxjs/operators';
import { DomainService } from './domain.service';
import { ModalService } from '../theme/pages/default/modal/modal.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Helpers } from '../helpers';
import { Observable, Subscription } from 'rxjs';
import { tap, delay } from 'rxjs/operators';
import { OnDestroy, OnInit, Injectable } from '@angular/core';
import { HeadersService } from './header.service';
import { consoleLog, globals } from '../globals';
import { ActivatedRoute } from '@angular/router';
import { LoadingService } from './loading.service';

@Injectable({
  providedIn: 'root'
})
export class DatatableService implements OnInit, OnDestroy{
  public entidade_nome:string;
  public entidade_url:string;
  private subscriptions: Subscription
  public query:string;
  public defautlQuery:string;
  public page;
  public datatable;
  public datatables
  public datatableComponent;
  public queryUrlParams: string = "";

  constructor(protected http: HttpClient,
    private domainService: DomainService,
    private modalService: ModalService,
    private modalNgb: NgbModal,
    private headersService: HeadersService,
    private route: ActivatedRoute,
    private loadingService: LoadingService){

    }

  ngOnInit(){
  }

  ngOnDestroy(){
    this.subscriptions.unsubscribe();
  }
    
  inicializar(entidade, defautlQuery, query, page, datatable, datatableComponent){
    consoleLog("recebeu a entidade");
    consoleLog(entidade);
    this.entidade_nome = entidade;
    consoleLog(this.entidade_nome)
    this.entidade_url = `${this.domainService.getApiUrl()}/${this.entidade_nome}`;
    if (defautlQuery){
      if (query){
        this.query = defautlQuery + ' ' + query;
      }else{
        this.query = defautlQuery;  
      }
    }else{
      this.query = query;
    }
    this.page = page;
    this.datatable = datatable;
    this.datatableComponent = datatableComponent;
    this.subscriptions = new Subscription();
  }

  prepararUrl(){
    return `${this.domainService.getApiUrl()}/${this.datatableComponent.entidade}`;
  }

  prepararQueryParams(queryAdicional?){
    var queryParams;
    if (this.datatableComponent.datatableMultipla){
      queryParams =`?pages=`;
      this.datatableComponent.datatables.forEach(dt => {
        queryParams += dt.page.pageNumber + ',';
      });
      queryParams = queryParams.slice(0,-1);
      queryParams += `&group=-1`
    }else{
      queryParams = `?page=${this.page.pageNumber}`;
    }

    if (this.query){
      queryParams += `&q=${this.query}`
    }

    if (queryAdicional){
      queryParams += `${queryAdicional}`
    }

    if (this.queryUrlParams != ""){
      queryParams += this.queryUrlParams;
    }
    // adição dos queryParams de url queryString


    if (this.datatableComponent.filtro_id){
      queryParams += `&filtro_id=${this.datatableComponent.filtro_id}`
    }

    consoleLog("Comos está sendo rpeprado o queryParams");
    consoleLog(queryParams)
    consoleLog(this.queryUrlParams);

    return queryParams;
  }

  index(queryAdicional?){
    this.loadingService.addRequest();
    this.subscriptions.add(
      this.http.get(
        `${this.prepararUrl()}.json${this.prepararQueryParams(queryAdicional)}`,
        {headers:this.headersService.definirHeaders()}
      )
      .subscribe(
        (response:any) => {
          this.datatableComponent.multiplo;
          if(response.datatables){
            this.datatableComponent.datatables = response.datatables;
          }else{
            this.datatable.rows = response[this.entidade_nome];
            this.datatable.local_copy = this.datatable.rows;
          }
          Object.assign(this.page,response.page);
          this.loadingService.removeRequest();
        },
        (error: any) => {
          this.modalService.tratarError(error)
          this.loadingService.removeRequest();
        }       
      )
    )
  }

  filterDataTable(event){
    const busca = event.target.value.toLowerCase();
    // this.data.local_copy = this.data.rows;
    var keys;
    if (this.datatable.local_copy && this.datatable.local_copy[0]){
      keys = Object.keys(this.datatable.local_copy[0])
    }
    const temp = this.datatable.local_copy.filter(
      row => {
        var flag = false;
        keys.forEach(key => {
          if (String(row[key]).toLowerCase().indexOf(busca) !== -1){
            flag = true;
          }
        });
        return flag || !busca;
      }
    );
    // update the rows
    this.datatable.rows = temp;
  }

  show(row, table){
    Helpers.setLoading(true);
    this.http.get(`${this.entidade_url}/${row.id}.json`,
      {headers: this.headersService.definirHeaders()})
      .subscribe(
        (response) => {
          row.detalhe = response
          table.rowDetail.toggleExpandRow(row);
          Helpers.setLoading(false);
        },
        (error: any) => this.modalService.tratarError(error)
      );
  }
  
  update(body, multipart?){
    Helpers.setLoading(true);
    let id = (multipart == undefined || multipart == false) ? body.id : body.getAll('[id]');
    this.http.put(`${this.entidade_url}/${id}.json`, body,
      { headers: this.headersService.definirHeaders(multipart), observe: 'response'})
      .subscribe(
        (response) => {
          // this.modalService.tratarSucesso(response, this.activeModal);
          Helpers.setLoading(false);
          if (globals.debug){
            this.modalService.debugService("Form", "Update", response);
          }
          this.datatableComponent.refreshTable();
        },
        (error) => this.modalService.tratarError(error, 'put')
      )
  }
      
  remove(id, modalLote?){
    var queryParam = "";
    if (modalLote != undefined && modalLote == true){
      this.modalService.tratarLote()
        .then(r => {
          consoleLog("retornando da modal tratar lote");
          consoleLog(r);
          if (r!=undefined && r=='lote'){queryParam = "?em_lote=true"}
          this.callDelete(r, id, queryParam)
        });
    }else{
      queryParam = ""//"?em_lote=false"
      this.modalService.tratarExclusao("Deseja realmente processar essa exclusão?")
        .then(r => {this.callDelete(r, id, queryParam)});
    }
  }

  callDelete(r, id, queryParam){
    if (r) {
      Helpers.setLoading(true);
      this.subscriptions.add(
        this.http.delete(
        `${this.entidade_url}/${id}.json${queryParam}`,{observe: 'response',
          headers: this.headersService.definirHeaders()})
        .subscribe(
          (response) => {
            this.modalService.tratarSucesso(response);
            if (response.status > 199 && response.status < 300) {
              this.index();
            }
          },
          (error: any) => this.modalService.tratarError(error))
        .add(()=>Helpers.setLoading(false))
      );
    }
  }
}