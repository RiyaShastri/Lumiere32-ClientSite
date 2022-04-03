import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateChild,
  Router,
  RouterStateSnapshot,
} from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class WildCardGuardService implements CanActivateChild {
  constructor(private router: Router) {}

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) {

    if (state.url.search('my') < 0) {
      this.router.navigateByUrl('my/login');
      // this.router.navigateByUrl('my/page-not-found');
    }
    return true;
  }
}
