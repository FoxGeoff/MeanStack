import { AuthService } from './auth.service';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
    /* isAuth() is dead code used in 'fitness app */
    if (this.authService.getIsAuthenticated) {
      return true;
    } else {
      this.router.navigate(['/login']);
      console.log('Redirected to login page!');
    }
  }
}
// register in app.routing.module
