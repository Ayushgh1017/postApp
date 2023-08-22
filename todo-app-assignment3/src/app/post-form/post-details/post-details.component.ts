import { Component, Input } from '@angular/core';
import { IUser } from 'src/app/post-service.service';
@Component({
  selector: 'app-post-details',
  templateUrl: './post-details.component.html',
  styleUrls: ['./post-details.component.css']
})
export class PostDetailsComponent {
  @Input() selectedPost: IUser | null = null;
}