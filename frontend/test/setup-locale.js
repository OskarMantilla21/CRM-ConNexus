import { setClientLocale } from '$lib/i18n/locale.js';

// The app defaults to Spanish. These suites assert the English copy, so pin
// English before any test file imports a module that translates on read.
setClientLocale('en');
