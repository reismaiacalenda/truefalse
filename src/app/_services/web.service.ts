import { HttpClient, HttpHeaders } from '@angular/common/http';
import { take } from 'rxjs/operators';
import { DomainService } from './domain.service';
import { ModalService } from '../theme/pages/default/modal/modal.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Helpers } from '../helpers';
import { Observable, Subscription } from 'rxjs';
import { tap, delay } from 'rxjs/operators';
import { WorkspaceService } from './workspace.service';
import { AngularTokenService } from 'angular-token';
import { HeadersService } from './header.service';
import { consoleLog, globals } from '../globals';
import { Injector } from '@angular/core';

export class WebService{
  public apiUrl:string;
  public result;
  
  constructor(protected http: HttpClient,
    private domainService: DomainService,
    private injector: Injector,
    private workspaceService: WorkspaceService,
    private tokenService: AngularTokenService,
    private headersService: HeadersService){
    this.apiUrl = this.domainService.getApiUrl();
  }

  index(){
    const modalService = this.injector.get(ModalService);
    Helpers.setLoading(true);
    return this.http.get(`${this.apiUrl}.json`)
    .subscribe(
      (response) => {
        // this.datatable.rows = (<any>response)[this.entidade_nome];
        // this.datatable.local_copy = this.datatable.rows;
        if (globals.debug){
          modalService.debugService("Web", "index", response);
        }
      },
      (error: any) => modalService.tratarError(error)
    )
    .add(()=>Helpers.setLoading(false))
  }

  show(id){
    var retornoShow;
    retornoShow = this.http.get(`${this.apiUrl}.json/${id}`).pipe(take(1));
    // if (globals.debug){
    //   this.modalService.debugService("Web", "show", retornoShow);
    // }
    return retornoShow;
  }

  get(endpoint, params?):Observable<any>{
    consoleLog("TA CAINDO AQUI");
    var retornoGet;
    if (params){
      retornoGet = this.http.get(`${this.apiUrl}/${endpoint}`, { 
        headers: this.headersService.definirHeaders(),
        params: params
      });
    }else{
      retornoGet = this.http.get(`${this.apiUrl}/${endpoint}`, {
        headers: this.headersService.definirHeaders()});
    }
    // if (globals.debug){
    //   this.modalService.debugService("Web", "get", retornoGet);
    // }
    return retornoGet;
  }

  async asyncGet(entidade): Promise<any>{
    const modalService = this.injector.get(ModalService);
    Helpers.setLoading(true);
    consoleLog("asyncGet")
    if (typeof this.result === 'undefined'){
      this.result = await this.http
      .get(`${this.domainService.getApiUrl()}/${entidade}.json`,
        {headers: this.headersService.definirHeaders()})
      .toPromise()
      .then(response => {
        if (globals.debug){
          modalService.debugService("Web", "asyncGet", response);
        }
        Helpers.setLoading(false);
        consoleLog(response);
        consoleLog("result saiu")
        this.result = response;
        consoleLog(this.result)
        return response;
      })
      .catch((error: any) => {
        Helpers.setLoading(false);
        modalService.tratarError(error)})
    }
    consoleLog("return")
    consoleLog(this.result)
    return this.result;
  }


  put(endpoint, body):Observable<any>{
    var retornoPut;
    retornoPut = this.http.put(`${this.apiUrl}/${endpoint}.json`, body
    ,{headers: this.headersService.definirHeaders(), observe: 'response'});
    // if (globals.debug){
    //   this.modalService.debugService("Web", "put", retornoPut);
    // }
    return retornoPut;
  }

  putFormData(endpoint, body):Observable<any>{
    var retornoPut;
    retornoPut = this.http.put(`${this.apiUrl}/${endpoint}.json`, body
    ,{headers: this.headersService.definirHeaders(true), observe: 'response'});
    // if (globals.debug){
    //   this.modalService.debugService("Web", "put", retornoPut);
    // }
    return retornoPut;
  }

  public post(endpoint, body):Observable<any>{
    var retornoPost;
    retornoPost = this.http.post(`${this.apiUrl}/${endpoint}.json`, body
    ,{headers: this.headersService.definirHeaders(), observe: 'response'});
    // if (globals.debug){
    //   this.modalService.debugService("Web", "post", retornoPost);
    // }
    return retornoPost;
  }

  patch(endpoint, body):Observable<any>{
    var retornoPatch;
    retornoPatch =  this.http.patch(`${this.apiUrl}/${endpoint}.json`, body
    ,{headers: this.headersService.definirHeaders(), observe: 'response'});
    // if (globals.debug){
    //   this.modalService.debugService("Web", "patch", retornoPatch);
    // }
    return retornoPatch;
  }

  delete(endpoint, id, params?):Observable<any>{
    var retornoDelete;
  // consoleLog("Entrou no delete");
  // consoleLog(params);
    if (params){
    // consoleLog("Entrou no if do params");
      retornoDelete = this.http.delete(`${this.apiUrl}/${endpoint}/${id}.json`, {
        headers: this.headersService.definirHeaders(),
        params: params,
        observe: 'response'
      });
    }else{
    // consoleLog("Entrou no else do params");
      retornoDelete = this.http.delete(`${this.apiUrl}/${endpoint}/${id}.json`, {
        headers: this.headersService.definirHeaders(),
        observe: 'response'      
      });
    }
  // consoleLog("retornoDelete");
  // consoleLog(retornoDelete);
    return retornoDelete;
  }

  // delete(endpoint, id):Observable<any>{
  //   var retornoDelete;
  //   retornoDelete = this.http.delete(`${this.apiUrl}/${endpoint}/${id}.json`, { 
  //     headers: this.headersService.definirHeaders(),
  //     observe: 'response'
  //   });
  //   // if (globals.debug){
  //   //   this.modalService.debugService("Web", "delete", retornoDelete);
  //   // }
  //   return retornoDelete;
  // }

  // patch(endpoint):Observable<any>{
  //   return this.http.patch(`${this.apiUrl}/${endpoint}.json`, { headers: this.headers});
  // }

  // private create(body){
  //   this.http.post(`${this.url}.json`, body,
  //     { headers: this.headers, observe: 'response'})
  //     .subscribe(
  //       (response) => this.modalService.tratarSucesso(response, this.activeModal),
  //       (error: any) => this.modalService.tratarError(error)
  //     ).add(()=>{Helpers.setLoading(false)});
  // }

  // private update(body){
  //   this.http.post(`${this.url}.json`, body,
  //     { headers: this.headers, observe: 'response'})
  //     .subscribe(
  //       (response) => this.modalService.tratarSucesso(response, this.activeModal),
  //       (error: any) => this.modalService.tratarError(error)
  //     ).add(()=>{Helpers.setLoading(false)});
  // }

  // save(record){
  //   Helpers.setLoading(true);
  //   if (record.value.id){
  //     return this.update(record.value);
  //   }else{
  //     return this.create(record.value);
  //   }
  // }

  // remove(id){
  //   this.modalService.tratarExclusao().then(
  //     r => {
  //       if (r) {
  //         Helpers.setLoading(true);
  //         this.http.delete(`${this.url}/${id}.json`,{observe: 'response'})
  //           .subscribe(
  //             (response) => {
  //               this.modalService.tratarSucesso(response);
  //               if ((<any>response).status == 200) {
  //                 this.index();
  //               }
  //             },
  //             (error: any) => this.modalService.tratarError(error))
  //           .add(()=>Helpers.setLoading(false));
  //       }
  //     }
  //   );
  // }

  // list(entidade){
  //   // return this.http.get()
  // }


}