import { Component, OnInit, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { WebSocketService } from '../websocket.service';
import { CommercialsService } from './commercials-service.service';
import { FunctionsService } from '../functions.service';
declare let alertify: any;
import { NgForm, ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
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
  ListAllInfo: boolean;
  listCommercials;
  urlMainServer;
  messageErrorQuery;
  today;
  nameUserPhoto;
  indexNowEdit;
  hrefImageUpload2;
  ListSellerNull;
  senData;
  sendImage;
  fileImageEdit;
  idUserEditNow;
  urlMainServerPhotos;
  session;
  EditUser = new FormGroup({
    nit: new FormControl(),
    imgProfile: new FormControl(),
    nombre: new FormControl(),
    apellido: new FormControl(),
    mail: new FormControl(),
    checModusEdit: new FormControl(),

  });

  constructor(private _commercialService: CommercialsService, private cdRef: ChangeDetectorRef, private _FunctionsService: FunctionsService, private _wsSocket: WebSocketService) {
    this.editSeller = false;
    this.ExistUser = false;
    this.NotEqualsPassword = false;
    this.checkedActivoUser = true;
    this.modusEditUser = 'Activo';
    this.ListAllInfo = false;
    this.RoleUser = "comercial";
    this.loadingMore = true;
    this.urlMainServerPhotos = environment.ws_url + '/public/dashboard/assets/images/'
    this.urlMainServer = environment.ws_url + '/public/imgs/'
    this.today = Date.now();
    this.indexNowEdit = null;
    this.nameUserPhoto = null;
    this.hrefImageUpload2 = this.urlMainServer + 'noimage.png';
    this.hrefImageUploaded = this.urlMainServer + 'noimage.png';
    this.listCommercials = [];
    this.senData = null;
    this.sendImage = null;
    this.fileImageEdit = null;
    this.idUserEditNow = null;
    this.session = this._FunctionsService.returnCurrentSession()

  }
  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }
  ngOnInit() {
    this._commercialService.getAllCommercials().then((res) => {
      console.log('traaeme el res', res)
      if (!res) {
        this.listCommercials = []
        this.ListSellerNull = true;

        this.messageErrorQuery = "No Hay resultados"

      } else {
        this.listCommercials = res;
      }

      setTimeout(() => {
        this.loadingMore = false;
      }, 1000)

    }, (err) => {
      this.listCommercials = [];
      this.ListSellerNull = true;
      this.messageErrorQuery = err.msg ? err.msg : '¡Error inesperado, inténtelo nuevamente!';
      setTimeout(() => {
        this.loadingMore = false;
      }, 1000)

      console.log(err, 'cuaaal es')
    })

    this._wsSocket.on('createUser:' + this.RoleUser).subscribe((res) => {
      if (res.mail.match(new RegExp(this.senData.emailUser, 'gi'))) {
        this.ListSellerNull = false;
        var formdata = new FormData();
        this.senData.cedula = this.senData.nit;

        if (formdata && this.sendImage != null) {
          console.log('aqui see meteee');
          formdata.append('imgProfile', this.sendImage)
          formdata.append('id', res.id)
          formdata.append('opt', '1')
          formdata.append('mail', this.session.mail)
          formdata.append('token', this.session.token)
          this.ListSellerNull = false;
          this.senData.fecha = res.dateCreate;
          this.senData.id = res.id;
          this.listCommercials = this.listCommercials || [];
          this._FunctionsService.ajaxHttpRequest(formdata, this.progressImage, resp => {
            let resp1 = JSON.parse(resp);
            this.senData.imgProfile = resp1.imageProfile;
            console.log(resp1, 'quee nos traeeeee');
            if (this.listCommercials != [] && this.listCommercials != null) {
              let resultAdmin = this.listCommercials.find(obj => {
                return obj.emailUser === this.senData.emailUser
              });
              if (!resultAdmin) {

                this.senData.mail = this.senData.emailUser;
                this.sendImage = null;
                console.log(this.senData)
                this.listCommercials.push(this.senData)
                this.addSeller = false;
                this.ListAllInfo = false;
                this.senData = null;
                this.hrefImageUpload2 = this.urlMainServer + 'noimage.png';
                alertify.success('Usuario Creado Exitosamente');
              };
            } else {

              this.senData.mail = this.senData.emailUser;
              this.sendImage = null;
              this.listCommercials.push(this.senData)
              this.addSeller = false;
              this.ListAllInfo = false;
              this.senData = null;
              this.hrefImageUpload2 = this.urlMainServer + 'noimage.png';
              alertify.success('Usuario Creado Exitosamente');
            }





          });
        } else {
          this.senData.fecha = res.dateCreate;
          this.senData.id = res.id;
          if (this.listCommercials != [] && this.listCommercials != null) {

            let resultAdmin = this.listCommercials.find(obj => {
              return obj.emailUser === this.senData.emailUser
            });
            if (!resultAdmin) {
              this.senData.mail = this.senData.emailUser;
              this.sendImage = null;
              this.hrefImageUpload2 = this.urlMainServer + 'noimage.png';
              this.listCommercials.push(this.senData);
              this.addSeller = false;
              this.ListAllInfo = false;
              this.senData = null;
              alertify.success('Usuario Creado Exitosamente');
            };
          } else {
            this.senData.mail = this.senData.emailUser;
            this.sendImage = null;
            this.hrefImageUpload2 = this.urlMainServer + 'noimage.png';
            this.listCommercials.push(this.senData)
            this.addSeller = false;
            this.ListAllInfo = false;
            this.senData = null;
            alertify.success('Usuario Creado Exitosamente');
          }
        }
      }

    }, (error) => {

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
  progressImage(ev) {

  }
  submitNewUserAdmin(data) {
    let resd: any = null;
    this.senData = data;
    this.senData.RoleUser = this.RoleUser;
    if (this.senData.imageProfileFile != null) {
      this.sendImage = this.senData.imageProfileFile;
    }
    if (data.imgProfile) {
      this.sendImage = this.senData.imageProfileFile;
    }
    this._FunctionsService.CreateUser(this.senData, 7).then(res => {
      resd = res;
      if (resd.type == 'createdUserNew') {
        alertify.alert("Confirma el registro de usuario", function () {
          window.open(resd.link, "_blank")

        });
      }

    }, err => {
      alertify.error(err);


    })


  }
  editSellerUser(data, index): void {
    console.log(data, 'veas6erg6rea');
    this.indexNowEdit = index;
    this.EditUser.patchValue({
      nombre: data.nombre,
      apellido: data.apellido,
      nit: data.cedula,
      cedula: data.cedula,
      mail: data.mail,
      checModusEdit: data.status,
      imgProfile: null
    });

    if (data.imgProfile) {
      this.hrefImageUpload2 = data.imgProfile
    } else {
      this.hrefImageUpload2 = this.urlMainServer + 'noimage.png';
    }
    this.idUserEditNow = data.id;
    data.status ? this.modusEditUser = 'Activo' : this.modusEditUser = 'Inactivo'
    this.ListAllInfo = true
    this.addSeller = false
    this.editSeller = true


  }
  onSubmitEditUser(data: NgForm) {
    var dataSend = {
      userEdit: {
        nombre: data.value.nombre,
        apellido: data.value.apellido,
        mail: data.value.mail,
        nit: data.value.cedula,
        cedula: data.value.cedula,
        status: data.value.checModusEdit,
        id: this.idUserEditNow
      },
      opt: 5
    }
    this._FunctionsService.editUser(dataSend).then(msg => {
      let respF: any = msg;
      if (respF.type === 'updateData' && !this.fileImageEdit) {
        alertify.error('No haz realizado ningún cambio');

      }
      else {
        if (this.fileImageEdit) {

          var formdata = new FormData();
          if (formdata) {

            formdata.append('imgProfile', this.fileImageEdit)
            formdata.append('id', dataSend.userEdit.id)
            formdata.append('opt', '1')
            formdata.append('mail', this.session.mail)
            formdata.append('token', this.session.token)
            this._FunctionsService.ajaxHttpRequest(formdata, this.progressImage, resp => {
              let respF: any = JSON.parse(resp)
              console.log('traaemelloooo que es??', respF)

              this.listCommercials[this.indexNowEdit].nombre = data.value.nombre
              this.listCommercials[this.indexNowEdit].apellido = data.value.apellido
              this.listCommercials[this.indexNowEdit].status = data.value.checModusEdit
              this.listCommercials[this.indexNowEdit].mail = data.value.mail

              this.listCommercials[this.indexNowEdit].imgProfile = respF.imageProfile;
              alertify.success('Usuario ' + dataSend.userEdit.mail + ' editado exitosamente');
              this.editSeller = false;
              this.ListAllInfo = false;

            });
          }
        } else {
          this.listCommercials[this.indexNowEdit].nombre = data.value.nombre
          this.listCommercials[this.indexNowEdit].apellido = data.value.apellido
          this.listCommercials[this.indexNowEdit].status = data.value.checModusEdit
          this.listCommercials[this.indexNowEdit].mail = data.value.mail
          this.editSeller = false;
          this.ListAllInfo = false;
          alertify.success('Usuario ' + dataSend.userEdit.mail + ' editado exitosamente');
        }

      }

    }, err => {

      alertify.error(err.sjsj);


    })



  }


  removeSeller(data, index): void {

    alertify
      .confirm("Comerciales", "¿Eliminar al Comercial " + data.mail + "?",
        (() => {
          this._FunctionsService.RemoveUser(data.mail, data.id, 6).then(msg => {
            alertify.success(msg);
            this.listCommercials.splice(index, 1);
            if (this.listCommercials.length <= 0) {
              this.ListSellerNull = true;
              this.messageErrorQuery = "- Sin usuarios Comerciales -"

            }
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


  changeModusUser() {
    this.modusEditUser === 'Activo' ? this.modusEditUser = 'Inactivo' : this.modusEditUser = 'Activo'
  }
  clearForm() {

    this.editSeller ? this.editSeller = false : this.editSeller = true
    this.ListAllInfo = false



  }

  readUrl(event: any) {
    if (event.target.files && event.target.files[0]) {
      let file = event.target.files[0];
      this.fileImageEdit = event.target.files[0];
      this.nameUserPhoto = file.name;
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.hrefImageUpload2 = event.target.result;
      }
      reader.readAsDataURL(event.target.files[0]);

    }
  }

}
