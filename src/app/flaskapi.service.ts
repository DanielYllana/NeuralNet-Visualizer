import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { Layer, Model } from './neural-net/layer.model';
import { AuthService } from './auth/auth.service';
import { Subscription } from 'rxjs';
import { io } from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class FlaskapiService implements OnInit, OnDestroy {
  constructor(
    private httpClient: HttpClient,
    private authService: AuthService
  ) {
    this.userSub = this.authService.user.subscribe((user) => {
      this.isAuth = !!user;
      this.user = user;
    });
  }

  public server: string = 'http://localhost:5000';
  private userSub: Subscription;
  isAuth: boolean = false;
  user: any;
  username: string;

  ngOnInit() {}

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }

  

  //      HTTP REQUESTS FOR DATABASES MANAGEMENT

  public getModel(model: Model) {
    return this.httpClient.get<Model>(
      this.server + '/api/getModel/' + this.getUsername()
    );
  }

  public trainModel() {
    return this.httpClient
      .post(this.server + '/api/trainModel/', null)
      .subscribe();
  }

  public manageModel(model: Model) {
    console.log(JSON.stringify(model));
    const formData: FormData = new FormData();
    formData.append('model', JSON.stringify(model));

    if (this.isAuth) {
      console.log('Managing DB');
      return this.httpClient
        .post(this.server + '/api/manageLayer/' + this.getUsername(), formData)
        .subscribe();
    }
  }

  getUsername() {
    if (this.user != null) {
      return String(this.user._token);
    } else {
      return 'Guest';
    }
  }
}
