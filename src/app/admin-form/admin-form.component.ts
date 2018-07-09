import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-form',
  templateUrl: './admin-form.component.html',
  styleUrls: ['./admin-form.component.css']
})
export class AdminFormComponent implements OnInit {
  hrefImageUploaded;
  
  constructor() {

    this.hrefImageUploaded='assets/images/noimage.png';
    
   }
  fileToUpload: File = null;
  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);

    console.log('file uploaded',files)
  }

  readUrl(event:any) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
  
      reader.onload = (event:any) => {
        this.hrefImageUploaded = event.target.result;
      }
  
      reader.readAsDataURL(event.target.files[0]);
    }
  }


  ngOnInit() {
  }

}
