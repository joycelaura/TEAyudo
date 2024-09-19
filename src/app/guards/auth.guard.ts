import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UtilsService } from '../services/utils.service';
import { FirestoreService } from '../services/firestore.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  firebaseSvc = inject(FirestoreService);
  utilSvc = inject(UtilsService);

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
      let user = localStorage.getItem('user');
    
    
      return  new Promise((resolve) => {
        
        this.firebaseSvc.getAuth().onAuthStateChanged((auth) => {

          if(auth){
            if(user){
              resolve(true);
            }
            else{
              this.firebaseSvc.signOut;
              resolve(false);
            }
          }
        })

      });
  }
  
}
