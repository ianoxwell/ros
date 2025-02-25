import { Component, OnInit } from '@angular/core';
import { IUser } from '../../../models/user';
import { UserProfileService } from '../../../services/user-profile.service';
import { PageTitleComponent } from '@components/page-title/page-title.component';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.scss'],
  imports: [PageTitleComponent]
})
export class UserSettingsComponent implements OnInit {
  cookBookUserProfile: IUser | null = null;

  constructor(private userProfileService: UserProfileService) {}

  ngOnInit() {
    this.userProfileService.getUserProfile().subscribe((profile) => (this.cookBookUserProfile = profile));
  }
}
