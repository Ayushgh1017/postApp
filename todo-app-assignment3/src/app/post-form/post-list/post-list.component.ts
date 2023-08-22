import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { PostService } from 'src/app/post-service.service';
import { ApiCallService } from 'src/app/api-call.service';

interface IUser {
  userId: number;
  id: number;
  title: string;
  body: string;
}

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})

export class PostListComponent implements OnInit {
  @Input() newPost: IUser | null = null;
  @Output() editSelectedPost = new EventEmitter<IUser>();
  
  posts: IUser[] = [];
  selectedPost!: IUser | null;

  constructor(private postService: PostService, private apiService:ApiCallService) {}

  ngOnInit() {
    this.editSelectedPost.subscribe(updatedPost => {
      this.editPostInList(updatedPost);
    });

    this.postService.getPosts().subscribe(posts => {
      this.posts = posts;
    });
  }


  loadDetails(post: IUser) {
    this.selectedPost = post;
  }

  editPost(updatedPost: IUser) {
    if (this.selectedPost !== null) {
      this.selectedPost = updatedPost;
      this.editSelectedPost.emit(updatedPost);
    }
  }

  deletePost(postToDelete: IUser) {
    this.apiService.delete('https://jsonplaceholder.typicode.com/posts',postToDelete);
    this.posts = this.posts.filter(post => post.id !== postToDelete.id);
  }

  
  private editPostInList(updatedPost: IUser) {
    this.apiService.put('https://jsonplaceholder.typicode.com/posts',updatedPost);
    const index = this.posts.findIndex(post => post.id === updatedPost.id);
    if (index !== -1) {
      this.posts[index] = updatedPost;
    }
  }
}
