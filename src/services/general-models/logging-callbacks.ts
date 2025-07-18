import { PrettyPrintableError } from "@oclif/core/interfaces";

export interface LoggingCallbacks {
  log: (message?: string, ...args: any[]) => void;
  error: (input: Error | string, options?: { code?: string; exit?: number } & PrettyPrintableError) => void;
}
