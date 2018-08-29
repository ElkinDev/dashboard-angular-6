import { AfterViewInit, Component, OnDestroy, OnInit, Renderer } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from "@angular/router";
import { WebSocketService } from '../websocket.service';
import { FunctionsService } from '../functions.service'
import { environment } from '../../environments/environment';
import { environmentProd } from '../../environments/environment.prod';
import { Subject } from 'rxjs';

import * as jquery from 'jquery'
declare let alertify: any;


@Component({
  selector: 'app-invoces-customer',
  templateUrl: './invoces-customer.component.html',
  styleUrls: ['./invoces-customer.component.css']
})
export class InvocesCustomerComponent implements OnDestroy, OnInit {
  dninumber;
  isProdEnvironment;
  loadingMore;
  nameUSer;
  dtOptions: DataTables.Settings;;
  invocesPayment;
  dtTrigger = new Subject();
  messageErrorQuery;
  infoUser;

  constructor(private renderer: Renderer, routeActived: ActivatedRoute, private router: Router, private _wsSocket: WebSocketService, private _FunctionsService: FunctionsService, private _location: Location) {
    this.dninumber = routeActived.snapshot.params['dninumber'];
    this.isProdEnvironment = routeActived.snapshot.data[0]['isProd'];
    this.loadingMore = true;
    this._FunctionsService.SpanishLanguageDatatable().then(res => {
      this.dtOptions = {
        language: res

        // pageLength: 2
      };
    });
    this.messageErrorQuery = 'No tienes Factura'

    this._FunctionsService.getInfoUser(this.dninumber).then(res => {
      let response: any = res;

      if (response.err) {
        this.router.navigate(["/Dashboard/customers/"]);
        alertify.error(response.msg);
      } else {
        this.infoUser = response;
        this.nameUSer = response.nombre;
        this.getAllInfo()

      }
    });
  }
  getAllInfo() {
    let data = { mail: null };
    data.mail = this.infoUser.mail;

    this._FunctionsService.getallInvoices(data).then(res => {
      let response: any = res;
      if (!response.err) {
        this.invocesPayment = response.pays;
        this.dtTrigger.next();
      } else {
        this.invocesPayment = null;
        alertify.error(response.msg);

      }


    });
  }
  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }
  ngOnInit() {


    setTimeout(() => {
      this.loadingMore = false;

    }, 3000)
    if (!this.dninumber) {
      this.router.navigate(["/Dashboard/customers/"]);


    }

    // Calling the DT trigger to manually render the table
  }
  viewDetail(data) {
    // console.log(data, 'est esto')
  }


}
