import { Request, Response } from 'express';
import { Role, ReportStatus } from '@prisma/client';
import { asyncHandler } from '../utils/asyncHandler';
import { ok, paginated } from '../utils/response';
import { authService } from '../services/auth.service';
import { adminService } from '../services/admin.service';

function pagination(req: Request) {
  const page = Math.max(1, parseInt(String(req.query.page ?? '1'), 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(String(req.query.limit ?? '20'), 10) || 20));
  return { page, limit };
}

export const adminController = {
  login: asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.adminLogin(req.body.email, req.body.password);
    return ok(res, result);
  }),

  dashboard: asyncHandler(async (_req: Request, res: Response) => {
    const result = await adminService.dashboard();
    return ok(res, result);
  }),

  users: asyncHandler(async (req: Request, res: Response) => {
    const { page, limit } = pagination(req);
    const search = req.query.search ? String(req.query.search) : undefined;
    const role = req.query.role ? (String(req.query.role).toUpperCase() as Role) : undefined;
    const isBlocked =
      req.query.isBlocked === undefined ? undefined : String(req.query.isBlocked) === 'true';

    const { items, total } = await adminService.listUsers({ page, limit, search, role, isBlocked });
    return paginated(res, items, { page, limit, total });
  }),

  blockUser: asyncHandler(async (req: Request, res: Response) => {
    const isBlocked = req.body.isBlocked === undefined ? true : Boolean(req.body.isBlocked);
    const result = await adminService.setUserBlocked(req.params.userId, isBlocked);
    return ok(res, result);
  }),

  deleteUser: asyncHandler(async (req: Request, res: Response) => {
    const result = await adminService.deleteUser(req.params.userId);
    return ok(res, result);
  }),

  reports: asyncHandler(async (req: Request, res: Response) => {
    const { page, limit } = pagination(req);
    const status = req.query.status ? (String(req.query.status).toUpperCase() as ReportStatus) : undefined;
    const { items, total } = await adminService.listReports({ page, limit, status });
    return paginated(res, items, { page, limit, total });
  }),

  actionReport: asyncHandler(async (req: Request, res: Response) => {
    const result = await adminService.actionReport(req.params.reportId, req.body.status, req.body.blockUser);
    return ok(res, result);
  }),

  matches: asyncHandler(async (req: Request, res: Response) => {
    const { page, limit } = pagination(req);
    const { items, total } = await adminService.listMatches({ page, limit });
    return paginated(res, items, { page, limit, total });
  }),

  chats: asyncHandler(async (req: Request, res: Response) => {
    const { page, limit } = pagination(req);
    const { items, total } = await adminService.listChats({ page, limit });
    return paginated(res, items, { page, limit, total });
  }),

  chatDetail: asyncHandler(async (req: Request, res: Response) => {
    const result = await adminService.getChat(req.params.chatId);
    return ok(res, result);
  }),

  deleteMessage: asyncHandler(async (req: Request, res: Response) => {
    const result = await adminService.deleteMessage(req.params.chatId, req.params.messageId);
    return ok(res, result);
  }),

  removeMatch: asyncHandler(async (req: Request, res: Response) => {
    const result = await adminService.unmatch(req.params.matchId);
    return ok(res, result);
  }),

  notifications: asyncHandler(async (req: Request, res: Response) => {
    const { page, limit } = pagination(req);
    const { items, total } = await adminService.listNotifications({ page, limit });
    return paginated(res, items, { page, limit, total });
  }),

  broadcast: asyncHandler(async (req: Request, res: Response) => {
    const sentBy = req.user?.id;
    const result = await adminService.broadcast(req.body, sentBy);
    return ok(res, result, 201);
  }),

  charts: asyncHandler(async (_req: Request, res: Response) => {
    const result = await adminService.analytics();
    return ok(res, result);
  }),

  subscriptions: asyncHandler(async (req: Request, res: Response) => {
    const { page, limit } = pagination(req);
    const { items, total } = await adminService.listSubscriptions({ page, limit });
    return paginated(res, items, { page, limit, total });
  }),
};

export default adminController;
