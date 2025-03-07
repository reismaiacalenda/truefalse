import { Injectable, Inject } from "@angular/core";
import { environment } from "../../environments/environment";
import { DOCUMENT } from "@angular/common";
import { globals } from '../globals';
import { ModalService } from '../theme/pages/default/modal/modal.service';

@Injectable()
export class DomainService {
	subdominio: string;
	dominio: string;
	com: string;
	br: string;
	modalService: ModalService;

	constructor(@Inject(DOCUMENT) private document: any) {
		[this.br, this.com, this.dominio, this.subdominio] = this.document.location.hostname.split(".").reverse();
		if(this.subdominio == "develop"){
			this.subdominio = "reismaia";
		}else if (!environment.production){
			// this.subdominio = "animab"
			// this.subdominio = "dev"
			// this.subdominio = "fiemg"
			this.subdominio = "dev"
			
			//this.subdominio = "reismaia"
		 	 //this.subdominio = "app"
		 	// this.subdominio = "pedromonteiro"
		}
		if (globals.debug){
			this.modalService.debugService("Domain", "constructor", this.subdominio);
			this.modalService.debugService("Domain", "constructor", this.getHost());
			this.modalService.debugService("Domain", "constructor", this.getApiUrl());
			this.modalService.debugService("Domain", "constructor", this.getWebServiceUrl());
			this.modalService.debugService("Domain", "constructor", this.isClienteSubdominio());
		}
	}

	getHost() {
		if (environment.production) {
			return `${environment.origin}`;
		}
		return `//${this.document.location.hostname}:3000`;
	}

	getApiUrl() {
		return `${this.getHost()}/api/v1`;
		
	}

	getWebServiceUrl() {
		if (environment.production) {
			return `${environment.origin}/cable`
		}
		return `//${this.document.location.hostname}:3000/cable`;
	}

	isClienteSubdominio():boolean{
		return this.subdominio != "app";
	}

	montarRedirectSubdominio(novoPrefixo){
		if (environment.production){
			return `https://${novoPrefixo}.calenda.com.br/`;
		}else{
			this.subdominio = novoPrefixo;
			return `http://localhost:4200/`;
		}
	}

	getTrueFalseUrl(){
		if (environment.production){
			return `https://${this.subdominio}.calenda.com.br`;
		}else{
			return `http://localhost:4200/`;
		}
	}

	isAnima() {
		return this.document.location.hostname == "calenda.animaeducacao.com.br";
	}

	isHeroku() {
		return (this.document.location.hostname == "calendareismaia.herokuapp.com" ||
			this.document.location.hostname == "calenda.reismaia.com");
	}

	isLocalhost() {
		console.log("opa")
		console.log(this.document.location.hostname);
		return this.document.location.hostname == "localhost";
	}
}
