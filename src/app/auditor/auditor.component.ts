import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';
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
  ListAllInfo: boolean
  constructor() {
    this.EditAuditor = false
    this.hrefImageUploaded = 'assets/images/noimage.png';
    this.ExistUser = false
    this.NotEqualsPassword = false
    this.checkedActivoUser = true
    this.modusEditUser = 'Activo'
    this.ListAllInfo = false
    this.RoleUser = "Auditor";
  }

  ngOnInit() {
  }
  openFormAuditors() {
    this.EditAuditor = false
    this.addAuditor ? this.addAuditor = false : this.addAuditor = true
    this.ListAllInfo ? this.ListAllInfo = false : this.ListAllInfo = true


  }

  receiveMessage($event) {
    console.log('llegaaaaaaa');
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
        default:
          break
      }
    } else {

    }
  }

  editAuditorUser(data): void {

    this.dataUserToEdit = "jaujauaujauja"
    this.ListAllInfo = true
    this.addAuditor = false
    this.EditAuditor = true

  }

  removeAuditor(emailUser: string): void {
    alertify
      .confirm("Auditores","¿Eliminar al Auditor " + emailUser + "?",
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
