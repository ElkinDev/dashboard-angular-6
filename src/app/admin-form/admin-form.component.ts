import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-users-form',
  templateUrl: './admin-form.component.html',
  styleUrls: ['./admin-form.component.css']
})
export class AdminFormComponent implements OnInit {
  hrefImageUploaded;
  ExistUser: boolean;
  checkedActivoUser: boolean = true;
  modusNewUser: string;
  newUser: NgForm;
  nameUserPhoto;
  fileToUpload: File = null;
  NotEqualsPassword;
  fileImage;
  @Output() CloseFormtUserAdmin = new EventEmitter<object>();
  @Input() rolUser: string;

  constructor() {

    this.hrefImageUploaded = 'assets/images/noimage.png';
    this.ExistUser = false;
    this.checkedActivoUser = true;
    this.modusNewUser = 'Activo';
    this.NotEqualsPassword = false;
    this.fileImage = null;
  }
  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);

    console.log('file uploaded', files)
  }

  readUrl(event: any) {
    if (event.target.files && event.target.files[0]) {
      this.fileImage = event.target.files[0];
      this.nameUserPhoto = this.fileImage.name;
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.hrefImageUploaded = event.target.result;
      }
      reader.readAsDataURL(event.target.files[0]);

    }
  }
  onSubmitNewUser(newUser: NgForm): void {
    var dataSend = newUser.value;
    dataSend.status = dataSend.status == null ? false : dataSend.status;
    if (newUser.value.password == newUser.value.passwordRepeat) {
      this.nameUserPhoto ? dataSend.imgProfile = this.nameUserPhoto : null;
      dataSend.imageProfileFile = this.fileImage
      let data = {
        type: 'function',
        event: 'SubmitNewUser',
        data: dataSend
      }
      this.CloseFormtUserAdmin.emit(data)
      newUser.resetForm(); // or form.reset();
      this.hrefImageUploaded = 'assets/images/noimage.png';

      this.modusNewUser = 'Inactivo'
    } else {
      this.NotEqualsPassword = true
    }

  }

  disabledPassErr(): void {
    this.NotEqualsPassword = false

  }

  changeModusUser() {
    this.modusNewUser === 'Activo' ? this.modusNewUser = 'Inactivo' : this.modusNewUser = 'Activo'
  }
  clearForm() {
    this.hrefImageUploaded = 'assets/images/noimage.png';
    let data = {
      type: 'function',
      event: 'CloseFormAdmins'
    }
    this.CloseFormtUserAdmin.emit(data)
    this.modusNewUser = 'Inactivo'

  }
  ngOnInit() {
    console.log(this.rolUser)
  }

}
