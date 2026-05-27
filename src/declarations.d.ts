declare module '*.scss';
declare module '*.svg';
declare module '*.png';

declare const require: {
  context(
    directory: string,
    useSubdirectories: boolean,
    regExp: RegExp,
    mode?: string,
  ): (key: string) => Promise<unknown>;
};

interface Window {
  getOpenmrsSpaBase(): string;
}
