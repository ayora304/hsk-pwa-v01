import type { IncomingMessage, ServerResponse } from 'node:http';
export function createHandwritingHandler(options?: { apiKey?: string; model?: string; request?: typeof fetch }): (req: IncomingMessage, res: ServerResponse, next?: () => void) => Promise<void>;
