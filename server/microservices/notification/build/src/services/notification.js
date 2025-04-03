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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeReadNotification = exports.getNotificationsByID = exports.storeNotification = void 0;
const notification_1 = require("../model/notification");
const mongoose_1 = __importDefault(require("mongoose"));
const storeNotification = (notification) => __awaiter(void 0, void 0, void 0, function* () {
    const notificationObject = Object.assign(Object.assign({}, notification), { receiverID: new mongoose_1.default.Types.ObjectId(notification.receiverID), senderID: new mongoose_1.default.Types.ObjectId(notification.senderID) });
    const data = yield notification_1.NotificationModel.create(notificationObject);
    return data;
});
exports.storeNotification = storeNotification;
const getNotificationsByID = (userID) => __awaiter(void 0, void 0, void 0, function* () {
    //TODO: paggination
    const notifications = yield notification_1.NotificationModel.find({ receiverID: userID });
    return notifications;
});
exports.getNotificationsByID = getNotificationsByID;
const makeReadNotification = (notificationID) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedNotification = yield notification_1.NotificationModel.findOneAndUpdate({ _id: notificationID }, {
        $set: {
            isRead: true
        }
    }, { new: true }); //as Notification to avoid " Type 'null' is not assignable to type 'NotificationInterface"
    return updatedNotification;
});
exports.makeReadNotification = makeReadNotification;
//# sourceMappingURL=notification.js.map