import { Component, Injectable, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
@Injectable({ providedIn: 'root' })
export class headerComponenet implements OnInit, OnDestroy {
  isAuth = false;
  username: string;
  user: any;
  private userSub: Subscription;

  constructor(
    //private dataStorageService: DataStorageSerive,
    private authService: AuthService,
    private router: Router
  ) {}

  onSaveData() {
    // console.log(this.userSub.)
    //this.dataStorageService.storeRecipes();
  }

  ngOnInit() {
    this.userSub = this.authService.user.subscribe((user) => {
      this.isAuth = !!user;
      this.user = user;
    });
  }

  getUsername() {
    if (this.user != null) {
      this.username = String(this.user.email.split('@', 1));
    } else {
      this.username = 'Guest';
    }

    return this.username;
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }

  signIn() {
    this.router.navigate(['/auth']);
  }

  onFetchData() {
    //this.dataStorageService.fetchRecipes().subscribe();
  }

  onLogout() {
    this.authService.logout();
  }
}
