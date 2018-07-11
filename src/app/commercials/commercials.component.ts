import { Component, OnInit, Output, EventEmitter  } from '@angular/core';
import { NgForm } from '@angular/forms';
declare let alertify: any;

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
  RoleUser:string;
  editSeller: boolean
  dataUserToEdit = "asdasdasdasd"
  ListAllInfo: boolean
  constructor() {
    this.editSeller = false
    this.hrefImageUploaded = 'assets/images/noimage.png';
    this.ExistUser = false
    this.NotEqualsPassword = false
    this.checkedActivoUser = true
    this.modusEditUser = 'Activo'
    this.ListAllInfo = false
    this.RoleUser="Commercial"
  }

  ngOnInit() {
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
        default:
          break
      }
    } else {

    }
  }

  editSellerUser(data): void {

    this.dataUserToEdit = "jaujauaujauja"
    this.ListAllInfo =true
    this.addSeller = false
    this.editSeller = true

  }

  removeSeller(emailUser: string): void {
    alertify
      .confirm("Comerciales","¿Eliminar al Comercial " + emailUser + "?",
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
