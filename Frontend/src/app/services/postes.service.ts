import { Injectable } from '@angular/core';
import { catchError, mapTo, of, Subject, tap, throwError } from 'rxjs';
import { Poste } from '../models/Poste.model';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PostesService {

  postes$ = new Subject<Poste[]>();

  constructor(private http: HttpClient,
              private auth: AuthService) {}

  getPostes() {
    this.http.get<Poste[]>('http://localhost:3000/api/postes').pipe(
      tap(postes => this.postes$.next(postes)),
      catchError(error => {
        console.error(error.error.message);
        return of([]);
      })
    ).subscribe();
  }

  getPosteById(id: string) {
    return this.http.get<Poste>('http://localhost:3000/api/postes/' + id).pipe(
      catchError(error => throwError(error.error.message))
    );
  }

  likePoste(id: string, like: boolean) {
    return this.http.post<{ message: string }>(
      'http://localhost:3000/api/postes/' + id + '/like',
      { userId: this.auth.getUserId(), like: like ? 1 : 0 }
    ).pipe(
      mapTo(like),
      catchError(error => throwError(error.error.message))
    );
  }

  dislikePoste(id: string, dislike: boolean) {
    return this.http.post<{ message: string }>(
      'http://localhost:3000/api/postes/' + id + '/like',
      { userId: this.auth.getUserId(), like: dislike ? -1 : 0 }
    ).pipe(
      mapTo(dislike),
      catchError(error => throwError(error.error.message))
    );
  }

  createPoste(poste: Poste, image: File) {
    const formData = new FormData();
    formData.append('poste', JSON.stringify(poste));
    formData.append('image', image);
    return this.http.post<{ message: string }>('http://localhost:3000/api/postes', formData).pipe(
      catchError(error => throwError(error.error.message))
    );
  }

  modifyPoste(id: string, poste: Poste, image: string | File) {
    if (typeof image === 'string') {
      return this.http.put<{ message: string }>('http://localhost:3000/api/postes/' + id, poste).pipe(
        catchError(error => throwError(error.error.message))
      );
    } else {
      const formData = new FormData();
      formData.append('poste', JSON.stringify(poste));
      formData.append('image', image);
      return this.http.put<{ message: string }>('http://localhost:3000/api/postes/' + id, formData).pipe(
        catchError(error => throwError(error.error.message))
      );
    }
  }

  deletePoste(id: string) {
    return this.http.delete<{ message: string }>('http://localhost:3000/api/postes/' + id).pipe(
      catchError(error => throwError(error.error.message))
    );
  }
}
