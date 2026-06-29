import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ok, created } from '../utils/response';
import { reportService } from '../services/report.service';

export const reportController = {
  report: asyncHandler(async (req: Request, res: Response) => {
    const result = await reportService.createReport(req.user!.id, req.body);
    return created(res, result, 'Report submitted');
  }),

  block: asyncHandler(async (req: Request, res: Response) => {
    const result = await reportService.block(req.user!.id, req.body.blockedUserId);
    return created(res, result, 'User blocked');
  }),

  unblock: asyncHandler(async (req: Request, res: Response) => {
    const result = await reportService.unblock(req.user!.id, req.params.blockedUserId);
    return ok(res, result);
  }),

  listBlocks: asyncHandler(async (req: Request, res: Response) => {
    const result = await reportService.listBlocks(req.user!.id);
    return ok(res, { blocked: result });
  }),
};

export default reportController;
