export interface Address {
  street: string;
  postalCode: string;
  city: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  active: boolean;
  /** Date de fin de validité du compte. */
  validUntil: Date;
  role: string;
  phone: string;
  address: Address;
  qualifications: string[];
}

export type UserDraft = Omit<User, 'id'> & { id?: string };

export type StatusFilter = 'all' | 'active' | 'inactive';

export function isExpired(user: Pick<User, 'validUntil'>, today = new Date()): boolean {
  const end = new Date(user.validUntil);
  end.setHours(23, 59, 59, 999);
  return end.getTime() < today.getTime();
}

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase();
}
