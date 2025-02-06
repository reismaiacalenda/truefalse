import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { Router } from "@angular/router";
import { AuthenticationService } from "../_services/authentication.service";
import { Helpers } from "../../helpers";
import { AngularTokenService } from 'angular-token';
import { HttpHeaders, HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-logout',
  templateUrl: "./logout.component.html",
  encapsulation: ViewEncapsulation.None,
})

export class LogoutComponent implements OnInit {

  constructor(private _router: Router,
    private tokenService: AngularTokenService,
    public http: HttpClient) {
  }

  ngOnInit(): void {
    Helpers.setLoading(true);
    this.tokenService.signOut()
      .subscribe(
        response=>{
          Helpers.setLoading(false);
          this._router.navigate(['/login']);
        },
        error=>{
          Helpers.setLoading(false);
          this._router.navigate(['/login']);
        }
      )
  }
}
