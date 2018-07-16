import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';
import { environment } from '../../environments/environment';
import { environmentProd } from '../../environments/environment.prod';
import { AuditorService } from './auditor.service'
declare let alertify: any;

@Component({
  selector: 'app-auditor',
  templateUrl: './auditor.component.html',
  styleUrls: ['./auditor.component.css']
})
export class AuditorComponent implements OnInit {
  hrefImageUploaded;
  ExistUser: boolean;
  NotEqualsPassword: boolean;
  checkedActivoUser: boolean = true;
  modusEditUser: string;
  loadingMore: boolean
  addAuditor = false
  RoleUser: string;
  EditAuditor: boolean
  dataUserToEdit = "asdasdasdasd"
  ListAllInfo: boolean;
  ListEditors;
  urlMainServer;
  messageErrorQuery;
  today;

  constructor(private _auditorService: AuditorService) {
    this.EditAuditor = false
    this.hrefImageUploaded = 'assets/images/noimage.png';
    this.ExistUser = false
    this.NotEqualsPassword = false
    this.checkedActivoUser = true
    this.modusEditUser = 'Activo'
    this.ListAllInfo = false
    this.loadingMore = true;
    this.urlMainServer = environment.ws_url + '/public'
    this.RoleUser = "Auditor";
    this.today = new Date();

  }

  ngOnInit() {
    this._auditorService.getAllEditors().then((res) => {

      if (!res) {
        this.ListEditors = null
        this.messageErrorQuery = "No Hay resultados"

      } else {
        this.ListEditors = res;

      }
      setTimeout(() => {
        this.loadingMore = false;
      }, 1000)

    }, (err) => {
      this.ListEditors = null;
      this.messageErrorQuery = err.msg ? err.msg : '¡Error inesperado, inténtelo nuevamente!';
      setTimeout(() => {
        this.loadingMore = false;
      }, 1000)
    })
  }
  openFormAuditors() {
    this.EditAuditor = false
    this.addAuditor ? this.addAuditor = false : this.addAuditor = true
    this.ListAllInfo ? this.ListAllInfo = false : this.ListAllInfo = true


  }

  receiveMessage($event) {
    if ($event.type == 'function') {
      switch ($event.event) {
        case 'CloseFormAdmins':
          if ($event.formType) {
            this.ListAllInfo = false

            this.EditAuditor ? this.EditAuditor = false : this.EditAuditor = true

          } else {
            this.addAuditor ? this.addAuditor = false : this.addAuditor = true
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

    this._auditorService.CreateAuditorUser(senData).then(res => {
      alertify.success(res);
      senData.fecha = this.today
      this.ListEditors.push(senData)
      this.addAuditor ? this.addAuditor = false : this.addAuditor = true
      this.ListAllInfo ? this.ListAllInfo = false : this.ListAllInfo = true
    }, err => {
      alertify.error(err);

    })

  }

  editAuditorUser(data): void {

    this.dataUserToEdit = "jaujauaujauja"
    this.ListAllInfo = true
    this.addAuditor = false
    this.EditAuditor = true

  }

  removeAuditor(emailUser: string): void {
    alertify
      .confirm("Auditores", "¿Eliminar al Auditor " + emailUser + "?",
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

    this.EditAuditor ? this.EditAuditor = false : this.EditAuditor = true
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
