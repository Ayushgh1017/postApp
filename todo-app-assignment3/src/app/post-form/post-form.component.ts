import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { ApiCallService } from '../api-call.service';
import { IUser } from '../post-service.service';
import { PostService } from '../post-service.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-post-form',
  templateUrl: './post-form.component.html',
  styleUrls: ['./post-form.component.css']
})
export class PostFormComponent {
  @Input() selectedPost: IUser | null = null;
  postForm: FormGroup;
  newPost!: IUser;

  @Output() submitPost = new EventEmitter<IUser | null>();

  constructor(private apiCallService: ApiCallService, private postService: PostService, private fb: FormBuilder) {
    this.postForm = this.fb.group({
      title: ['', Validators.required],
      body: ['', Validators.required]
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedPost'] && changes['selectedPost'].currentValue) {
      this.postForm.setValue({
        title: changes['selectedPost'].currentValue.title,
        body: changes['selectedPost'].currentValue.body
      });
    }
  }

  onSubmit() {
    const postData = this.postForm.value;
    if (postData.body!= null && postData.title!= null) {
      this.apiCallService.post('https://jsonplaceholder.typicode.com/posts', postData).subscribe((response: any) => {
        this.newPost = {
          userId: response.userId,
          id: response.id,
          title: postData.title,
          body: postData.body
        };
        if (this.newPost.body!= null && this.newPost.title!= null) {
          this.submitPost.emit(this.newPost);
          this.postService.addPost(this.newPost);
        }
        this.resetForm();
      });
    }
  }

  edit() {
    const postData = this.postForm.value;
    this.selectedPost!.title = postData.title;
    this.selectedPost!.body = postData.body;
    this.submitPost.emit(this.selectedPost);
  }

  resetForm() {
    this.postForm.reset();
    this.selectedPost = null;
  }
}