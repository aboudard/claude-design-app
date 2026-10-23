import { initials, isExpired, toCsvValue } from './user.model';

describe('user.model', () => {
  describe('toCsvValue', () => {
    it('formate les dates en jj/MM/aaaa', () => {
      expect(toCsvValue(new Date(2027, 0, 5))).toBe('05/01/2027');
    });

    it('échappe les guillemets et convertit les autres valeurs', () => {
      expect(toCsvValue('a "b"')).toBe('a ""b""');
      expect(toCsvValue(true)).toBe('true');
    });
  });

  describe('initials', () => {
    it('prend la première lettre des deux premiers mots, en majuscules', () => {
      expect(initials('camille martin')).toBe('CM');
      expect(initials('Jean Pierre Dupont')).toBe('JP');
    });

    it('ignore les espaces multiples et gère un nom vide', () => {
      expect(initials('  Léa   Dubois ')).toBe('LD');
      expect(initials('')).toBe('');
    });
  });

  describe('isExpired', () => {
    const today = new Date(2026, 9, 23, 10, 0);

    it('est faux si la date de validité est aujourd’hui (valable jusqu’à minuit)', () => {
      expect(isExpired({ validUntil: new Date(2026, 9, 23) }, today)).toBe(false);
    });

    it('est vrai si la date de validité est passée', () => {
      expect(isExpired({ validUntil: new Date(2026, 9, 22) }, today)).toBe(true);
    });

    it('est faux si la date de validité est future', () => {
      expect(isExpired({ validUntil: new Date(2027, 0, 1) }, today)).toBe(false);
    });
  });
});
