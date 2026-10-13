import { describe, expect, it } from 'vitest';
import {
  directoryMetrics,
  filterMembers,
  grantsFor,
  memberStatus,
  paginate
} from './employee-directory.js';

const ana = {
  id: '1',
  name: 'Ana Ruiz',
  email: 'ana@example.com',
  role: 'EMPLOYEE',
  is_active: true,
  activity_visible: true,
  last_login: '2026-01-01',
  teams: ['Support'],
  granted_permissions: ['daily_work']
};
const pending = {
  id: '2',
  name: 'Luis',
  email: 'luis@example.com',
  role: 'EMPLOYEE',
  is_active: true,
  activity_visible: true,
  last_login: null,
  teams: [],
  granted_permissions: ['daily_work', 'sell']
};
const off = {
  id: '3',
  name: 'Mara',
  email: 'mara@example.com',
  role: 'ADMIN',
  is_active: false,
  activity_visible: true,
  last_login: '2026-01-02',
  teams: ['Support'],
  granted_permissions: null
};
const concealed = {
  id: '4',
  name: 'CEO',
  email: 'ceo@example.com',
  role: 'CEO',
  is_active: null,
  activity_visible: false,
  last_login: null,
  teams: [],
  granted_permissions: null
};

describe('employee directory', () => {
  it('reads status from activity the viewer is allowed to see', () => {
    expect(memberStatus(ana)).toBe('active');
    expect(memberStatus(pending)).toBe('pending');
    expect(memberStatus(off)).toBe('inactive');
    expect(memberStatus(concealed)).toBe('unknown');
  });

  it('counts active and pending together, and leaves a concealed row out of both', () => {
    expect(directoryMetrics([ana, pending, off, concealed])).toEqual({
      total: 4,
      active: 2,
      inactive: 1
    });
  });

  it('filters by name, role and department without dropping the source list', () => {
    const all = [ana, pending, off, concealed];
    expect(filterMembers(all, { query: 'ruiz' }).map((m) => m.id)).toEqual(['1']);
    expect(filterMembers(all, { role: 'ADMIN' }).map((m) => m.id)).toEqual(['3']);
    expect(filterMembers(all, { department: 'NONE' }).map((m) => m.id)).toEqual(['2', '4']);
    expect(filterMembers(all, { department: 'Support', role: 'EMPLOYEE' }).map((m) => m.id)).toEqual([
      '1'
    ]);
  });

  it('keeps the page inside the filtered length', () => {
    const rows = [ana, pending, off];
    expect(paginate(rows, 9, 2)).toMatchObject({ page: 2, pages: 2, total: 3 });
    expect(paginate(rows, 2, 2).rows.map((m) => m.id)).toEqual(['3']);
  });

  it('starts an employee who has no saved list on daily work only', () => {
    expect(grantsFor({ ...pending, granted_permissions: null }, 'EMPLOYEE').daily_work).toBe(true);
    expect(grantsFor(pending, 'EMPLOYEE').sell).toBe(true);
    expect(grantsFor(ana, 'ADMIN').settings).toBe(false);
  });
});
