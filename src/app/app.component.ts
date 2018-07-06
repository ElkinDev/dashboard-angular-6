import { Component,OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { FunctionsService } from './functions.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(private router: Router,
    private FunctionsService: FunctionsService
  ) {

  }
  title = 'app';
  onActivate(event) {
    window.scroll(0, 0);
  }
  ngOnInit() {
    this.FunctionsService.initSocket()
  }

  
}
