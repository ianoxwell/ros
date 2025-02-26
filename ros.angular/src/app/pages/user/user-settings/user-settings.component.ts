import { Component, OnInit } from '@angular/core';
import { PageTitleComponent } from '@components/page-title/page-title.component';
import { IUserSummary } from '@DomainModels/user.dto';
import { UserProfileService } from '../../../services/user-profile.service';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.scss'],
  imports: [PageTitleComponent]
})
export class UserSettingsComponent implements OnInit {
  cookBookUserProfile: IUserSummary | null = null;

  constructor(private userProfileService: UserProfileService) {}

  ngOnInit() {
    this.userProfileService.getUserProfile().subscribe((profile) => (this.cookBookUserProfile = profile));
  }
}
