import { HttpClient } from '@angular/common/http';
import { Component, Input } from '@angular/core';
interface IComment {
  postId: number,
  id: number,
  name: string,
  email: string,
  body: string
}

@Component({
  selector: 'app-post-comments',
  templateUrl: './post-comments.component.html',
  styleUrls: ['./post-comments.component.css']
})
export class PostCommentsComponent {
  @Input() postId!: number ;
  @Input() userId!: number | null ;
  comments: IComment[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit() {
    if (this.postId) {
      this.fetchComments();
    }
  }

  fetchComments() {
    const url = `https://jsonplaceholder.typicode.com/posts/${this.userId}/comments`;
    this.http.get<IComment[]>(url).subscribe(comments => {
       this.comments = comments.filter(comment => comment.postId === this.userId);
      
    });
  }
}
