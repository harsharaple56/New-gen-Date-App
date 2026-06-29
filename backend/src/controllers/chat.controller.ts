import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ok, created } from '../utils/response';
import { chatService } from '../services/chat.service';
import { emitToChat, emitToUser } from '../config/socket';

export const chatController = {
  list: asyncHandler(async (req: Request, res: Response) => {
    const result = await chatService.listChats(req.user!.id);
    return ok(res, { chats: result });
  }),

  messages: asyncHandler(async (req: Request, res: Response) => {
    const result = await chatService.getMessages(req.user!.id, req.params.chatId);
    return ok(res, { messages: result });
  }),

  send: asyncHandler(async (req: Request, res: Response) => {
    const { message, recipientId } = await chatService.sendMessage(req.user!.id, req.params.chatId, req.body);
    // Mirror the socket flow so REST + realtime stay consistent.
    emitToChat(req.params.chatId, 'new_message', message);
    emitToUser(recipientId, 'new_message', message);
    return created(res, message, 'Message sent');
  }),

  markRead: asyncHandler(async (req: Request, res: Response) => {
    const result = await chatService.markRead(req.user!.id, req.params.chatId);
    emitToChat(req.params.chatId, 'message_read', { chatId: req.params.chatId, readerId: req.user!.id });
    return ok(res, result);
  }),
};

export default chatController;
