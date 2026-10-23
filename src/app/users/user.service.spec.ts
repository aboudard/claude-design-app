import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { UserService, USERS_API_URL, fromDto, toDto } from './user.service';
import { UserDraft } from './user.model';

const dto = (id: string, active = true) => ({
  id,
  name: `Nom ${id}`,
  email: `${id}@exemple.fr`,
  active,
  validUntil: '2027-06-30',
  role: 'Testeur',
  phone: '',
  address: { street: '1 rue du Test', postalCode: '75001', city: 'Paris' },
  qualifications: ['Vitest'],
});

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

describe('UserService', () => {
  let service: UserService;
  let http: HttpTestingController;
  const url = '/api/users';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    http = TestBed.inject(HttpTestingController);
    service = TestBed.inject(UserService);
    http.expectOne(url).flush([dto('U-1'), dto('U-2', false)]);
  });

  afterEach(() => http.verify());

  it('charge les utilisateurs au démarrage et convertit la date', () => {
    expect(service.users().length).toBe(2);
    expect(service.activeCount()).toBe(1);
    expect(service.users()[0].validUntil).toEqual(new Date(2027, 5, 30));
    expect(service.loading()).toBe(false);
  });

  it('expose une erreur quand le chargement échoue', () => {
    service.load();
    http.expectOne(url).flush('boom', { status: 500, statusText: 'Server Error' });
    expect(service.error()).toBeTruthy();
    expect(service.loading()).toBe(false);
  });

  it('crée un utilisateur (POST sans id, date au format aaaa-MM-jj)', () => {
    service.save(draft()).subscribe();

    const req = http.expectOne(url);
    expect(req.request.method).toBe('POST');
    expect(req.request.body.id).toBeUndefined();
    expect(req.request.body.validUntil).toBe('2027-12-31');
    req.flush(dto('U-3'));

    expect(service.users().length).toBe(3);
    expect(service.getById('U-3')).toBeDefined();
  });

  it('met à jour un utilisateur existant (PUT)', () => {
    const existing = service.getById('U-1')!;
    service.save({ ...existing, name: 'Camille' }).subscribe();

    const req = http.expectOne(`${url}/U-1`);
    expect(req.request.method).toBe('PUT');
    req.flush({ ...dto('U-1'), name: 'Camille' });

    expect(service.users().length).toBe(2);
    expect(service.getById('U-1')?.name).toBe('Camille');
  });

  it('supprime plusieurs utilisateurs (un DELETE par id)', () => {
    service.delete(['U-1', 'U-2']).subscribe();

    http.expectOne(`${url}/U-1`).flush(null);
    http.expectOne(`${url}/U-2`).flush(null);

    expect(service.users().length).toBe(0);
  });

  it('conserve la liste si la suppression échoue', () => {
    service.delete(['U-1']).subscribe({ error: () => undefined });
    http.expectOne(`${url}/U-1`).flush('x', { status: 500, statusText: 'Error' });
    expect(service.users().length).toBe(2);
  });

  it('convertit une date aller-retour sans décalage de fuseau', () => {
    const d = new Date(2027, 0, 1);
    expect(fromDto(toDto(draft({ validUntil: d })) as never).validUntil).toEqual(d);
  });

  it("utilise l'URL configurable", () => {
    expect(TestBed.inject(USERS_API_URL)).toBe(url);
  });
});
