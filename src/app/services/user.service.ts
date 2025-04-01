import { Injectable, inject } from '@angular/core';
import { Firestore, addDoc, collection, collectionData,deleteDoc, doc, setDoc, updateDoc } from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import { User } from '@models/user';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  firestore = inject(Firestore);
  usersCollection = collection(this.firestore, 'users');


  constructor() { }


  addUserWithId(user: User, userId: any) {
    const usersRef = collection(this.firestore, 'users');
    return setDoc(doc(usersRef, userId), user)
  };

  deleteUser(user: User) {
    const userDocRef = doc(this.firestore, `users/${user.userUID}`);
    return deleteDoc(userDocRef)
  };

  updateOneUser(user: any, userId: string) {
    const userDocRef = doc(this.firestore, 'users', userId);
    updateDoc(userDocRef, user)
      .then(() => {
        console.log('User updated');
        // alert('User Updated');
      })
      .catch((error) => {
        console.log(error);
      })
  };

  // updateUser(
  //   todoId: string,
  //   dataToUpdate: { text: string; isCompleted: boolean }
  // ): Observable<void> {
  //   const docRef = doc(this.firestore, 'users/' + todoId);
  //   const promise = setDoc(docRef, dataToUpdate);
  //   return from(promise);
  // }


  // getUsers(): Observable<User[]> {
  //   return collectionData(this.usersCollection, {
  //     idField: 'id',
  //   }) as Observable<User[]>;
  // };

  // addUser(text: string): Observable<string> {
  //   const userToCreate = { text, isCompleted: false };
  //   const promise = addDoc(this.usersCollection, todoToCreate).then(
  //     (response) => response.id
  //   );
  //   return from(promise);
  // }

  // removeUser(todoId: string): Observable<void> {
  //   const docRef = doc(this.firestore, 'users/' + todoId);
  //   const promise = deleteDoc(docRef);
  //   return from(promise);
  // }


}
