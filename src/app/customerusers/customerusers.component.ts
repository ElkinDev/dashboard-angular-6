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
  selector: 'app-customerusers',
  templateUrl: './customerusers.component.html',
  styleUrls: ['./customerusers.component.css']
})
export class CustomerusersComponent implements OnInit {
  dninumber;
  loadingMore;
  nameUSer;
  dtOptions: DataTables.Settings = {};
  invocesPayment;
  dtTrigger = new Subject();
  messageErrorQuery;
  infoUser;
  checkedActivoUser: boolean;
  NotEqualsPassword: boolean;
  addNewuser;
  PowerPassword;
  statusNewCustomer: String;
  ExistUser: boolean;
  passwordinput;
  constructor(private renderer: Renderer, routeActived: ActivatedRoute, private router: Router, private _wsSocket: WebSocketService, private _FunctionsService: FunctionsService, private _location: Location) {
    this.dninumber = routeActived.snapshot.params['dninumber'];
    this.loadingMore, this.checkedActivoUser = true;
    this.statusNewCustomer = 'Activo';
    this.NotEqualsPassword, this.addNewuser, this.ExistUser = false;
    this._FunctionsService.SpanishLanguageDatatable().then(res => {
      this.dtOptions = {
        language: res

        // pageLength: 2
      };

    });
    this.messageErrorQuery = 'No hay usuarios registrados.'
    this.invocesPayment = [
      { nombre: 'Elkin Andres Mendoza Cova', cargo: 'Asistente', fecha: '10 de julio de 2018', email: 'elkinmendoza00@gmail.com', saldos: [] }
    ];
    this._FunctionsService.getPlans().then(res => {
      console.log(res)
    })
    this._FunctionsService.getInfoUser(this.dninumber).then(res => {
      let response: any = res;

      if (response.err) {
        this.router.navigate(["/Dashboard/customers/"]);
        alertify.error(response.msg);
      } else {
        this.infoUser = response;
        this.nameUSer = response.nombre;
        // this.getAllInfo()


      }
    });
  }

  getAllInfo() {


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
  ValidatePasswordPower(event: any) {
    if (event.target.value) {
      let statusPass = this._FunctionsService.ValidationSecurityPassword(event.target.value);
      this.PowerPassword = statusPass;
      switch (statusPass) {
        case 'Débil':
          break;
        case 'Aceptable':
          break;
        case 'Fuerte':
          break;
      }
      this.passwordinput = event.target.value;
    } else {

      this.PowerPassword = null;
    }

  }

  validatePasswordRepeat(event: any, password) {
    if (event.target.value != password.value) {
      if (password.value.length != 0 && event.target.value.length != 0) {
        this.NotEqualsPassword = true;
      }
    } else {
      this.NotEqualsPassword = false;
    }
  }
  disabledPassErr(): void {
    this.NotEqualsPassword = false;

  }
  changeStatusCustomer() {
    this.statusNewCustomer === 'Activo' ? this.statusNewCustomer = 'Inactivo' : this.statusNewCustomer = 'Activo'
  }
  onSubmitNewCustomerCompany() {

  }

}
