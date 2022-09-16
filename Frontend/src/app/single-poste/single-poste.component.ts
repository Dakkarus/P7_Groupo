import { Component, OnInit } from '@angular/core';
import { Poste } from '../models/Poste.model';
import { PostesService } from '../services/postes.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { catchError, EMPTY, map, Observable, of, switchMap, take, tap } from 'rxjs';

@Component({
  selector: 'app-single-poste',
  templateUrl: './single-poste.component.html',
  styleUrls: ['./single-poste.component.scss']
})
export class SinglePosteComponent implements OnInit {

  loading!: boolean;
  poste$!: Observable<Poste>;
  userId!: string;
  name!:string;
  likePending!: boolean;
  liked!: boolean;
  disliked!: boolean;
  errorMessage!: string;

  constructor(private postes: PostesService,
    private route: ActivatedRoute,
    private auth: AuthService,
    private router: Router) { }

  ngOnInit() {
    this.name = this.auth.getName();
    this.userId = this.auth.getUserId();
    this.loading = true;
    this.userId = this.auth.getUserId();
    this.poste$ = this.route.params.pipe(
      map(params => params['id']),
      switchMap(id => this.postes.getPosteById(id)),
      tap(poste => {
        this.loading = false;
        if (poste.usersLiked.find(user => user === this.userId)) {
          this.liked = true;
        } else if (poste.usersDisliked.find(user => user === this.userId)) {
          this.disliked = true;
        }
      })
    );
  }

  onLike() {
    if (this.disliked) {
      return;
    }
    this.likePending = true;
    this.poste$.pipe(
      take(1),
      switchMap((poste: Poste) => this.postes.likePoste(poste._id, !this.liked).pipe(
        tap(liked => {
          this.likePending = false;
          this.liked = liked;
        }),
        map(liked => ({ ...poste, likes: liked ? poste.likes + 1 : poste.likes - 1 })),
        tap(poste => this.poste$ = of(poste))
      )),
    ).subscribe();
  }

  onDislike() {
    if (this.liked) {
      return;
    }
    this.likePending = true;
    this.poste$.pipe(
      take(1),
      switchMap((poste: Poste) => this.postes.dislikePoste(poste._id, !this.disliked).pipe(
        tap(disliked => {
          this.likePending = false;
          this.disliked = disliked;
        }),
        map(disliked => ({ ...poste, dislikes: disliked ? poste.dislikes + 1 : poste.dislikes - 1 })),
        tap(poste => this.poste$ = of(poste))
      )),
    ).subscribe();
  }

  onBack() {
    this.router.navigate(['/postes']);
  }

  onModify() {
    this.poste$.pipe(
      take(1),
      tap(poste => this.router.navigate(['/modify-poste', poste._id]))
    ).subscribe();
  }

  onDelete() {
    this.loading = true;
    this.poste$.pipe(
      take(1),
      switchMap(poste => this.postes.deletePoste(poste._id)),
      tap(message => {
        console.log(message);
        this.loading = false;
        this.router.navigate(['/postes']);
      }),
      catchError(error => {
        this.loading = false;
        this.errorMessage = error.message;
        console.error(error);
        return EMPTY;
      })
    ).subscribe();
  }
}
