import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { RouterModule, Route, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import {FunctionsService} from './functions.service';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NavbarAsideComponent } from './navbar-aside/navbar-aside.component';
import { HeaderComponent } from './header/header.component';
import { AdminsComponent } from './admins/admins.component';
import { CommercialsComponent } from './commercials/commercials.component';
import { AuditorComponent } from './auditor/auditor.component';
import { CustomersCompaniesComponent } from './customers-companies/customers-companies.component';
import { CustomersPeopleComponent } from './customers-people/customers-people.component';
import { FilterPlansComponent } from './filter-plans/filter-plans.component';
import { FilterRolesComponent } from './filter-roles/filter-roles.component'
export const appRoutes:Routes = [
  { path: '', redirectTo: '/Dashboard', pathMatch: 'full' },
  {
    path:'login',
    component:LoginComponent,
    
  },
  {
    path:'Dashboard/users/admins',
    component:AdminsComponent,
  },
  {
    path:'Dashboard/users/sellers',
    component:CommercialsComponent,
  },
  {
    path:'Dashboard/users/auditors',
    component:AuditorComponent,
  },
  {
    path:'Dashboard/customers/companies',
    component:CustomersCompaniesComponent,
  },
  {
    path:'Dashboard/customers/people',
    component:CustomersPeopleComponent,
  },
  {
    path:'Dashboard/filters/plans',
    component:FilterPlansComponent,
  },
  {
    path:'Dashboard/filters/roles',
    component:FilterRolesComponent,
  },
  {
    path:'Dashboard',
    component:DashboardComponent,
  }

];
@NgModule({
  declarations: [
    AppComponent,
      LoginComponent,
      DashboardComponent,
        NavbarAsideComponent,
        HeaderComponent,
          AdminsComponent,
          CommercialsComponent,
          AuditorComponent,
          CustomersCompaniesComponent,
          CustomersPeopleComponent,
          FilterPlansComponent,
          FilterRolesComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    FormsModule,
  ],
  providers: [FunctionsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
