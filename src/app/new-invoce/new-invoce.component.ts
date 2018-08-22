import { AfterViewInit, Component, OnInit, Renderer } from '@angular/core';
import { Location } from '@angular/common';
import { NgForm, ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from "@angular/router";
import { WebSocketService } from '../websocket.service';
import { FunctionsService } from '../functions.service'
import { environment } from '../../environments/environment';
import { environmentProd } from '../../environments/environment.prod';
import { Subject } from 'rxjs';
declare let alertify: any;
@Component({
  selector: 'app-new-invoce',
  templateUrl: './new-invoce.component.html',
  styleUrls: ['./new-invoce.component.css']
})
export class NewInvoceComponent implements OnInit {
  loadingMore;
  dninumber;
  nameUSer;
  plans;
  allDepartaments;
  allmunicipalities;
  newPay: NgForm;
  Total;
  constructor(private renderer: Renderer, routeActived: ActivatedRoute, private router: Router, private _wsSocket: WebSocketService, private _FunctionsService: FunctionsService, private _location: Location) {
    this.dninumber = routeActived.snapshot.params['dninumber'];
    this.nameUSer = "Elkin Andres Mendoza";
    this._FunctionsService.getPlans().then(res => {
      this.plans = res;
    })
    this._FunctionsService.getAllDepartaments().then(res => {
      let responseD: any = res;
      if (!responseD.err) {
        this.allDepartaments = responseD.states
      }
    })


    this.loadingMore = false;
    this.allmunicipalities = null;

  }

  ngOnInit() {

    if (!this.dninumber) {
      this._location.back();

    }
  }
  changeDepartament(departament) {
    console.log(departament, 'selected')
    this.allmunicipalities = null;
    this._FunctionsService.getSpecificRegions(departament).then(res => {
      let responseD: any = res;
      if (!responseD.err) {
        this.allmunicipalities = responseD.cities
      }
    })
  }
  onSubmitNewPay(data) {
    if ((data.value.numConsultasplanCorporativo == "" || data.value.numConsultasplanCorporativo == null) && (data.value.numConsultasplanMiPersona == "" || data.value.numConsultasplanMiPersona == null) && (data.value.numConsultasplanMinegocio == "" || data.value.numConsultasplanMinegocio == null) && (data.value.valorConsultasplanCorporativo == "" || data.value.valorConsultasplanCorporativo == null) && (data.value.valorConsultasplanMiPersona == "" || data.value.valorConsultasplanMiPersona == null) && (data.value.valorConsultasplanMinegocio == "" || data.value.valorConsultasplanMinegocio == null)) {
      alertify.alert('Nuevo saldo', "Por Favor ingresa Valores y cantidad de consultas para uno o mas planes.", function () {

      });
    } else {
      // if (((data.value.numConsultasplanCorporativo != null && data.value.numConsultasplanCorporativo != "") || (data.value.numConsultasplanMiPersona != null && data.value.numConsultasplanMiPersona != "") || (data.value.numConsultasplanMinegocio != null && data.value.numConsultasplanMinegocio != ""))) {
      //   if (((data.value.valorConsultasplanCorporativo == null || data.value.valorConsultasplanCorporativo == "") || (data.value.valorConsultasplanMiPersona == null || data.value.valorConsultasplanMiPersona == "") || (data.value.valorConsultasplanMinegocio == null || data.value.valorConsultasplanMinegocio == ""))) {
      //     console.log('seee metioooooo 2222')

      //     if ((data.value.numConsultasplanCorporativo != null && data.value.numConsultasplanCorporativo != "") && (data.value.valorConsultasplanCorporativo == null || data.value.valorConsultasplanCorporativo == "")) {
      //       alertify.alert('Nuevo saldo', "Por Favor ingresa la suma del costo para el (PLAN CORPORATIVO - MI PERSONAL DE CONFIANZA)", function () {

      //       });

      //     } else if ((data.value.numConsultasplanMiPersona != null && data.value.numConsultasplanMiPersona != "") && (data.value.valorConsultasplanMiPersona == null || data.value.valorConsultasplanMiPersona == "")) {
      //       alertify.alert('Nuevo saldo', "Por Favor ingresa la suma del costo para el (MI PERSONAL DE CONFIANZA)", function () {

      //       });
      //     } else if ((data.value.numConsultasplanMinegocio != null && data.value.numConsultasplanMinegocio != "") && (data.value.valorConsultasplanMinegocio == null || data.value.valorConsultasplanMinegocio == "")) {
      //       alertify.alert('Nuevo saldo', "Por Favor ingresa la suma del costo para el (MI NEGOCIO DE CONFIANZA)", function () {

      //       });
      //     } else {
      //       if ((data.value.numConsultasplanCorporativo != null && data.value.numConsultasplanCorporativo != "") && (data.value.valorConsultasplanCorporativo != null && data.value.valorConsultasplanCorporativo != "")) {
      //         console.log('seee metioooooo 33333')

      //         if (data.value.numConsultasplanCorporativo == null || data.value.numConsultasplanCorporativo == "") {
      //           alertify.alert('Nuevo saldo', "Por Favor ingresa el número de consultas para el (PLAN CORPORATIVO - MI PERSONAL DE CONFIANZA)", function () {

      //           });
      //         } else if (data.value.valorConsultasplanCorporativo == null || data.value.valorConsultasplanCorporativo == "") {
      //           alertify.alert('Nuevo saldo', "Por Favor ingresa la suma del costo para el (PLAN CORPORATIVO - MI PERSONAL DE CONFIANZA)", function () {

      //           });
      //         }
      //       } else if ((data.value.numConsultasplanMiPersona != null && data.value.numConsultasplanMiPersona != "") && (data.value.valorConsultasplanMiPersona != null && data.value.valorConsultasplanMiPersona != "")) {
      //         if (data.value.numConsultasplanMiPersona == null || data.value.numConsultasplanMiPersona == "") {
      //           alertify.alert('Nuevo saldo', "Por Favor ingresa el número de consultas para el (MI PERSONAL DE CONFIANZA)", function () {

      //           });
      //         } else if (data.value.valorConsultasplanMiPersona == null || data.value.valorConsultasplanMiPersona == "") {
      //           alertify.alert('Nuevo saldo', "Por Favor ingresa la suma del costo para el (MI PERSONAL DE CONFIANZA)", function () {

      //           });
      //         }
      //       }

      //     }
      //   } else {
      //     console.log('seee metioooooo chevereee')
      //   }
      // } else if (((data.value.valorConsultasplanCorporativo != null && data.value.valorConsultasplanCorporativo != "") || (data.value.valorConsultasplanMiPersona != null && data.value.valorConsultasplanMiPersona != "") || (data.value.valorConsultasplanMinegocio != null && data.value.valorConsultasplanMinegocio != ""))) {
      //   if (((data.value.numConsultasplanCorporativo == null || data.value.numConsultasplanCorporativo == "") || (data.value.numConsultasplanMiPersona == null || data.value.numConsultasplanMiPersona == "") || (data.value.numConsultasplanMinegocio == null || data.value.numConsultasplanMinegocio == ""))) {

      //     if ((data.value.valorConsultasplanCorporativo != null && data.value.valorConsultasplanCorporativo != "") && (data.value.numConsultasplanCorporativo == null || data.value.numConsultasplanCorporativo == "")) {
      //       alertify.alert('Nuevo saldo', "Por Favor ingresa el número de consultas para el (PLAN CORPORATIVO - MI PERSONAL DE CONFIANZA)", function () {

      //       });

      //     } else if ((data.value.valorConsultasplanMiPersona != null && data.value.valorConsultasplanMiPersona != "") && (data.value.numConsultasplanMiPersona == null || data.value.numConsultasplanMiPersona == "")) {
      //       alertify.alert('Nuevo saldo', "Por Favor ingresa el número de consultas para el (MI PERSONAL DE CONFIANZA)", function () {

      //       });
      //     } else if ((data.value.valorConsultasplanMinegocio != null && data.value.valorConsultasplanMinegocio != "") && (data.value.numConsultasplanMinegocio == null || data.value.numConsultasplanMinegocio == "")) {
      //       alertify.alert('Nuevo saldo', "Por Favor ingresa el número de consultas para el (MI NEGOCIO DE CONFIANZA)", function () {

      //       });
      //     }

      //   } else {
      //     console.log('seee metioooooo acáaaaa')

      //   }
      // } else {
      //   console.log('seee metioooooo acáaaaaaaaaaaa')

      // }
    }
  }
  acumTotal(val) {

  }

}
