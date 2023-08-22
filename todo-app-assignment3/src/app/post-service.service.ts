import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { EventEmitter } from '@angular/core';
import { ApiCallService } from './api-call.service';

export interface IUser {
  userId: number;
  id: number;
  title: string;
  body: string;
}

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private posts: IUser[] = [];
  private postsSubject = new BehaviorSubject<IUser[]>([]);
  newPostCreated = new EventEmitter<IUser>();

  constructor(private http: HttpClient, private apiService:ApiCallService) {
    this.getPostsFromApi();
  }

  private getPostsFromApi() {
    this.http.get<IUser[]>('https://jsonplaceholder.typicode.com/posts').subscribe(posts => {
      this.posts = posts;
      this.postsSubject.next(this.posts);
    });

    this.newPostCreated.subscribe(newPost => {
      if (newPost.body != null && newPost.title != null) {
        this.posts.push(newPost);
        this.postsSubject.next(this.posts);
      }
    });
  }

  addPost(post: IUser) {
    if (post.body != null && post.title != null) {
      this.newPostCreated.emit(post);
    }
  }

  getPosts(): Observable<IUser[]> {
    return this.postsSubject.asObservable();
  }
}
