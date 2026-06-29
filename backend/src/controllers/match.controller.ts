import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ok, created } from '../utils/response';
import { matchService } from '../services/match.service';
import { emitToUser } from '../config/socket';

export const matchController = {
  list: asyncHandler(async (req: Request, res: Response) => {
    const result = await matchService.listMatches(req.user!.id);
    return ok(res, { matches: result });
  }),

  unmatch: asyncHandler(async (req: Request, res: Response) => {
    const result = await matchService.unmatch(req.user!.id, req.params.matchId);
    return ok(res, result);
  }),

  sendIntro: asyncHandler(async (req: Request, res: Response) => {
    const result = await matchService.sendIntro(req.user!.id, req.body.receiverId, req.body.message);
    emitToUser(req.body.receiverId, 'new_intro', { introId: result.id, senderId: req.user!.id });
    return created(res, result, 'Intro sent');
  }),

  receivedIntros: asyncHandler(async (req: Request, res: Response) => {
    const result = await matchService.receivedIntros(req.user!.id);
    return ok(res, { intros: result });
  }),

  respondIntro: asyncHandler(async (req: Request, res: Response) => {
    const result = await matchService.respondIntro(req.user!.id, req.params.introId, req.body.status);
    return ok(res, result);
  }),
};

export default matchController;
