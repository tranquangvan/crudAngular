import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate,Router, } from '@angular/router';
import { Observable } from 'rxjs';
import {FbService} from './service/fb/fb.service';
import {map} from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(public fb:FbService,public router:Router){

  }

  canActivate(route:ActivatedRouteSnapshot,state : RouterStateSnapshot):Observable<boolean> | boolean {
    return this.fb.isAuth().pipe(map(
      auth => {
        if(!auth){
          return true;
        }
        else {
        this.router.navigate(['/']);
        return false;
        }
      }
    ))
  }
}
