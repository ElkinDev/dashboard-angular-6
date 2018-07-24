import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';
import { environmentProd } from '../../environments/environment.prod';
import {WebSocketService} from '../websocket.service';
import {CustomersService} from './customers-service.service';
declare let alertify: any;

declare var jQuery:any;
declare var $ :any;
@Component({
  selector: 'app-customers-people',
  templateUrl: './customers-people.component.html',
  styleUrls: ['./customers-people.component.css']
})
export class CustomersPeopleComponent implements OnInit {
  loadingMore: boolean;
  hrefImageUploaded;
  hrefImageUpload2;
  urlMainServer
  constructor() { 
    this.loadingMore = false;
    this.urlMainServer = environment.ws_url + '/public/dashboard/assets/images/'
    this.hrefImageUpload2 = this.urlMainServer + 'noimage.png';
    this.hrefImageUploaded = this.urlMainServer + 'noimage.png';
  }

  ngOnInit() {
  }

}
