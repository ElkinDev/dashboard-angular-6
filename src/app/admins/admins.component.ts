import { Component, OnInit } from '@angular/core';
import {adminsService} from './admins.service'
import * as socketIo from 'socket.io-client';


@Component({
  selector: 'app-admins',
  templateUrl: './admins.component.html',
  styleUrls: ['./admins.component.css']
})
export class AdminsComponent implements OnInit {
  loadingMore:boolean
  addAdmin=false
  hrefImageUploaded;

  constructor() { 
    this.hrefImageUploaded='assets/images/noimage.png'
  }

  ngOnInit() {
    this.loadingMore=false
    this.hrefImageUploaded='assets/images/noimage.png'
  }
  openFormAdmins(){
    this.addAdmin ? this.addAdmin=false: this.addAdmin=true

  }

}
