import { Routes } from '@angular/router';

import {HomeComponent} from './pages/home/home.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { DashboardAirportsComponent } from './pages/dashboard/airports/airports.component';
import { DashboardModelPlanesComponent } from './pages/dashboard/model-planes/model-planes.component';
import { AirportEditComponent } from './pages/dashboard/airports/airport-edit.component';
import { ModelPlaneEditComponent } from './pages/dashboard/model-planes/model-planes-edit.component';
import {AuthGuard} from './guards/auth.guards';
import {LoginComponent} from './features/user/login-component/login-component.component';
import { DashboardPlanesComponent } from './pages/dashboard/planes/planes.component';
import { PlaneEditComponent } from './pages/dashboard/planes/planes-edit.component';
import { ReservationComponent } from './pages/reservation/reservation.component';
import { DashboardFlightsComponent } from './pages/dashboard/flights/flights.component';
import { FlightEditComponent } from './pages/dashboard/flights/flights-edit.component';
import { ReservationSearchComponent } from './pages/reservation/reservation-search.component';
import { AdminGuard } from './guards/admin.guards';
import { RegisterComponent } from './features/user/register-component/register-component.component';


export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'reservation', component: ReservationSearchComponent, canActivate: [AuthGuard] },
  { path: 'reservation/:flightId', component: ReservationComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'dashboard/airports', component: DashboardAirportsComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'dashboard/airports/edit/:id', component: AirportEditComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'dashboard/model-planes', component: DashboardModelPlanesComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'dashboard/model-planes/edit/:id', component: ModelPlaneEditComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'dashboard/planes', component: DashboardPlanesComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'dashboard/planes/edit/:id', component: PlaneEditComponent, canActivate: [AuthGuard, AdminGuard]},
  { path: 'dashboard/flights', component: DashboardFlightsComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'dashboard/flights/edit/:id', component: FlightEditComponent, canActivate: [AuthGuard, AdminGuard] },
];
