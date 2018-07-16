import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommercialsService } from './commercials-service.service'
import { NgForm } from '@angular/forms';
declare let alertify: any;
import { environment } from '../../environments/environment';
import { environmentProd } from '../../environments/environment.prod';

@Component({
  selector: 'app-commercials',
  templateUrl: './commercials.component.html',
  styleUrls: ['./commercials.component.css']
})
export class CommercialsComponent implements OnInit {
  hrefImageUploaded;
  ExistUser: boolean;
  NotEqualsPassword: boolean;
  checkedActivoUser: boolean = true;
  modusEditUser: string;
  loadingMore: boolean
  addSeller = false
  RoleUser: string;
  editSeller: boolean
  dataUserToEdit = "asdasdasdasd"
  ListAllInfo: boolean;
  listCommercials;
  urlMainServer;
  messageErrorQuery;
  today;


  constructor(private _commercialService: CommercialsService) {
    this.editSeller = false;
    this.hrefImageUploaded = 'assets/images/noimage.png';
    this.ExistUser = false;
    this.NotEqualsPassword = false;
    this.checkedActivoUser = true;
    this.modusEditUser = 'Activo';
    this.ListAllInfo = false;
    this.RoleUser = "Comercial";
    this.loadingMore = true;
    this.urlMainServer = environment.ws_url + '/public'
    this.today = new Date();


  }

  ngOnInit() {
    this._commercialService.getAllCommercials().then((res) => {

      if (!res) {
        this.listCommercials = null
        this.messageErrorQuery = "No Hay resultados"

      } else {
        this.listCommercials = res;
      }

      setTimeout(() => {
        this.loadingMore = false;
      }, 1000)

    }, (err) => {
      this.listCommercials = null;
      this.messageErrorQuery = err.msg ? err.msg : '¡Error inesperado, inténtelo nuevamente!';
      setTimeout(() => {
        this.loadingMore = false;
      }, 1000)

      console.log(err, 'cuaaal es')
    })
  }

  openFormSellers() {
    this.editSeller = false
    this.addSeller ? this.addSeller = false : this.addSeller = true
    this.ListAllInfo ? this.ListAllInfo = false : this.ListAllInfo = true


  }

  receiveMessage($event) {
    console.log('llegaaaaaaa');
    if ($event.type == 'function') {
      switch ($event.event) {
        case 'CloseFormAdmins':
          if ($event.formType) {
            this.ListAllInfo = false

            this.editSeller ? this.editSeller = false : this.editSeller = true

          } else {
            this.addSeller ? this.addSeller = false : this.addSeller = true
            this.ListAllInfo = false

          }
          break;
        case 'SubmitNewUser':
          this.submitNewUserAdmin($event.data)
          break;
        default:
          break
      }
    } else {

    }
  }
  submitNewUserAdmin(data): void {
    console.log('seee metee', data)
    let senData = data.value;
    senData.RoleUser = this.RoleUser;

    this._commercialService.CreateSellerUser(senData).then(res => {
      alertify.success(res);
      senData.fecha = this.today
      this.listCommercials.push(senData)
      this.addSeller ? this.addSeller = false : this.addSeller = true
      this.ListAllInfo ? this.ListAllInfo = false : this.ListAllInfo = true
    }, err => {
      alertify.error(err);


    })

  }
  editSellerUser(data): void {

    this.dataUserToEdit = "jaujauaujauja"
    this.ListAllInfo = true
    this.addSeller = false
    this.editSeller = true

  }

  removeSeller(emailUser: string): void {
    alertify
      .confirm("Comerciales", "¿Eliminar al Comercial " + emailUser + "?",
        function () {
          alertify.success('Ok')
        }
        , function () {
        }
      )
      .set({

        'labels': {
          'ok': 'Eliminar',
          'cancel': 'Cancelar'
        }
      }).autoCancel(15);
  }

  onSubmitEditUser(data: NgForm) {

  }

  changeModusUser() {
    this.modusEditUser === 'Activo' ? this.modusEditUser = 'Inactivo' : this.modusEditUser = 'Activo'
  }
  clearForm() {

    this.editSeller ? this.editSeller = false : this.editSeller = true
    this.ListAllInfo = false



  }

  readUrl(event: any) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.hrefImageUploaded = event.target.result;
      }
      reader.readAsDataURL(event.target.files[0]);

    }
  }

}
