"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.markNotification = exports.getNotifications = void 0;
// import { z } from 'zod';
// import { ProductCreateZodSchema, ProductUpdateZodSchema } from '@product/schema/product';
const notification_1 = require("../services/notification");
const getNotifications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const notifications = yield (0, notification_1.getNotificationsByID)(req.params.userID);
    res.status(200).json({ message: "User Notifications", notifications });
});
exports.getNotifications = getNotifications;
const markNotification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const updateNotification = yield (0, notification_1.makeReadNotification)(req.body.notificationID);
    res.status(200).json({ message: "Notification marked as read", notification: updateNotification });
});
exports.markNotification = markNotification;
//# sourceMappingURL=notification.js.map