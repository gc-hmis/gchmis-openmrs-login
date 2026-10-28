import './gchmis-theme.css';
import { installLocationRouteGuard } from './location-route-guard';

export const importTranslation = require.context('../translations', false, /.json$/, 'lazy');

export function startupApp() {
  installLocationRouteGuard();
}
