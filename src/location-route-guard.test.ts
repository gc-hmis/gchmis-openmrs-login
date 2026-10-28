import { describe, expect, it, vi } from 'vitest';
import { getLoginRedirect, installLocationRouteGuard, type SessionState } from './location-route-guard';

describe('getLoginRedirect', () => {
  it('redirects an unauthenticated user away from the location picker', () => {
    expect(
      getLoginRedirect(
        { loaded: true, session: { authenticated: false } },
        '/openmrs/spa/login/location',
        '?returnToUrl=%2Fopenmrs%2Fspa%2Fhome',
        '/openmrs/spa/',
      ),
    ).toBe('/openmrs/spa/login?returnToUrl=%2Fopenmrs%2Fspa%2Fhome');
  });

  it('allows an authenticated user to select a location', () => {
    expect(
      getLoginRedirect(
        { loaded: true, session: { authenticated: true } },
        '/openmrs/spa/login/location',
        '',
        '/openmrs/spa/',
      ),
    ).toBeNull();
  });

  it('waits until the session has loaded', () => {
    expect(
      getLoginRedirect({ loaded: false, session: null }, '/openmrs/spa/login/location', '', '/openmrs/spa/'),
    ).toBeNull();
  });

  it('does not redirect from other routes', () => {
    expect(
      getLoginRedirect(
        { loaded: true, session: { authenticated: false } },
        '/openmrs/spa/home',
        '',
        '/openmrs/spa/',
      ),
    ).toBeNull();
  });
});

describe('installLocationRouteGuard', () => {
  it('redirects when a pending session resolves as unauthenticated', () => {
    let state: SessionState = { loaded: false, session: null };
    let sessionListener = () => {};
    const replace = vi.fn();
    const unsubscribe = vi.fn();
    const sessionStore = {
      getState: () => state,
      subscribe: vi.fn((listener: () => void) => {
        sessionListener = listener;
        return unsubscribe;
      }),
    };

    const cleanup = installLocationRouteGuard({
      getPathname: () => '/openmrs/spa/login/location',
      getSearch: () => '',
      getSpaBase: () => '/openmrs/spa/',
      replace,
      sessionStore,
    });

    expect(replace).not.toHaveBeenCalled();

    state = { loaded: true, session: { authenticated: false } };
    sessionListener();

    expect(replace).toHaveBeenCalledOnce();
    expect(replace).toHaveBeenCalledWith('/openmrs/spa/login');

    cleanup();
    expect(unsubscribe).toHaveBeenCalledOnce();
  });

  it('checks the route again after client-side navigation', () => {
    let pathname = '/openmrs/spa/home';
    const replace = vi.fn();
    const sessionStore = {
      getState: () => ({ loaded: true, session: { authenticated: false } }) as const,
      subscribe: vi.fn(() => vi.fn()),
    };

    const cleanup = installLocationRouteGuard({
      getPathname: () => pathname,
      getSearch: () => '',
      getSpaBase: () => '/openmrs/spa/',
      replace,
      sessionStore,
    });

    pathname = '/openmrs/spa/login/location';
    window.dispatchEvent(new Event('single-spa:routing-event'));

    expect(replace).toHaveBeenCalledWith('/openmrs/spa/login');
    cleanup();
  });
});
