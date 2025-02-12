import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '@services/login/login.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {
  isLoggedIn = false;

  constructor(private router: Router, private loginService: LoginService) {}

  ngOnInit() {
    this.isLoggedIn = this.loginService.isAuthenticated();
    if (!this.isLoggedIn && this.router.url.indexOf('account') === -1) {
      this.router.navigate(['/account/login']);
    }
  }

  logUserOut() {
    this.loginService.hardLogout(true); // include removing Social Auth
    this.isLoggedIn = this.loginService.isAuthenticated();
  }
}
