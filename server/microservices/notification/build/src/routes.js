"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.healthRoute = healthRoute;
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
function healthRoute() {
    router.get("/notification-health", (_req, res) => {
        res.status(200).send("Notification service is OK");
    });
    return router;
}
//# sourceMappingURL=routes.js.map