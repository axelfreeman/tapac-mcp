/**
 * ESM entry point for @tapacapi/sdk — re-exports the CommonJS implementation.
 *
 *   import { TapacClient } from "@tapacapi/sdk";
 */
import cjs from "./index.cjs";

export const { TapacClient, TapacError, DEFAULT_BASE, DEFAULT_TIMEOUT_MS } = cjs;
export default cjs;
