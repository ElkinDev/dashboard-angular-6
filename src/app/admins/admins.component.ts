import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { adminsService } from './admins.service';
import { NgForm } from '@angular/forms';
import { environment } from '../../environments/environment';
import { environmentProd } from '../../environments/environment.prod';

declare let alertify: any;

@Component({
  selector: 'app-admins',
  templateUrl: './admins.component.html',
  styleUrls: ['./admins.component.css']
})
export class AdminsComponent implements OnInit {
  hrefImageUploaded;
  ExistUser: boolean;
  NotEqualsPassword: boolean;
  checkedActivoUser: boolean = true;
  modusEditUser: string;
  loadingMore: boolean;
  addAdmin = false;
  RoleUser: string;
  EditAdmin: boolean;
  dataUserToEdit = "asdasdasdasd";
  ListAllInfo: boolean;
  ListAdmins;
  urlMainServer;
  @Output() CloseFormtUserAdmin = new EventEmitter<object>();

  constructor(private _adminService: adminsService) {
    this.EditAdmin = false
    this.hrefImageUploaded = '/assets/images/noimage.png';
    this.ExistUser = false
    this.NotEqualsPassword = false
    this.checkedActivoUser = true
    this.modusEditUser = 'Activo'
    this.ListAllInfo = false
    this.RoleUser = "Administrador";
    this.loadingMore = true;
    this.urlMainServer=environment.ws_url+'/public'
  }

  ngOnInit() {
    this._adminService.getAllAdmins().then((res) => {
      if (!res.err) {
        this.ListAdmins = res.data;
        setTimeout(() => {
          this.loadingMore = false;
        }, 1000)
      } else {
        this.ListAdmins = null
      }
    }, (err) => {
      console.log(err, 'cuaaal es')
    })

  }
  openFormAdmins() {
    this.EditAdmin = false
    this.addAdmin ? this.addAdmin = false : this.addAdmin = true
    this.ListAllInfo ? this.ListAllInfo = false : this.ListAllInfo = true


  }

  receiveMessage($event) {
    console.log('llegaaaaaaa');
    if ($event.type == 'function') {
      switch ($event.event) {
        case 'CloseFormAdmins':
          if ($event.formType) {
            this.ListAllInfo = false

            this.EditAdmin ? this.EditAdmin = false : this.EditAdmin = true

          } else {
            this.addAdmin ? this.addAdmin = false : this.addAdmin = true
            this.ListAllInfo = false

          }
          break;
        default:
          break
      }
    } else {

    }
  }

  editAdminUser(data): void {

    this.dataUserToEdit = "jaujauaujauja"
    this.ListAllInfo = true
    this.addAdmin = false
    this.EditAdmin = true

  }

  removeAdmin(emailUser: string): void {
    alertify
      .confirm("Administradores", "¿Eliminar al Administrador " + emailUser + "?",
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

    this.EditAdmin ? this.EditAdmin = false : this.EditAdmin = true
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
