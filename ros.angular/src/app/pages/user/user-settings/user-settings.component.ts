import { Component, OnInit } from '@angular/core';
import { IUser } from '../../../models/user';
import { UserProfileService } from '../../../services/user-profile.service';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.scss'],
  standalone: false
})
export class UserSettingsComponent implements OnInit {
  cookBookUserProfile: IUser | null = null;

  constructor(private userProfileService: UserProfileService) {}

  ngOnInit() {
    this.userProfileService.getUserProfile().subscribe((profile) => (this.cookBookUserProfile = profile));
  }
}
