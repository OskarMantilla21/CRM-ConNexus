/**
 * Which areas of the app a person may open.
 *
 * The codes match `common.permissions.ALL_PERMISSIONS`. The signed token
 * carries the list (`permissions`). When a token was minted before that claim
 * existed, the role and the admin fact are enough to keep today's screens
 * working until the next sign-in.
 *
 * This only decides what to show and where to send someone. The API refuses
 * the rest.
 */

export const ALL_PERMISSIONS = ['sell', 'serve', 'bill', 'daily_work', 'settings', 'team'];

/** What a member already had: everything except the team page. */
export const MEMBER_PERMISSIONS = ['sell', 'serve', 'bill', 'daily_work', 'settings'];

/** English source strings. Callers pass them through tx(). */
export const PERMISSION_LABEL = {
  sell: 'Sell',
  serve: 'Serve',
  bill: 'Bill',
  daily_work: 'Daily work',
  settings: 'Settings',
  team: 'Team and access'
};

/**
 * @param {{ role?: string, is_organization_admin?: boolean, permissions?: string[] } | null | undefined} source
 * @returns {string[]}
 */
export function permissionsFromClaims(source) {
  if (Array.isArray(source?.permissions)) {
    return source.permissions.filter((key) => ALL_PERMISSIONS.includes(key));
  }
  if (source?.role === 'EMPLOYEE') return ['daily_work'];
  if (source?.role === 'CEO' || source?.is_organization_admin === true) {
    return [...ALL_PERMISSIONS];
  }
  return [...MEMBER_PERMISSIONS];
}

/** Sidebar and phone-tab destinations, longest prefix first is unnecessary:
 *  each entry is a whole section. `/` is handled on its own. */
const SECTIONS = [
  ['/pipeline', 'sell'],
  ['/leads', 'sell'],
  ['/accounts', 'sell'],
  ['/contacts', 'sell'],
  ['/goals', 'sell'],
  ['/tasks', 'serve'],
  ['/tickets', 'serve'],
  ['/solutions', 'serve'],
  ['/documents', 'serve'],
  ['/invoices', 'bill'],
  ['/team', 'team'],
  ['/settings', 'settings'],
  ['/notifications', 'serve']
];

/**
 * @param {string} pathname
 * @param {string[]} permissions
 */
export function pathAllowed(pathname, permissions) {
  if (
    pathname === '/profile' ||
    pathname.startsWith('/profile/') ||
    pathname === '/help' ||
    pathname.startsWith('/help/') ||
    pathname === '/logout'
  ) {
    return true;
  }
  if (pathname === '/') return permissions.includes('sell');
  if (pathname === '/timesheet/report' || pathname.startsWith('/timesheet/report/')) {
    return permissions.includes('bill');
  }
  if (pathname === '/timesheet' || pathname.startsWith('/timesheet/')) {
    return permissions.includes('daily_work');
  }
  for (const [prefix, permission] of SECTIONS) {
    if (pathname === prefix || pathname.startsWith(prefix + '/')) {
      return permissions.includes(permission);
    }
  }
  // A page this map does not name. Members may open it. An empleado, whose
  // whole grant is the day's work, may not.
  return (
    permissions.includes('sell') ||
    permissions.includes('serve') ||
    permissions.includes('settings')
  );
}

/**
 * Where to send someone who opened a page they cannot use.
 *
 * @param {string[]} permissions
 */
export function landingPath(permissions) {
  if (permissions.includes('sell')) return '/';
  if (permissions.includes('serve')) return '/tickets';
  if (permissions.includes('daily_work')) return '/timesheet';
  if (permissions.includes('bill')) return '/invoices';
  if (permissions.includes('settings')) return '/settings';
  if (permissions.includes('team')) return '/team';
  return '/profile';
}

/** Sidebar badge → the permission required to ask for that count. */
export const COUNT_PERMISSION = {
  leads: 'sell',
  pipeline: 'sell',
  tickets: 'serve',
  tasks: 'serve',
  approvals: 'serve',
  invoices: 'bill',
  notifications: 'serve'
};
