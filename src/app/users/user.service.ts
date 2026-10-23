import { Service, computed, signal } from '@angular/core';
import { User, UserDraft } from './user.model';

/**
 * Store en mémoire basé sur les signals.
 * Pour brancher une API REST, remplacez le corps des méthodes par des appels HttpClient
 * (ou httpResource) et mettez à jour `_users` à la réception des réponses.
 */
@Service()
export class UserService {
  private readonly _users = signal<User[]>(MOCK_USERS);
  private nextId = 1011;

  readonly users = this._users.asReadonly();
  readonly activeCount = computed(() => this._users().filter((u) => u.active).length);

  getById(id: string): User | undefined {
    return this._users().find((u) => u.id === id);
  }

  save(draft: UserDraft): User {
    if (draft.id) {
      const updated = { ...draft, id: draft.id } as User;
      this._users.update((list) => list.map((u) => (u.id === updated.id ? updated : u)));
      return updated;
    }
    const created: User = { ...draft, id: `U-${this.nextId++}` };
    this._users.update((list) => [...list, created]);
    return created;
  }

  delete(ids: string[]): void {
    const toRemove = new Set(ids);
    this._users.update((list) => list.filter((u) => !toRemove.has(u.id)));
  }
}

const u = (
  id: number,
  name: string,
  active: boolean,
  validUntil: string,
  role: string,
  street: string,
  postalCode: string,
  city: string,
  qualifications: string[],
): User => ({
  id: `U-${id}`,
  name,
  email:
    name
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(' ', '.') + '@exemple.fr',
  active,
  validUntil: new Date(validUntil),
  role,
  phone: `+33 6 12 00 00 ${String(id - 1000).padStart(2, '0')}`,
  address: { street, postalCode, city },
  qualifications,
});

const MOCK_USERS: User[] = [
  u(
    1001,
    'Camille Martin',
    true,
    '2027-06-30',
    'Administratrice',
    '12 rue des Lilas',
    '75011',
    'Paris',
    ['Angular', 'TypeScript', 'Scrum Master', 'ITIL v4'],
  ),
  u(
    1002,
    'Lucas Bernard',
    true,
    '2026-12-31',
    'Développeur',
    '8 avenue Jean Jaurès',
    '69007',
    'Lyon',
    ['Java', 'Spring Boot', 'Kubernetes'],
  ),
  u(
    1003,
    'Léa Dubois',
    false,
    '2026-03-15',
    'Analyste',
    '3 place du Capitole',
    '31000',
    'Toulouse',
    ['SQL', 'Power BI'],
  ),
  u(
    1004,
    'Hugo Thomas',
    true,
    '2028-01-15',
    'Chef de projet',
    '45 quai des Chartrons',
    '33000',
    'Bordeaux',
    ['PMP', 'Prince2', 'SAFe'],
  ),
  u(
    1005,
    'Chloé Robert',
    true,
    '2027-09-01',
    'Designer UX',
    '17 rue de la République',
    '13001',
    'Marseille',
    ['Figma', 'Accessibilité RGAA', 'Design System'],
  ),
  u(
    1006,
    'Nathan Richard',
    false,
    '2026-08-31',
    'Testeur',
    '22 boulevard Carnot',
    '59000',
    'Lille',
    ['ISTQB', 'Cypress'],
  ),
  u(1007, 'Manon Petit', true, '2027-03-31', 'Architecte', '5 rue du Château', '44000', 'Nantes', [
    'AWS',
    'TOGAF',
    'Terraform',
  ]),
  u(
    1008,
    'Louis Durand',
    true,
    '2026-11-30',
    'Développeur',
    '9 allée des Tilleuls',
    '67000',
    'Strasbourg',
    ['Angular', 'RxJS', 'NgRx'],
  ),
  u(
    1009,
    'Inès Leroy',
    false,
    '2027-02-28',
    'Data Scientist',
    '30 rue Nationale',
    '37000',
    'Tours',
    ['Python', 'Machine Learning'],
  ),
  u(
    1010,
    'Gabriel Moreau',
    true,
    '2027-12-31',
    'DevOps',
    '14 cours Mirabeau',
    '13100',
    'Aix-en-Provence',
    ['GitLab CI', 'Docker', 'Linux'],
  ),
];
