import { AfterViewInit, Component, OnDestroy, OnInit, Renderer, ChangeDetectorRef,ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { NgForm, ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { CustomersService } from '../customers-people/customers-service.service';
import { DataTableDirective } from 'angular-datatables';
import { Router, ActivatedRoute } from "@angular/router";
import { WebSocketService } from '../websocket.service';
import { FunctionsService } from '../functions.service'
import { environment } from '../../environments/environment';
import { environmentProd } from '../../environments/environment.prod';
import { Subject } from 'rxjs';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

import * as jquery from 'jquery'
declare let alertify: any;

@Component({
  selector: 'app-customerusers',
  templateUrl: './customerusers.component.html',
  styleUrls: ['./customerusers.component.css']
})
export class CustomerusersComponent implements OnDestroy, OnInit {
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger = new Subject();
  dninumber;
  loadingMore;
  nameUSer;
  usersEmployedCustomer;
  messageErrorQuery;
  infoUser;
  checkedActivoUser: boolean;
  NotEqualsPassword: boolean;
  addNewuser;
  editUser;
  PowerPassword;
  statusNewCustomer: String;
  ExistUser: boolean;
  passwordinput;
  TotalQueryMipersonal;
  llevasQueryMipersonal;
  noQueryValidMiPersonal: boolean = false;
  TotalQueryMiNegocio;
  llevasQueryMinegocio;
  noQueryValidMiNegocio: boolean = false;
  TotalQueryCorporativo;
  llevasQueryCorporativo;
  noQueryValidCorporativo: boolean = false;
  EditUser = new FormGroup({
    nombre: new FormControl(),
    cedula: new FormControl(),
    cargo: new FormControl(),
    mail: new FormControl(),
    checModusEdit: new FormControl(),
    password1: new FormControl(),
    passwordRepeat1: new FormControl(),

  });
  modusEditUser;
  CurrentUserBalance = null;
  modusPushSaldo;
  modusPushBalance = true;
  senData;
  roleUser;
  constructor(private renderer: Renderer, routeActived: ActivatedRoute, private router: Router, private _wsSocket: WebSocketService, private _FunctionsService: FunctionsService, private _location: Location, private cdRef: ChangeDetectorRef, private modalService: NgbModal, private _CustomersService: CustomersService) {
    this.senData = null
    this.dninumber = routeActived.snapshot.params['dninumber'];
    this.loadingMore = true;
    this.checkedActivoUser = true;
    this.statusNewCustomer = 'Activo';
    this.NotEqualsPassword, this.addNewuser, this.ExistUser, this.editUser = false;
    this.roleUser = 'customer';
    this.messageErrorQuery = 'No hay usuarios registrados.'
    this.modusPushSaldo = 'Adicionar'
    this._FunctionsService.SpanishLanguageDatatable().then(res => {
      this.dtOptions = {
        language: res

        // pageLength: 2
      };

    });

    this._FunctionsService.getInfoUser(this.dninumber).then(res => {
      let response: any = res;

      if (response.err) {
        this.router.navigate(["/Dashboard/customers/"]);
        alertify.error(response.msg);
      } else {
        this.infoUser = response;
        this.nameUSer = response.nombre;
        this.getAllInfo(this.infoUser.mail)


      }
    });
  }
  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  getAllInfo(email) {
    this._FunctionsService.getAllUsersEmployedCompany(email).then(res => {
      let response: any = res;

      if (response.err) {
        if (response.type == 'noCompanyEmployes') {
          this.usersEmployedCustomer = null;
          this.messageErrorQuery = response.msg
          this.getAllBalances(email);
        } else {

          this.router.navigate(["/Dashboard/customers/"]);
          alertify.error(response.msg);
        }
      } else {
        this.usersEmployedCustomer = response.users
        this.dtTrigger.next();
        this.getAllBalances(email);



      }

    });

  }
  getOnlyInfo(email) {
    this._FunctionsService.getAllUsersEmployedCompany(email).then(res => {
      let response: any = res;

      if (response.err) {
        if (response.type == 'noCompanyEmployes') {
          this.usersEmployedCustomer = null;
          this.messageErrorQuery = response.msg
          this.loadingMore = false;

        } else {

          this.router.navigate(["/Dashboard/customers/"]);
          alertify.error(response.msg);
        }
      } else {
        this.usersEmployedCustomer = response.users
        this.loadingMore = false;
        this.rerender()




      }

    });
  }
  getAllBalances(email) {
    this._FunctionsService.getBalancesfromCustomer(email).then(res => {
      let response: any = res;
      if (response.plans.length > 0) {
        response.plans.forEach(element => {
          switch (element.plan) {
            case 'Contratación de personal':
              this.TotalQueryCorporativo = element.total;
              this.llevasQueryCorporativo = element.count;
              break;
            case 'Mi negocio de confianza':
              this.TotalQueryMiNegocio = element.total;
              this.llevasQueryMinegocio = element.count;
              break;
            case 'Mi personal de Confianza':
              this.TotalQueryMipersonal = element.total;
              this.llevasQueryMipersonal = element.count;
              break;
            default:
              break;

          }
        });
      }

      this.loadingMore = false;

    });
  }
  

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }
  ngOnInit() {

    if (!this.dninumber) {
      this.router.navigate(["/Dashboard/customers/"]);


    }

    this._wsSocket.on('createUser:' + this.roleUser).subscribe((res) => {
      if (!res.err) {
        alertify.success('Usuario interno ' + res.mail, ' creado con exito');
        this.senData = null;
        location.reload();

      } else {

      }


    }, (error) => {

    })

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
  validatePasswordRepeat1(repeatPassword, password) {
    if (repeatPassword.value != password.value) {
      if (password.value.length != 0 && repeatPassword.value.length != 0) {
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
  onSubmitNewCustomerCompany(data) {
    let resd: any = null;

    if (data.valid) {
      if (data.value.password1 != data.value.passwordRepeat1) {
        this.NotEqualsPassword = true;
      } else {
        let senData = {
          nit: data.value.cedula,
          nombre: data.value.nombre,
          emailUser: data.value.mail,
          password: data.value.password1,
          passwordRepeat: data.value.passwordRepeat1,
          typeIdentification: 'CC',
          status: data.value.checkmodusNew,
          opt: 16,
          company: this.infoUser.id

        }
        this.senData = senData
        this._CustomersService.createCustomer(senData).then(res => {
          resd = res;
          if (resd.type == 'createdUserNew') {
            alertify.alert("Confirma el registro de usuario", function () {
              window.open(resd.link, "_blank")

            });
          }
        }, err => {
          alertify.error(err.msg)
        })



      }
    } else {

    }


  }
  closeEditForm(){
    this.addNewuser=false;this.NotEqualsPassword = false;this.PowerPassword = null;
  }
  onSubmitEditUser(user) {
    console.log('vengaaa entraaaa', user);
  }
  ChangeBalancesCustomer(plan, numquery) {


    switch (plan) {
      case 'MPC':
        if (numquery != null) {
          if (numquery > this.TotalQueryMipersonal) {
            this.noQueryValidMiPersonal = true;

          } else {
            this.noQueryValidMiPersonal = false;

          }
        } else {
          this.noQueryValidMiPersonal = false;

        }
        break;
      case 'MNC':
        if (numquery != null) {
          if (numquery > this.TotalQueryMiNegocio) {
            this.noQueryValidMiNegocio = true;

          } else {
            this.noQueryValidMiNegocio = false;

          }
        } else {
          this.noQueryValidMiNegocio = false;

        }
        break;
      case 'CMPC':
        if (numquery != null) {
          if (numquery > this.TotalQueryCorporativo) {
            this.noQueryValidCorporativo = true;

          } else {
            this.noQueryValidCorporativo = false;

          }
        } else {
          this.noQueryValidCorporativo = false;

        }

        break;
      default:
        break;
    }

  }

  openEditUser(user) {
    this.editUser = true;
    user.status ? this.modusEditUser = 'Activo' : this.modusEditUser = 'Inactivo'
    this.EditUser.patchValue({
      nombre: user.nombre,
      cedula: user.cedula,
      cargo: user.cargo,
      mail: user.mail,
      checModusEdit: user.status
    });
  }
  removeUser(data, index): void {
    let opt;
    data.typeIdentification == 'NIT' ? opt = 13 : opt = 17;
    alertify
      .confirm("Usuarios Internos de " + this.nameUSer, "¿Eliminar al usuario " + data.mail + "?",
        (() => {
          this._FunctionsService.RemoveUser(data.mail, data.id, opt).then(msg => {
            alertify.success(msg);
            this.usersEmployedCustomer.splice(index, 1);
            console.log(this.usersEmployedCustomer,);
            this.rerender()

          }, err => {
            alertify.error(err)
          })

        })
        , () => {
        }
      )
      .set({

        'labels': {
          'ok': 'Eliminar',
          'cancel': 'Cancelar'
        }
      }).autoCancel(15);
  }

  //open Modal Balances
  openModalBalances(content, data) {
    this.CurrentUserBalance = data.nombre;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: "lg" }).result.then((result) => {
    }, (reason) => {
    });
  }
  changeModusPushBalance() {
    this.modusPushSaldo === 'Adicionar' ? this.modusPushSaldo = 'Restar' : this.modusPushSaldo = 'Adicionar'
  }

  

}
