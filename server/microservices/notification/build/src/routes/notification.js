"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationRoutes = void 0;
const express_1 = __importDefault(require("express"));
const notification_1 = require("../controllers/notification");
const router = express_1.default.Router();
const notificationRoutes = () => {
    // router.post('/create', storeNotification);  
    router.get('/:userID', notification_1.getNotifications);
    router.put('/mark', notification_1.markNotification); //notificationID through the body
    return router;
};
exports.notificationRoutes = notificationRoutes;
//# sourceMappingURL=notification.js.map