import { Component,OnInit } from '@angular/core';
import { Router } from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(private router: Router) {

  }
  title = 'app';
  onActivate(event) {
    window.scroll(0, 0);
   

  }
  ngOnInit() {
    // this.router.navigate(['/login']);
    
  }

  
}
