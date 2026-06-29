import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ok, created } from '../utils/response';
import { userService } from '../services/user.service';
import { ApiError } from '../utils/ApiError';
import { fileToUrl } from '../middleware/upload.middleware';

export const profileController = {
  getMine: asyncHandler(async (req: Request, res: Response) => {
    const result = await userService.getMyProfile(req.user!.id);
    return ok(res, result);
  }),

  upsert: asyncHandler(async (req: Request, res: Response) => {
    const result = await userService.upsertProfile(req.user!.id, req.body);
    return ok(res, result);
  }),

  addPhoto: asyncHandler(async (req: Request, res: Response) => {
    // Accept either an uploaded file (multipart) or an imageUrl in the body.
    const imageUrl = req.file ? fileToUrl(req, req.file.filename) : (req.body.imageUrl as string | undefined);
    if (!imageUrl) throw ApiError.badRequest('An image file or imageUrl is required');

    const isPrimary = req.body.isPrimary === 'true' || req.body.isPrimary === true;
    const result = await userService.addPhoto(req.user!.id, imageUrl, isPrimary);
    return created(res, result, 'Photo added');
  }),

  deletePhoto: asyncHandler(async (req: Request, res: Response) => {
    const result = await userService.deletePhoto(req.user!.id, req.params.photoId);
    return ok(res, result);
  }),

  setInterests: asyncHandler(async (req: Request, res: Response) => {
    const result = await userService.setInterests(req.user!.id, req.body.interestIds);
    return ok(res, result);
  }),

  setPreferences: asyncHandler(async (req: Request, res: Response) => {
    const result = await userService.setPreferences(req.user!.id, req.body);
    return ok(res, result);
  }),
};

export default profileController;
