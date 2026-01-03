import { NextRequest } from 'next/server';

export function getCurrentTime(req: NextRequest): number {
  const isTestMode = process.env.TEST_MODE === '1';
  const testHeader = req.headers.get('x-test-now-ms');

  if (isTestMode && testHeader) {
    const testTime = parseInt(testHeader, 10);
    if (!isNaN(testTime)) return testTime;
  }
  return Date.now();
}