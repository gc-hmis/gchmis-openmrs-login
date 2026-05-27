import { vi } from 'vitest';

export class Workbox {
  addEventListener = vi.fn();
  messageSkipWaiting = vi.fn();
  register = vi.fn();
}

export const messageSW = vi.fn();
