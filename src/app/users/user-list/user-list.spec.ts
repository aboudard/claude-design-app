import { TestBed } from '@angular/core/testing';
import { providePrimeNG } from 'primeng/config';
import { UserList } from './user-list';

describe('UserList', () => {
  const setup = () => {
    TestBed.configureTestingModule({ providers: [providePrimeNG()] });
    const fixture = TestBed.createComponent(UserList);
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
