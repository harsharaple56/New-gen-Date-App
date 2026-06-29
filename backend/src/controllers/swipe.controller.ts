import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ok } from '../utils/response';
import { matchService } from '../services/match.service';
import { emitToUser } from '../config/socket';

export const swipeController = {
  swipe: asyncHandler(async (req: Request, res: Response) => {
    const result = await matchService.swipe(req.user!.id, req.body.swipedUserId, req.body.action);
    if (result.isMatch) {
      // Notify the other user in real time that they have a new match.
      emitToUser(req.body.swipedUserId, 'new_match', { matchId: result.matchId, userId: req.user!.id });
    }
    return ok(res, result);
  }),
};

export default swipeController;
