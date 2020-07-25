import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  userIsAuthenticated = false;
  private authListenSubs: Subscription;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {

    this.userIsAuthenticated = this.authService.getIsAuthenticated();

    // TODO: getAuthStatus$() is a listener  rename getAuthStatusListener()
    this.authListenSubs = this.authService.getAuthStatus$()
    .subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
    });
  }

  onLogout() {
    /* clear token and broadcast new state */
    this.authService.logoutUser();
  }
  ngOnDestroy() {
    this.authListenSubs.unsubscribe();
  }
}
