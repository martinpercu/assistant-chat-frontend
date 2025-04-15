import { Injectable, inject, signal } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile, user } from '@angular/fire/auth';

import { User } from '@models/user';
import { Observable, from } from 'rxjs';

import { UserService } from '@services/user.service'

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  firebaseAuth = inject(Auth);
  userService = inject(UserService)
  user$ = user(this.firebaseAuth);
  currentUserSig = signal<User | null | undefined>(undefined);

  user!: User;

  constructor() { }

  register(
    email: string,
    username: string,
    password: string,
  ): Observable<void> {
    const promise = createUserWithEmailAndPassword(
      this.firebaseAuth,
      email,
      password,
    ).then((response) => {
      updateProfile(response.user, { displayName: username })
      this.addRegisterUsed(email, username)
    }
    );
    return from(promise);
  };

  addRegisterUsed(email: string, username: string) {
    this.user = {
      email: email,
      username: username
    }
    this.userService.addUser(this.user)
  }

  login(email: string, password: string) {
    const promise = signInWithEmailAndPassword(
      this.firebaseAuth,
      email,
      password
    ).then(() => {});
    return from(promise)
  }

  logout(): Observable<void> {
    const promise = signOut(this.firebaseAuth);
    return from(promise)
  }

}
