import { Component, computed, effect, inject, input, model, output } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { DatePickerModule } from 'primeng/datepicker';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { InputTagsModule } from 'primeng/inputtags';
import { MessageModule } from 'primeng/message';
import { User, UserDraft } from '../user.model';

@Component({
  selector: 'app-user-form-dialog',
  imports: [
    ReactiveFormsModule,
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
  private readonly fb = inject(NonNullableFormBuilder);

  /** Utilisateur à éditer ; `null` pour une création. */
  readonly user = input<User | null>(null);
  readonly visible = model(false);
  readonly saved = output<UserDraft>();

  protected readonly isEdit = computed(() => !!this.user());
  protected readonly title = computed(() =>
    this.isEdit() ? "Modifier l'utilisateur" : 'Nouvel utilisateur',
  );

  protected readonly form = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(120)]],
    email: ['', [Validators.required, Validators.email]],
    active: [true],
    validUntil: this.fb.control<Date | null>(null, Validators.required),
    role: [''],
    phone: [''],
    street: [''],
    postalCode: ['', Validators.pattern(/^\d{5}$/)],
    city: [''],
    qualifications: this.fb.control<string[]>([]),
  });

  constructor() {
    // Réinitialise le formulaire à chaque ouverture.
    effect(() => {
      if (!this.visible()) return;
      const u = this.user();
      this.form.reset({
        name: u?.name ?? '',
        email: u?.email ?? '',
        active: u?.active ?? true,
        validUntil: u ? new Date(u.validUntil) : null,
        role: u?.role ?? '',
        phone: u?.phone ?? '',
        street: u?.address.street ?? '',
        postalCode: u?.address.postalCode ?? '',
        city: u?.address.city ?? '',
        qualifications: [...(u?.qualifications ?? [])],
      });
    });
  }

  protected invalid(name: keyof typeof this.form.controls): boolean {
    const c = this.form.controls[name];
    return c.invalid && (c.touched || c.dirty);
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
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
