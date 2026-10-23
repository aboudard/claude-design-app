import {
  Component,
  computed,
  effect,
  input,
  model,
  output,
  signal,
  untracked,
} from '@angular/core';
import {
  FieldTree,
  FormField,
  email,
  form,
  maxLength,
  pattern,
  required,
} from '@angular/forms/signals';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { DatePickerModule } from 'primeng/datepicker';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { InputTagsModule } from 'primeng/inputtags';
import { MessageModule } from 'primeng/message';
import { User, UserDraft } from '../user.model';

interface UserFormValue {
  name: string;
  email: string;
  active: boolean;
  validUntil: Date | null;
  role: string;
  phone: string;
  street: string;
  postalCode: string;
  city: string;
  qualifications: string[];
}

const emptyForm = (): UserFormValue => ({
  name: '',
  email: '',
  active: true,
  validUntil: null,
  role: '',
  phone: '',
  street: '',
  postalCode: '',
  city: '',
  qualifications: [],
});

const toFormValue = (u: User): UserFormValue => ({
  name: u.name,
  email: u.email,
  active: u.active,
  validUntil: new Date(u.validUntil),
  role: u.role,
  phone: u.phone,
  street: u.address.street,
  postalCode: u.address.postalCode,
  city: u.address.city,
  qualifications: [...u.qualifications],
});

@Component({
  selector: 'app-user-form-dialog',
  imports: [
    FormField,
    DialogModule,
    ButtonModule,
    InputTextModule,
    TextareaModule,
    DatePickerModule,
    ToggleSwitchModule,
    InputTagsModule,
    MessageModule,
  ],
  templateUrl: './user-form-dialog.html',
  styleUrl: './user-form-dialog.scss',
})
export class UserFormDialog {
  /** Utilisateur à éditer ; `null` pour une création. */
  readonly user = input<User | null>(null);
  readonly visible = model(false);
  readonly saved = output<UserDraft>();

  protected readonly isEdit = computed(() => !!this.user());
  protected readonly title = computed(() =>
    this.isEdit() ? "Modifier l'utilisateur" : 'Nouvel utilisateur',
  );

  protected readonly model = signal<UserFormValue>(emptyForm());

  protected readonly form = form(this.model, (p) => {
    required(p.name);
    maxLength(p.name, 120);
    required(p.email);
    email(p.email);
    required(p.validUntil);
    pattern(p.postalCode, /^\d{5}$/);
  });

  constructor() {
    // Réinitialise le formulaire à chaque ouverture.
    effect(() => {
      if (!this.visible()) return;
      const u = this.user();
      untracked(() => {
        this.model.set(u ? toFormValue(u) : emptyForm());
        this.form().reset();
      });
    });
  }

  protected invalid(field: FieldTree<unknown>): boolean {
    const s = field();
    return s.invalid() && (s.touched() || s.dirty());
  }
  protected submit(event: Event): void {
    event.preventDefault();
    if (this.form().invalid()) {
      this.form().markAsTouched();
      return;
    }
    const v = this.model();
    this.saved.emit({
      id: this.user()?.id,
      name: v.name.trim(),
      email: v.email.trim(),
      active: v.active,
      validUntil: v.validUntil!,
      role: v.role.trim(),
      phone: v.phone.trim(),
      address: { street: v.street.trim(), postalCode: v.postalCode.trim(), city: v.city.trim() },
      qualifications: v.qualifications,
    });
    this.visible.set(false);
  }
}
