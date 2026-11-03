export async function requestBotJob(path: '/api/handwriting-review' | '/api/translate', body: object, signal: AbortSignal) {
  if (!navigator.onLine) throw new Error('You are offline. Your work is saved; reconnect before requesting AI feedback.');
  const response = await fetch(path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body), signal });
  const job = await response.json();
  if (!response.ok || typeof job.jobId !== 'string') throw new Error(job.error || 'The bot service is unavailable.');
  for (let count = 0; count < 90; count++) {
    await new Promise<void>((resolve, reject) => {
      if (signal.aborted) { reject(new DOMException('Aborted', 'AbortError')); return; }
      const abort = () => { clearTimeout(timer); reject(new DOMException('Aborted', 'AbortError')); };
      const timer = setTimeout(() => { signal.removeEventListener('abort', abort); resolve(); }, 2000);
      signal.addEventListener('abort', abort, { once: true });
    });
    const poll = await fetch(path + '/' + encodeURIComponent(job.jobId), { signal, cache: 'no-store' });
    const status = await poll.json();
    if (!poll.ok || status.status === 'failed') throw new Error(status.error || 'The bot could not finish this request.');
    if (status.status === 'completed') return status.result;
  }
  throw new Error('The tutor is taking longer than expected. Please try again later.');
}
