import { NgModule } from '@angular/core';
import { RouterModule, Routes, provideRouter } from '@angular/router';
import { MapComponent } from './map/map.component';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
	{ path: '', component: MapComponent },
	{ path: 'login', component: LoginComponent },
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}
