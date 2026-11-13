import { Request, Response } from 'express';
import { Notification } from '../models/Notification';

export async function getUserNotifications(req: Request, res: Response) {
  try {
    const { userId } = req.query;
    const query: any = {};

    if (userId) {
      query.$or = [{ userId }, { role: 'all' }];
    }

    const notifications = await Notification.find(query).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: notifications.length,
      data: notifications,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Error fetching notifications' });
  }
}

export async function markNotificationRead(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const notif = await Notification.findOne({ id });

    if (!notif) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    notif.read = true;
    await notif.save();

    res.json({ success: true, data: notif });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
}

