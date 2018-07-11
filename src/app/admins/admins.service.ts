import { Injectable } from '@angular/core';
import { WebSocketService } from '../websocket.service';

@Injectable()

export class adminsService {
  constructor(private _wsSocket: WebSocketService) {

  }

  getAllAdmins() {
    this._wsSocket.emit('getAllAdmins', null);
  }

}
