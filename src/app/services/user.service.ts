import { Injectable, inject, signal } from '@angular/core';
import { Firestore, addDoc, collection, collectionData, getDoc, deleteDoc, doc, setDoc, updateDoc, DocumentSnapshot, DocumentData } from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import { User } from '@models/user';

// import { AuthService } from './auth.service';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  firestore = inject(Firestore);
  usersCollection = collection(this.firestore, 'users');

  // authService = inject(AuthService);

  userSig = signal<User | null>(null);

  user!: User;
  userID!: string;

  constructor() {
   }


  addUserWithId(user: User, userId: any) {
    const usersRef = collection(this.firestore, 'users');
    return setDoc(doc(usersRef, userId), user)
  };

  // getUserById(userId: any) {
  //   const usersRef = collection(this.firestore, 'users');
  //   const userDoc = doc(usersRef, userId);
  //   return getDoc(userDoc);
  // };

  async getUserById(userId: string): Promise<User | undefined> {
    const usersRef = collection(this.firestore, 'users');
    const userDoc = doc(usersRef, userId);
    const userSnapshot: DocumentSnapshot<DocumentData> = await getDoc(userDoc);

    if (userSnapshot.exists()) {
      return userSnapshot.data() as User;
    }
    return undefined; // Return undefined if the user doesn't exist
  }

  async getOneUser(userId: string) {
    // const clientDocRef = doc(this.firestore, `clientsjoinedlist/${clientId}`);
    const usersRef = doc(this.firestore, 'users', userId);
    console.log(usersRef);
    const user = (await getDoc(usersRef)).data();
    console.log(user);
    return user as User
  };

  // async setUser() {
  //   try {
  //     const user = await this.getUserById(this.userID);
  //     if (user) {
  //       console.log(user);
  //       // console.log(user.username); // TypeScript knows this is a User object
  //       this.user = user
  //     } else {
  //       console.log('User not found');
  //     }
  //   } catch (error) {
  //     console.error('Error fetching user:', error);
  //   }
  // }


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
