import { Component, OnInit } from '@angular/core';
import { PostesService } from '../services/postes.service';
import { catchError, Observable, of, tap } from 'rxjs';
import { Poste } from '../models/Poste.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-poste-list',
  templateUrl: './poste-list.component.html',
  styleUrls: ['./poste-list.component.scss']
})
export class PosteListComponent implements OnInit {
  postes$!: Observable<Poste[]>;
  loading!: boolean;
  errorMsg!: string;

  constructor(private poste: PostesService,
              private router: Router) { }

  ngOnInit() {
    this.loading = true;
    this.postes$ = this.poste.postes$.pipe(
      tap(() => {
        this.loading = false;
        this.errorMsg = '';
      }),
      catchError(error => {
        this.errorMsg = JSON.stringify(error);
        this.loading = false;
        return of([]);
      })
    );
    this.poste.getPostes();
  }

  onClickPoste(id: string) {
    this.router.navigate(['poste', id]);
  }

}
