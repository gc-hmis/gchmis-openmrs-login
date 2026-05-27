import React from 'react';
import { vi } from 'vitest';

export const Type = {
  Array: 'array',
  Boolean: 'boolean',
  Number: 'number',
  Object: 'object',
  String: 'string',
};

export const validators = {
  isUrl: vi.fn(() => true),
  oneOf: vi.fn(() => vi.fn(() => true)),
};

export const validator = vi.fn((test, message) => ({ message, test }));

export const fhirBaseUrl = '/ws/fhir2/R4';
export const restBaseUrl = '/ws/rest/v1';

export const openmrsFetch = vi.fn();
export const refetchCurrentUser = vi.fn();
export const clearCurrentUser = vi.fn();
export const setSessionLocation = vi.fn();
export const setUserProperties = vi.fn();
export const setUserLanguage = vi.fn();

export const navigate = vi.fn();
export const showModal = vi.fn(() => vi.fn());
export const showSnackbar = vi.fn();

export const useConfig = vi.fn(() => ({}));
export const useConnectivity = vi.fn(() => true);
export const useSession = vi.fn(() => ({ authenticated: false, sessionId: '' }));
export const useDebounce = vi.fn((value) => value);

export const defineConfigSchema = vi.fn();
export const getAsyncLifecycle = vi.fn((loader) => loader);
export const getSyncLifecycle = vi.fn((component) => component);
export const getCoreTranslation = vi.fn((key) => key);
export const interpolateUrl = vi.fn((url) => url);
export const interpolateString = vi.fn((value) => value);

export const ArrowRightIcon = (props) => <svg aria-hidden="true" {...props} />;
export const LocationIcon = (props) => <svg aria-hidden="true" {...props} />;
export const PasswordIcon = (props) => <svg aria-hidden="true" {...props} />;

export const LocationPicker = ({ onChange, selectedLocationUuid }) => (
  <fieldset>
    {[
      { uuid: 'uuid_1', name: 'location_1' },
      { uuid: 'uuid_2', name: 'location_2' },
    ].map((location) => (
      <label key={location.uuid}>
        <input
          checked={selectedLocationUuid === location.uuid}
          name="location"
          onChange={() => onChange(location.uuid)}
          type="radio"
        />
        {location.name}
      </label>
    ))}
  </fieldset>
);

export type FetchResponse<T = unknown> = {
  data: T;
  ok?: boolean;
};

export type FHIRLocationResource = unknown;
export type LoggedInUser = Record<string, unknown>;
export type Session = Record<string, unknown>;
