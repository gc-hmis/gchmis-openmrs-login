import { getSessionStore } from '@openmrs/esm-framework';

export type SessionState =
  | { loaded: false; session: null }
  | { loaded: true; session: { authenticated?: boolean } };

type SessionStore = {
  getState(): SessionState;
  subscribe(listener: () => void): () => void;
};

type LocationRouteGuardOptions = {
  getPathname?: () => string;
  getSearch?: () => string;
  getSpaBase?: () => string;
  replace?: (url: string) => void;
  sessionStore?: SessionStore;
};

function normalizePath(path: string): string {
  const pathWithLeadingSlash = path.startsWith('/') ? path : `/${path}`;
  return pathWithLeadingSlash.length > 1 ? pathWithLeadingSlash.replace(/\/+$/, '') : pathWithLeadingSlash;
}

function getRoute(spaBase: string, route: string): string {
  return `${normalizePath(spaBase)}/${route}`;
}

export function getLoginRedirect(
  state: SessionState,
  pathname: string,
  search: string,
  spaBase: string,
): string | null {
  const isLocationRoute = normalizePath(pathname) === getRoute(spaBase, 'login/location');

  if (!isLocationRoute || !state.loaded || state.session.authenticated) {
    return null;
  }

  return `${getRoute(spaBase, 'login')}${search}`;
}

function replaceSpaRoute(url: string): void {
  window.history.replaceState(window.history.state, '', url);
  window.dispatchEvent(new PopStateEvent('popstate'));
}

export function installLocationRouteGuard({
  getPathname = () => window.location.pathname,
  getSearch = () => window.location.search,
  getSpaBase = () => window.getOpenmrsSpaBase(),
  replace = replaceSpaRoute,
  sessionStore = getSessionStore() as SessionStore,
}: LocationRouteGuardOptions = {}): () => void {
  const redirectIfUnauthenticated = () => {
    const loginUrl = getLoginRedirect(sessionStore.getState(), getPathname(), getSearch(), getSpaBase());

    if (loginUrl) {
      replace(loginUrl);
    }
  };

  redirectIfUnauthenticated();

  const unsubscribe = sessionStore.subscribe(redirectIfUnauthenticated);
  window.addEventListener('single-spa:routing-event', redirectIfUnauthenticated);

  return () => {
    unsubscribe();
    window.removeEventListener('single-spa:routing-event', redirectIfUnauthenticated);
  };
}
