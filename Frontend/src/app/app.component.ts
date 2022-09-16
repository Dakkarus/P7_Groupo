import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Observable, shareReplay } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  isAuth$!: Observable<boolean>;

  constructor(private auth: AuthService) { }

  ngOnInit() {
    this.isAuth$ = this.auth.isAuth$.pipe(
      shareReplay(1)
    );
  }

  onLogout() {
    this.auth.logout();
  }
}

