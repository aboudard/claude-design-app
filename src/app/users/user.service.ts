import { HttpClient } from '@angular/common/http';
import { InjectionToken, Service, computed, inject, signal } from '@angular/core';
import { Observable, forkJoin, map, of, tap } from 'rxjs';
import { User, UserDraft } from './user.model';

/** URL de base de l'API utilisateurs (proxy de dev : /api → json-server, voir proxy.conf.json). */
export const USERS_API_URL = new InjectionToken<string>('USERS_API_URL', {
  factory: () => '/api/users',
});

/** Représentation JSON de l'API : la date de validité est une chaîne `aaaa-MM-jj`. */
type UserDto = Omit<User, 'validUntil'> & { validUntil: string };

const pad = (n: number) => String(n).padStart(2, '0');

export const toDto = (u: UserDraft): Omit<UserDto, 'id'> & { id?: string } => ({
  ...u,
  validUntil: `${u.validUntil.getFullYear()}-${pad(u.validUntil.getMonth() + 1)}-${pad(u.validUntil.getDate())}`,
});

export const fromDto = (dto: UserDto): User => {
  const [y, m, d] = dto.validUntil.slice(0, 10).split('-').map(Number);
  return { ...dto, validUntil: new Date(y, m - 1, d) };
};

/** Store signals alimenté par l'API REST (GET/POST/PUT/DELETE sur `USERS_API_URL`). */
@Service()
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly url = inject(USERS_API_URL);
  private readonly _users = signal<User[]>([]);
  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);

  readonly users = this._users.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly activeCount = computed(() => this._users().filter((u) => u.active).length);

  constructor() {
    this.load();
  }

  load(): void {
    this._loading.set(true);
    this._error.set(null);
    this.http.get<UserDto[]>(this.url).subscribe({
      next: (list) => {
        this._users.set(list.map(fromDto));
        this._loading.set(false);
      },
      error: () => {
        this._error.set('Impossible de charger les utilisateurs.');
        this._loading.set(false);
      },
    });
  }

  getById(id: string): User | undefined {
    return this._users().find((u) => u.id === id);
  }

  save(draft: UserDraft): Observable<User> {
    if (draft.id) {
      return this.http.put<UserDto>(`${this.url}/${draft.id}`, toDto(draft)).pipe(
        map(fromDto),
        tap((updated) =>
          this._users.update((list) => list.map((u) => (u.id === updated.id ? updated : u))),
        ),
      );
    }
    return this.http.post<UserDto>(this.url, toDto(draft)).pipe(
      map(fromDto),
      tap((created) => this._users.update((list) => [...list, created])),
    );
  }

  delete(ids: string[]): Observable<void> {
    if (!ids.length) return of(undefined);
    return forkJoin(ids.map((id) => this.http.delete<void>(`${this.url}/${id}`))).pipe(
      tap(() => {
        const removed = new Set(ids);
        this._users.update((list) => list.filter((u) => !removed.has(u.id)));
      }),
      map(() => undefined),
    );
  }
}
