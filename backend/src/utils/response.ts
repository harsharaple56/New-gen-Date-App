import { Response } from 'express';

/** Standard success envelope used across the API. */
export function ok<T>(res: Response, data: T, status = 200) {
  return res.status(status).json({ success: true, data });
}

/** Success envelope with a top-level message. */
export function created<T>(res: Response, data: T, message = 'Created') {
  return res.status(201).json({ success: true, message, data });
}

/** Paginated success envelope. */
export function paginated<T>(
  res: Response,
  items: T[],
  meta: { page: number; limit: number; total: number },
) {
  return res.status(200).json({
    success: true,
    data: items,
    page: meta.page,
    limit: meta.limit,
    total: meta.total,
    totalPages: Math.max(1, Math.ceil(meta.total / meta.limit)),
  });
}

/** Error envelope (used by the error middleware). */
export function fail(res: Response, status: number, message: string, details?: unknown) {
  return res.status(status).json({ success: false, message, details });
}
