import { Component, computed, effect, inject, signal, untracked } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { AvatarModule } from 'primeng/avatar';
import { ToolbarModule } from 'primeng/toolbar';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';

import { UserService } from '../user.service';
import { StatusFilter, User, UserDraft, initials, isExpired, toCsvValue } from '../user.model';
import { UserDetailDialog } from '../user-detail-dialog/user-detail-dialog';
import { UserFormDialog } from '../user-form-dialog/user-form-dialog';

@Component({
  selector: 'app-user-list',
  imports: [
    DatePipe,
    FormsModule,
    TableModule,
    ButtonModule,
    TagModule,
    AvatarModule,
    ToolbarModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    SelectButtonModule,
    ConfirmDialogModule,
    ToastModule,
    TooltipModule,
    UserDetailDialog,
    UserFormDialog,
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './user-list.html',
  styleUrl: './user-list.scss',
})
export class UserList {
  private readonly userService = inject(UserService);
  private readonly confirmation = inject(ConfirmationService);
  private readonly messages = inject(MessageService);

  protected readonly users = this.userService.users;
  protected readonly activeCount = this.userService.activeCount;
  protected readonly loading = this.userService.loading;
  protected readonly loadError = this.userService.error;

  /** Lignes cochées dans la table (liaison [(selection)]). */
  protected readonly selected = signal<User[]>([]);
  protected readonly search = signal('');
  protected readonly status = signal<StatusFilter>('all');

  protected readonly statusOptions = computed(() => {
    const all = this.users();
    const active = all.filter((u) => u.active).length;
    return [
      { label: `Tous (${all.length})`, value: 'all' },
      { label: `Actifs (${active})`, value: 'active' },
      { label: `Inactifs (${all.length - active})`, value: 'inactive' },
    ];
  });

  /** Données filtrées par statut + recherche texte. */
  protected readonly filteredUsers = computed(() => {
    const q = this.search().trim().toLowerCase();
    const status = this.status();
    return this.users().filter(
      (u) =>
        (status === 'all' || (status === 'active') === u.active) &&
        (!q || `${u.id} ${u.name} ${u.email}`.toLowerCase().includes(q)),
    );
  });

  constructor() {
    // Une ligne masquée par un filtre ne doit plus être sélectionnée (évite une suppression en masse invisible).
    effect(() => {
      const visible = new Set(this.filteredUsers().map((u) => u.id));
      // untracked : l'effect ne doit dépendre que du filtre ; lire `selected` ici le ferait
      // se réexécuter à chaque cochage et boucler, puisqu'il écrit lui-même dans ce signal.
      const sel = untracked(() => this.selected());
      const kept = sel.filter((s) => visible.has(s.id));
      if (kept.length !== sel.length) this.selected.set(kept);
    });
  }

  // Dialogs
  protected readonly detailVisible = signal(false);
  protected readonly formVisible = signal(false);
  protected readonly current = signal<User | null>(null);

  protected readonly exportValue = ({ data }: { data: unknown }) => toCsvValue(data);
  protected readonly initials = initials;
  protected readonly isExpired = (u: User) => isExpired(u);

  protected reload(): void {
    this.userService.load();
  }

  protected view(user: User): void {
    this.current.set(user);
    this.detailVisible.set(true);
  }

  protected create(): void {
    this.current.set(null);
    this.formVisible.set(true);
  }

  protected edit(user: User): void {
    this.current.set(user);
    this.formVisible.set(true);
  }

  protected onSaved(draft: UserDraft): void {
    this.userService.save(draft).subscribe({
      next: (saved) => {
        // Garde la sélection cohérente avec les nouvelles références d'objets.
        this.selected.update((sel) => sel.map((s) => (s.id === saved.id ? saved : s)));
        this.messages.add({
          severity: 'success',
          summary: 'Succès',
          detail: draft.id
            ? `Modifications enregistrées pour « ${saved.name} ».`
            : `Utilisateur « ${saved.name} » créé.`,
          life: 3000,
        });
      },
      error: () => this.notifyError("L'enregistrement a échoué."),
    });
  }

  protected confirmDelete(user: User): void {
    this.askDelete([user], `Voulez-vous vraiment supprimer l'utilisateur « ${user.name} » ?`);
  }

  protected confirmBulkDelete(): void {
    const sel = this.selected();
    if (!sel.length) return;
    this.askDelete(
      sel,
      sel.length === 1
        ? "Voulez-vous vraiment supprimer l'utilisateur sélectionné ?"
        : `Voulez-vous vraiment supprimer les ${sel.length} utilisateurs sélectionnés ?`,
    );
  }

  private askDelete(targets: User[], message: string): void {
    this.confirmation.confirm({
      header: 'Confirmation',
      message: `${message} Cette action est irréversible.`,
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: { label: 'Annuler', severity: 'secondary', text: true },
      acceptButtonProps: { label: 'Supprimer', severity: 'danger', icon: 'pi pi-trash' },
      accept: () => {
        const ids = targets.map((t) => t.id);
        this.userService.delete(ids).subscribe({
          next: () => {
            this.selected.update((sel) => sel.filter((s) => !ids.includes(s.id)));
            this.messages.add({
              severity: 'success',
              summary: 'Succès',
              detail:
                ids.length > 1 ? `${ids.length} utilisateurs supprimés.` : 'Utilisateur supprimé.',
              life: 3000,
            });
          },
          error: () => {
            // Suppression partielle possible : on resynchronise avec le serveur.
            this.userService.load();
            this.notifyError('La suppression a échoué.');
          },
        });
      },
    });
  }

  private notifyError(detail: string): void {
    this.messages.add({ severity: 'error', summary: 'Erreur', detail, life: 5000 });
  }
}
