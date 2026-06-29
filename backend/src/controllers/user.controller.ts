import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ok } from '../utils/response';
import { userService } from '../services/user.service';

export const userController = {
  discover: asyncHandler(async (req: Request, res: Response) => {
    const result = await userService.discover(req.user!.id);
    return ok(res, result);
  }),

  getProfile: asyncHandler(async (req: Request, res: Response) => {
    const result = await userService.getProfile(req.params.userId);
    return ok(res, result);
  }),
};

export default userController;
