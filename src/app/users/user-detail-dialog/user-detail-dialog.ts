import { Component, computed, input, model, output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { TagModule } from 'primeng/tag';
import { ChipModule } from 'primeng/chip';
import { User, initials, isExpired } from '../user.model';

@Component({
  selector: 'app-user-detail-dialog',
  imports: [DatePipe, DialogModule, ButtonModule, AvatarModule, TagModule, ChipModule],
  templateUrl: './user-detail-dialog.html',
  styleUrl: './user-detail-dialog.scss',
})
export class UserDetailDialog {
  readonly user = input<User | null>(null);
  readonly visible = model(false);
  readonly edit = output<User>();

  protected readonly initials = computed(() => initials(this.user()?.name ?? ''));
  protected readonly expired = computed(() => {
    const u = this.user();
    return u ? isExpired(u) : false;
  });

  protected onEdit(): void {
    const u = this.user();
    if (u) {
      this.visible.set(false);
      this.edit.emit(u);
    }
  }
}
