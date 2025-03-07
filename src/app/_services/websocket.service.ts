import { Injectable } from "@angular/core";
import { ScriptLoaderService } from "./script-loader.service";
import { DomainService } from "./domain.service";

declare function conectar(ws): any;

@Injectable()
export class WebsocketService {

  constructor(private _script: ScriptLoaderService,
    private ds: DomainService) {

    this._script.load('body',
      'assets/action_cable/action_cable.js',
      'assets/action_cable/truefalse.js');
    // 'assets/websocket_rails/main.js',
    // 'assets/websocket_rails/websocket_rails.js',
    // 'assets/websocket_rails/event.js',
    // 'assets/websocket_rails/abstract_connection.js',
    // 'assets/websocket_rails/http_connection.js',
    // 'assets/websocket_rails/websocket_connection.js',
    // 'assets/websocket_rails/channel.js');

    conectar(this.ds.getWebServiceUrl());
  }
}
