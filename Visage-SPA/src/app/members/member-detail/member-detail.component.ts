import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { AlertifyService } from '../../services/alertify.service';
import { ActivatedRoute } from '@angular/router';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from '../../../../node_modules/ngx-gallery';
import { AuthService } from '../../services/auth.service';
import { TabsetComponent } from 'ngx-bootstrap';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit {
  @ViewChild('memberTabs') memberTabs: TabsetComponent;
  user: User;
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];

  constructor(private userService: UserService, private authService: AuthService,
    private alertify: AlertifyService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.user = data['user'];
    });

    this.route.queryParams.subscribe(params => {
      const selectedTab = params['tab'];
      if ( selectedTab > 0 ) {
        this.memberTabs.tabs[selectedTab].active = true;
        this.markAsRead(this.authService.decodedToken.nameid, this.user.id);
      }
    });

    this.galleryOptions = [{
      width: '500px',
      height: '500px',
      imagePercent: 100,
      thumbnailsColumns: 4,
      imageAnimation: NgxGalleryAnimation.Slide,
      // Fullscreen
      preview: false
    }];
    this.galleryImages = this.getImages();
  }

  getImages() {
    const imageUrls = [];
    for (let i = 0; i < this.user.photos.length; i++) {
      imageUrls.push({
        small: this.user.photos[i].url,
        medium: this.user.photos[i].url,
        big: this.user.photos[i].url,
        description: this.user.photos[i].description
      });
    }
    return imageUrls;
  }

  selectTab(tab_id: number) {
    this.memberTabs.tabs[tab_id].active = true;
  }

  likeUser() {
    this.userService.sendLike(this.authService.decodedToken.nameid, this.user.id).subscribe( next => {
      this.alertify.success('Successfuly liked the user!');
    }, error => {
      this.alertify.error(error);
    });
  }

  markAsRead (userId: number, senderId: number) {
    this.userService.markMessagesAsRead(userId, senderId).subscribe(() => {

    }, error => {
      this.alertify.error(error);
    });
  }
}
