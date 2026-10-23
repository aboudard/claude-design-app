import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { providePrimeNG } from 'primeng/config';
import { UserList } from './user-list';

const dto = (id: number) => ({
  id: `U-${id}`,
  name: `Utilisateur ${id}`,
  email: `u${id}@exemple.fr`,
  active: true,
  validUntil: '2027-06-30',
  role: 'Testeur',
  phone: '',
  address: { street: '', postalCode: '', city: '' },
  qualifications: [],
});

describe('UserList', () => {
  const setup = () => {
    TestBed.configureTestingModule({
      providers: [providePrimeNG(), provideHttpClient(), provideHttpClientTesting()],
    });
    const fixture = TestBed.createComponent(UserList);
    TestBed.inject(HttpTestingController)
      .expectOne('/api/users')
      .flush([dto(1), dto(2), dto(3)]);
    fixture.detectChanges();
    // Accès aux signaux protégés pour piloter l'état sans passer par le DOM PrimeNG.
    const cmp = fixture.componentInstance as unknown as {
      selected: { (): { id: number }[]; set(v: unknown[]): void };
      search: { set(v: string): void };
      filteredUsers: () => { id: number; name: string }[];
    };
    return { fixture, cmp };
  };

  it('retire de la sélection les lignes masquées par la recherche', async () => {
    const { fixture, cmp } = setup();
    const [first, second] = cmp.filteredUsers();
    cmp.selected.set([first, second]);
    await fixture.whenStable();

    cmp.search.set(first.name);
    await fixture.whenStable();

    expect(cmp.selected().map((u) => u.id)).toEqual([first.id]);
  });

  it('conserve la sélection quand le filtre ne masque rien', async () => {
    const { fixture, cmp } = setup();
    const [first, second] = cmp.filteredUsers();
    cmp.selected.set([first, second]);
    await fixture.whenStable();

    expect(cmp.selected().length).toBe(2);
  });
});
