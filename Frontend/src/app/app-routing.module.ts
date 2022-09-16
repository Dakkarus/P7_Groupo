import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PosteListComponent } from './poste-list/poste-list.component';
import { PosteFormComponent } from './poste-form/poste-form.component';
import { SinglePosteComponent } from './single-poste/single-poste.component';
import { SignupComponent } from './auth/signup/signup.component';
import { LoginComponent } from './auth/login/login.component';
import { AuthGuard } from './services/auth-guard.service';

const routes: Routes = [
  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent },
  { path: 'postes', component: PosteListComponent, canActivate: [AuthGuard] },
  { path: 'poste/:id', component: SinglePosteComponent, canActivate: [AuthGuard] },
  { path: 'new-poste', component: PosteFormComponent, canActivate: [AuthGuard] },
  { path: 'modify-poste/:id', component: PosteFormComponent, canActivate: [AuthGuard] },
  { path: '', pathMatch: 'full', redirectTo: 'postes'},
  { path: '**', redirectTo: 'postes' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
