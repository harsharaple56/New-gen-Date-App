import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ok, created } from '../utils/response';
import { subscriptionService } from '../services/subscription.service';

export const subscriptionController = {
  mine: asyncHandler(async (req: Request, res: Response) => {
    const result = await subscriptionService.getMine(req.user!.id);
    return ok(res, result);
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const result = await subscriptionService.create(req.user!.id, req.body.plan, req.body.provider);
    return created(res, result, 'Subscription created');
  }),

  confirm: asyncHandler(async (req: Request, res: Response) => {
    const result = await subscriptionService.confirm(req.user!.id, req.body.paymentId, req.body.status);
    return ok(res, result);
  }),
};

export default subscriptionController;
