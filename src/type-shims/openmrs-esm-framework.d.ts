declare module '@openmrs/esm-framework' {
  import type React from 'react';

  export enum Type {
    Array = 'array',
    Boolean = 'boolean',
    Number = 'number',
    Object = 'object',
    String = 'string',
  }

  export const validators: {
    isUrl: unknown;
    oneOf(values: Array<unknown>): unknown;
  };

  export function validator<T = unknown>(
    validate: (value: T) => boolean,
    message: string | ((value: T) => string),
  ): unknown;

  export const fhirBaseUrl: string;
  export const restBaseUrl: string;

  export interface FetchResponse<T = unknown> {
    data: T;
    ok?: boolean;
    responseBody?: {
      message?: string;
    };
  }

  export interface SessionLocation {
    uuid: string;
    display?: string;
    links?: Array<unknown>;
  }

  export interface SessionUser {
    uuid?: string;
    display?: string;
    userProperties?: Record<string, string>;
  }

  export type LoggedInUser = SessionUser;

  export interface Session {
    authenticated?: boolean;
    sessionId?: string;
    sessionLocation?: SessionLocation | null;
    user?: SessionUser | null;
  }

  export interface FHIRLocationResource {
    resource?: {
      id?: string;
      name?: string;
    };
    [key: string]: unknown;
  }

  export type OpenmrsFetchOptions = Omit<RequestInit, 'body'> & {
    body?: unknown;
  };

  export function openmrsFetch<T = unknown>(url: string, init?: OpenmrsFetchOptions): Promise<FetchResponse<T>>;
  export function refetchCurrentUser(): void;
  export function clearCurrentUser(): void;
  export function setSessionLocation(locationUuid?: string, abortController?: AbortController): Promise<unknown>;
  export function setUserProperties(userUuid: string, properties: Record<string, string | undefined>): Promise<unknown>;
  export function setUserLanguage(options: {
    authenticated?: boolean;
    locale?: string | null;
    sessionId?: string;
  }): void;

  export function navigate(options: { to: string }): void;
  export function showModal(name: string, props?: Record<string, unknown>): () => void;
  export function showSnackbar(options: {
    isLowContrast?: boolean;
    kind?: 'error' | 'info' | 'success' | 'warning' | string;
    subtitle?: React.ReactNode;
    title?: React.ReactNode;
  }): void;

  export function useConfig<T = Record<string, unknown>>(): T;
  export function useConnectivity(): boolean;
  export function useDebounce<T>(value: T): T;
  export function useSession(): Session;

  export function defineConfigSchema(moduleName: string, schema: unknown): void;
  export function getAsyncLifecycle<TProps = Record<string, unknown>>(
    loader: () => Promise<{ default: React.ComponentType<TProps> }>,
    options: { featureName: string; moduleName: string },
  ): unknown;
  export function getSyncLifecycle<TProps = Record<string, unknown>>(
    component: React.ComponentType<TProps>,
    options: { featureName: string; moduleName: string },
  ): unknown;

  export function getCoreTranslation(key: string, fallback?: string): string;
  export function interpolateString(value: string): string;
  export function interpolateUrl(value: string): string;

  export type OpenmrsIconProps = React.SVGProps<SVGSVGElement> & {
    size?: number | string;
  };

  export const ArrowRightIcon: React.ComponentType<OpenmrsIconProps>;
  export const LocationIcon: React.ComponentType<OpenmrsIconProps>;
  export const PasswordIcon: React.ComponentType<OpenmrsIconProps>;

  export interface LocationPickerProps {
    defaultLocationUuid?: string;
    locationTag?: string;
    onChange?(locationUuid: string): void;
    selectedLocationUuid?: string;
  }

  export const LocationPicker: React.FC<LocationPickerProps>;
}
