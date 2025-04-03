"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appRoutes = appRoutes;
const growvia_shared_1 = require("@veckovn/growvia-shared");
const health_1 = require("./routes/health");
const notification_1 = require("./routes/notification");
const BASE_PATH = '/api/v1/notification';
function appRoutes(app) {
    app.use('', (0, health_1.healthRoutes)());
    app.use(`${BASE_PATH}`, growvia_shared_1.verifyGateway, (0, notification_1.notificationRoutes)());
    // app.use(`${BASE_PATH}`, verifyGateway, searchRoutes()); 
}
//# sourceMappingURL=routes.js.map