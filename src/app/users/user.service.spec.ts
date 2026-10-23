import { TestBed } from '@angular/core/testing';
import { UserService } from './user.service';
import { UserDraft } from './user.model';

describe('UserService', () => {
  let service: UserService;

  const draft = (overrides: Partial<UserDraft> = {}): UserDraft => ({
    name: 'Test Utilisateur',
    email: 'test@exemple.fr',
    active: true,
    validUntil: new Date(2027, 11, 31),
    role: 'Testeur',
    phone: '',
    address: { street: '1 rue du Test', postalCode: '75001', city: 'Paris' },
    qualifications: ['Vitest'],
    ...overrides,
  });

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserService);
  });

  it('fournit les utilisateurs de démonstration', () => {
    expect(service.users().length).toBe(10);
    expect(service.activeCount()).toBe(7);
  });

  it('crée un utilisateur avec un nouvel identifiant', () => {
    const created = service.save(draft());
    expect(created.id).toBe('U-1011');
    expect(service.users().length).toBe(11);
    expect(service.getById('U-1011')?.name).toBe('Test Utilisateur');
  });

  it('met à jour un utilisateur existant sans en créer un nouveau', () => {
    const existing = service.getById('U-1001')!;
    service.save({ ...existing, name: 'Camille Martin-Durand', active: false });
    expect(service.users().length).toBe(10);
    expect(service.getById('U-1001')?.name).toBe('Camille Martin-Durand');
    expect(service.activeCount()).toBe(6);
  });

  it('supprime plusieurs utilisateurs en une fois', () => {
    service.delete(['U-1001', 'U-1002', 'U-9999']);
    expect(service.users().length).toBe(8);
    expect(service.getById('U-1001')).toBeUndefined();
  });
});
