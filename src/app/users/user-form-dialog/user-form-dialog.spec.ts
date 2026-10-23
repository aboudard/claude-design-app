import { TestBed } from '@angular/core/testing';
import { providePrimeNG } from 'primeng/config';
import { UserFormDialog } from './user-form-dialog';
import { User, UserDraft } from '../user.model';

const user: User = {
  id: 'U-1',
  name: 'Camille Martin',
  email: 'camille@exemple.fr',
  active: true,
  validUntil: new Date(2027, 5, 1),
  role: 'Dev',
  phone: '0102030405',
  address: { street: '1 rue du Test', postalCode: '75001', city: 'Paris' },
  qualifications: ['Angular'],
};

describe('UserFormDialog', () => {
  const setup = async (u: User | null) => {
    TestBed.configureTestingModule({ providers: [providePrimeNG()] });
    const fixture = TestBed.createComponent(UserFormDialog);
    const emitted: UserDraft[] = [];
    fixture.componentInstance.saved.subscribe((d) => emitted.push(d));
    fixture.componentRef.setInput('user', u);
    fixture.componentRef.setInput('visible', true);
    fixture.detectChanges();
    await fixture.whenStable();
    const cmp = fixture.componentInstance as unknown as {
      model: { (): Record<string, unknown>; update(fn: (v: any) => any): void };
      form: () => { valid(): boolean };
      submit(e: Event): void;
    };
    return { fixture, cmp, emitted };
  };

  it("pré-remplit le formulaire en édition et émet l'utilisateur modifié", async () => {
    const { cmp, emitted } = await setup(user);
    expect(cmp.model()['name']).toBe('Camille Martin');

    cmp.model.update((v) => ({ ...v, name: '  Camille Dupont ' }));
    cmp.submit(new Event('submit'));

    expect(emitted.length).toBe(1);
    expect(emitted[0].id).toBe('U-1');
    expect(emitted[0].name).toBe('Camille Dupont');
  });

  it('lie les champs du DOM au modèle (input natif, switch et date PrimeNG)', async () => {
    const { fixture, cmp } = await setup(user);
    const input = document.getElementById('f-name') as HTMLInputElement;
    expect(input.value).toBe('Camille Martin');

    input.value = 'Zoé Durand';
    input.dispatchEvent(new Event('input'));
    await fixture.whenStable();

    expect(cmp.model()['name']).toBe('Zoé Durand');
    expect(document.getElementById('f-date')).not.toBeNull();
    expect(document.getElementById('f-active')).not.toBeNull();
  });

  it("n'émet rien quand le formulaire est invalide", async () => {
    const { cmp, emitted } = await setup(null);
    expect(cmp.form().valid()).toBe(false);

    cmp.submit(new Event('submit'));

    expect(emitted.length).toBe(0);
  });

  it('rejette un code postal invalide', async () => {
    const { cmp } = await setup(user);
    expect(cmp.form().valid()).toBe(true);

    cmp.model.update((v) => ({ ...v, postalCode: '123' }));

    expect(cmp.form().valid()).toBe(false);
  });
});
