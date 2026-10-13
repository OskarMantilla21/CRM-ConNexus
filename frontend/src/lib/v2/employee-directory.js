/**
 * The employee directory as the screen derives it.
 *
 * The API returns the whole org. Search, department, role and pages are a
 * view over that list: the server stays the source of who exists, and this
 * module only decides what the table shows. Nothing here grants a role.
 */
import { ALL_PERMISSIONS, EMPLOYEE_PERMISSIONS } from '$lib/access.js';

export const PAGE_SIZE = 8;

/**
 * @param {any} member
 * @returns {'active' | 'pending' | 'inactive' | 'unknown'}
 */
export function memberStatus(member) {
  if (member?.activity_visible === false) return 'unknown';
  if (!member?.is_active) return 'inactive';
  if (!member?.last_login) return 'pending';
  return 'active';
}

/**
 * Headline counts. A concealed row counts in the total only: its active
 * state is not this viewer's to know.
 *
 * @param {any[]} members
 */
export function directoryMetrics(members) {
  let total = 0;
  let active = 0;
  let inactive = 0;
  for (const member of members) {
    total += 1;
    const status = memberStatus(member);
    if (status === 'active' || status === 'pending') active += 1;
    else if (status === 'inactive') inactive += 1;
  }
  return { total, active, inactive };
}

/**
 * @param {any[]} members
 * @param {{ query?: string, role?: string, department?: string }} filters
 */
export function filterMembers(members, filters) {
  const query = (filters.query || '').trim().toLowerCase();
  const role = filters.role || 'ALL';
  const department = filters.department || 'ALL';
  return members.filter((member) => {
    if (role !== 'ALL' && member.role !== role) return false;
    if (department === 'NONE' && (member.teams || []).length) return false;
    if (department !== 'ALL' && department !== 'NONE' && !(member.teams || []).includes(department)) {
      return false;
    }
    if (!query) return true;
    const name = String(member.name || '').toLowerCase();
    const email = String(member.email || '').toLowerCase();
    return name.includes(query) || email.includes(query);
  });
}

/**
 * @param {any[]} rows
 * @param {number} page 1-based
 * @param {number} [pageSize]
 */
export function paginate(rows, page, pageSize = PAGE_SIZE) {
  const total = rows.length;
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const current = Math.min(Math.max(1, page || 1), pages);
  const start = (current - 1) * pageSize;
  return {
    page: current,
    pages,
    start,
    total,
    rows: rows.slice(start, start + pageSize)
  };
}

/** Areas a role can be given. Employees get the short list. */
export function permissionKeys(role) {
  if (role === 'EMPLOYEE') return EMPLOYEE_PERMISSIONS;
  if (role === 'ADMIN') return ALL_PERMISSIONS;
  return [];
}

/**
 * Boxes to start from when the role select changes, or when it has not.
 *
 * @param {any} member
 * @param {string} role
 * @returns {Record<string, boolean>}
 */
export function grantsFor(member, role) {
  /** @type {Record<string, boolean>} */
  const grants = {};
  for (const key of permissionKeys(role)) {
    if (role !== member.role) {
      grants[key] =
        role === 'EMPLOYEE'
          ? key === 'daily_work'
          : key === 'sell' || key === 'serve' || key === 'daily_work';
    } else if (role === 'EMPLOYEE') {
      grants[key] = Array.isArray(member.granted_permissions)
        ? member.granted_permissions.includes(key)
        : key === 'daily_work';
    } else if (!Array.isArray(member.granted_permissions)) {
      grants[key] = true;
    } else {
      grants[key] = member.granted_permissions.includes(key);
    }
  }
  return grants;
}
