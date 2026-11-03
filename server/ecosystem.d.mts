import type { IncomingMessage, ServerResponse } from 'node:http';
export function createEcosystemHandler(options?: { backendUrl?: string; serviceToken?: string; request?: typeof fetch }): (req: IncomingMessage, res: ServerResponse, next?: () => void) => Promise<void>;
