import { Routes } from '@angular/router';

import {HomeComponent} from './pages/home/home.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { DashboardAirportsComponent } from './pages/dashboard/airports/airports.component';
import { DashboardModelPlanesComponent } from './pages/dashboard/model-planes/model-planes.component';
import { AirportEditComponent } from './pages/dashboard/airports/airport-edit.component';
import { ModelPlaneEditComponent } from './pages/dashboard/model-planes/model-planes-edit.component';
import {AuthGuard} from './guards/auth.guards';
import {LoginComponent} from './features/user/login-component/login-component.component';


export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'dashboard/airports', component: DashboardAirportsComponent, canActivate: [AuthGuard] },
  { path: 'dashboard/airports/edit/:id', component: AirportEditComponent, canActivate: [AuthGuard] },
  { path: 'dashboard/model-planes', component: DashboardModelPlanesComponent, canActivate: [AuthGuard] },
  { path: 'dashboard/model-planes/edit/:id', component: ModelPlaneEditComponent, canActivate: [AuthGuard] },
];
