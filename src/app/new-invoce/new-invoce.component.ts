import { AfterViewInit, Component, OnInit, Renderer } from '@angular/core';
import { Location } from '@angular/common';
import { NgForm, ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from "@angular/router";
import { WebSocketService } from '../websocket.service';
import { FunctionsService } from '../functions.service'
import { environment } from '../../environments/environment';
import { environmentProd } from '../../environments/environment.prod';
import { Subject } from 'rxjs';
import { MyCurrencyPipe } from "../my-currency-pipe.pipe";

declare let alertify: any;
@Component({
  selector: 'app-new-invoce',
  templateUrl: './new-invoce.component.html',
  styleUrls: ['./new-invoce.component.css']
})
export class NewInvoceComponent implements OnInit {
  loadingMore;
  dninumber;
  plans;
  allDepartaments;
  allmunicipalities;
  newPay: NgForm;
  Total;
  infoUser={nombre:null,apellido:null,typeIdentification:null,cedula:null,direccion:null};
  constructor(private renderer: Renderer, routeActived: ActivatedRoute, private router: Router, private _wsSocket: WebSocketService, private _FunctionsService: FunctionsService, private _location: Location, private currencyPipe: MyCurrencyPipe) {
    this.dninumber = routeActived.snapshot.params['dninumber'];
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
    this._FunctionsService.getInfoUser(this.dninumber).then(res => {
      let response: any = res;
      if (response.err) {
        this.router.navigate(["/Dashboard/customers/"]);

        alertify.error(response.msg);

      } else {
        this.infoUser = response;
        

      }
    });
  }
  back(){
    this._location.back();
  }
  changeDepartament(departament) {
    this.allmunicipalities = null;
    this._FunctionsService.getSpecificRegions(departament).then(res => {
      let responseD: any = res;
      if (!responseD.err) {
        this.allmunicipalities = responseD.cities
      }
    })
  }
  onSubmitNewPay(data) {
    console.log(data,'quierooo vertye esotooooo???')
    if ((data.value.numConsultasplanCorporativo == "" || data.value.numConsultasplanCorporativo == null) && (data.value.numConsultasplanMiPersona == "" || data.value.numConsultasplanMiPersona == null) && (data.value.numConsultasplanMinegocio == "" || data.value.numConsultasplanMinegocio == null) && (data.value.valorConsultasplanCorporativo == "" || data.value.valorConsultasplanCorporativo == null) && (data.value.valorConsultasplanMiPersona == "" || data.value.valorConsultasplanMiPersona == null) && (data.value.valorConsultasplanMinegocio == "" || data.value.valorConsultasplanMinegocio == null)) {
      alertify.alert('Nuevo saldo', "Por Favor ingresa Valores y cantidad de consultas para uno o mas planes.", function () { });
    } else {
      if (((data.value.numConsultasplanMiPersona != null || data.value.numConsultasplanMiPersona != "") && (data.value.valorConsultasplanMiPersona != null || data.value.valorConsultasplanMiPersona != ""))) {
        if ((data.value.numConsultasplanMiPersona != null || data.value.numConsultasplanMiPersona != "") && (data.value.valorConsultasplanMiPersona == null || data.value.valorConsultasplanMiPersona == "")) {
          alertify.alert('Nuevo saldo', "Ingresa el costo del Plan (MI PERSONAL DE CONFIANZA)", function () { });
        } else {
          if ((data.value.valorConsultasplanMiPersona != null || data.value.valorConsultasplanMiPersona != "") && (data.value.numConsultasplanMiPersona == null || data.value.numConsultasplanMiPersona == "")) {
            alertify.alert('Nuevo saldo', "Ingresa el número de consultas para el Plan (MI PERSONAL DE CONFIANZA)", function () { });

          } else {

            if ((data.value.numConsultasplanMinegocio != null && data.value.numConsultasplanMinegocio != "") || (data.value.valorConsultasplanMinegocio != null && data.value.valorConsultasplanMinegocio != "")) {
              if ((data.value.numConsultasplanMinegocio != null || data.value.numConsultasplanMinegocio != "") && (data.value.valorConsultasplanMinegocio == null || data.value.valorConsultasplanMinegocio == "")) {
                alertify.alert('Nuevo saldo', "Ingresa el costo del Plan (MI NEGOCIO DE CONFIANZA)", function () { });

              } else {
                if ((data.value.valorConsultasplanMinegocio != null || data.value.valorConsultasplanMinegocio != "") && (data.value.numConsultasplanMinegocio == null || data.value.numConsultasplanMinegocio == "")) {
                  alertify.alert('Nuevo saldo', "Ingresa el número de consultas para el Plan (MI NEGOCIO DE CONFIANZA)", function () { });

                } else {
                  if ((data.value.numConsultasplanCorporativo != null && data.value.numConsultasplanCorporativo != "") || (data.value.valorConsultasplanCorporativo != null && data.value.valorConsultasplanCorporativo != "")) {

                    if ((data.value.numConsultasplanCorporativo != null || data.value.numConsultasplanCorporativo != "") && (data.value.valorConsultasplanCorporativo == null || data.value.valorConsultasplanCorporativo == "")) {
                      alertify.alert('Nuevo saldo', "Ingresa el costo del Plan (CORPORATIVO MI NEGOCIO DE CONFIANZA)", function () { });

                    } else {
                      if ((data.value.valorConsultasplanCorporativo != null || data.value.valorConsultasplanCorporativo != "") && (data.value.numConsultasplanCorporativo == null || data.value.numConsultasplanCorporativo == "")) {
                        alertify.alert('Nuevo saldo', "Ingresa el número de consultas para el Plan (CORPORATIVO MI NEGOCIO DE CONFIANZA)", function () { });

                      } else {
                        this.submitNewInvoice(data.value);

                      }
                    }
                  } else {
                    this.submitNewInvoice(data.value);


                  }

                }
              }
            } else {
              this.submitNewInvoice(data.value);

            }
          }

        }
      }else{
        if ((data.value.numConsultasplanMinegocio != null && data.value.numConsultasplanMinegocio != "") || (data.value.valorConsultasplanMinegocio != null && data.value.valorConsultasplanMinegocio != "")) {
          if ((data.value.numConsultasplanMinegocio != null || data.value.numConsultasplanMinegocio != "") && (data.value.valorConsultasplanMinegocio == null || data.value.valorConsultasplanMinegocio == "")) {
            alertify.alert('Nuevo saldo', "Ingresa el costo del Plan (MI NEGOCIO DE CONFIANZA)", function () { });

          } else {
            if ((data.value.valorConsultasplanMinegocio != null || data.value.valorConsultasplanMinegocio != "") && (data.value.numConsultasplanMinegocio == null || data.value.numConsultasplanMinegocio == "")) {
              alertify.alert('Nuevo saldo', "Ingresa el número de consultas para el Plan (MI NEGOCIO DE CONFIANZA)", function () { });

            } else {
              if ((data.value.numConsultasplanCorporativo != null && data.value.numConsultasplanCorporativo != "") || (data.value.valorConsultasplanCorporativo != null && data.value.valorConsultasplanCorporativo != "")) {

                if ((data.value.numConsultasplanCorporativo != null || data.value.numConsultasplanCorporativo != "") && (data.value.valorConsultasplanCorporativo == null || data.value.valorConsultasplanCorporativo == "")) {
                  alertify.alert('Nuevo saldo', "Ingresa el costo del Plan (CORPORATIVO MI NEGOCIO DE CONFIANZA)", function () { });

                } else {
                  if ((data.value.valorConsultasplanCorporativo != null || data.value.valorConsultasplanCorporativo != "") && (data.value.numConsultasplanCorporativo == null || data.value.numConsultasplanCorporativo == "")) {
                    alertify.alert('Nuevo saldo', "Ingresa el número de consultas para el Plan (CORPORATIVO MI NEGOCIO DE CONFIANZA)", function () { });

                  } else {
                    this.submitNewInvoice(data.value);

                  }
                }
              } else {
                this.submitNewInvoice(data.value);


              }

            }
          }
        } else {
          this.submitNewInvoice(data.value);

        }
      }

    }
  }

  submitNewInvoice(data) {
    console.log(data,'queeEEEEE???')
    let messageConfirm = '';
    var TotalPay =0;
    let dataSend = [

    ]
    if (data.numConsultasplanCorporativo != null && data.numConsultasplanCorporativo != "") {
      console.log('seee meteeee 1')
      TotalPay=TotalPay+parseFloat(data.valorConsultasplanCorporativo)
      dataSend.push({ opt:2, querys: data.numConsultasplanCorporativo, value: data.valorConsultasplanCorporativo })
      messageConfirm = messageConfirm + ' <h4>Plan Corporativo Mi Personal de Confianza</h4><h5>N° de Consultas: ' + data.numConsultasplanCorporativo + '</h5><h5>Costo: $' + this.currencyPipe.transform(data.valorConsultasplanCorporativo) + '<h5> <hr>'
    }
    if (data.numConsultasplanMinegocio != null && data.numConsultasplanMinegocio != "") {
      TotalPay=TotalPay+parseFloat(data.valorConsultasplanMinegocio)  
      dataSend.push({ opt:1, querys: data.numConsultasplanMinegocio, value: data.valorConsultasplanMinegocio })      
      messageConfirm = messageConfirm + ' <h4>Plan Mi Negocio de Confianza</h4><h5>N° de Consultas: ' + data.numConsultasplanMinegocio + '</h5><h5>Costo: $' + this.currencyPipe.transform(data.valorConsultasplanMinegocio) + '<h5><hr>'


    }
    if (data.numConsultasplanMiPersona != null && data.numConsultasplanMiPersona != "") {
      TotalPay=TotalPay+parseFloat(data.valorConsultasplanMiPersona);      
      messageConfirm = messageConfirm + ' <h4>Plan Mi Personal de Confianza</h4><h5>N° de Consultas: ' + data.numConsultasplanMiPersona + '</h5><h5>Costo: $' + this.currencyPipe.transform(data.valorConsultasplanMiPersona) + '<h5><hr>'
      dataSend.push({ opt:3, querys: data.numConsultasplanMiPersona, value: data.valorConsultasplanMiPersona })

    }

    messageConfirm = messageConfirm + ' <h3>Total: $ ' + this.currencyPipe.transform(TotalPay)+ '</h3><hr>'


    alertify
      .confirm("Confirmar Saldo para " + this.infoUser.nombre, messageConfirm,
        (() => {
          this.pushNewSaldos(dataSend)
        })
        , () => {

          //CANCEL
        }
      )
      .set({

        'labels': {
          'ok': 'Agregar Saldo',
          'cancel': 'Cancelar'
        }
      }).autoCancel(25);

  }
  pushNewSaldos(data){
    console.log(data,'queejestoooo?')

  }

}
