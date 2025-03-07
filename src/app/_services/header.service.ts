import { AngularTokenService } from 'angular-token';
import { HttpHeaders } from '@angular/common/http';

export class HeadersService{
  private _headers;

  constructor(private tokenService: AngularTokenService){
    this.definirHeaders();
  }

  definirHeaders(multiPart?){
    var headers:any={};
    if (multiPart == undefined && multiPart == false){
      headers['Content-Type'] = 'application/json';
    }
    if (this.tokenService.currentAuthData){
      headers['access-token'] = this.tokenService.currentAuthData.accessToken;
      headers['client'] = this.tokenService.currentAuthData.client;
      headers['uid'] = this.tokenService.currentAuthData.uid;
      headers['token-type'] = this.tokenService.currentAuthData.tokenType;
      headers['expiry'] = this.tokenService.currentAuthData.expiry;
    }
    this._headers = new HttpHeaders(headers);
    return this._headers;
  }
}