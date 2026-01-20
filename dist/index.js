"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("./app"));
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/webdevtask2';
const PORT = process.env.PORT || 3000;
mongoose_1.default
    .connect(MONGODB_URI)
    .then(() => {
    console.log('MongoDB connected');
    app_1.default.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
    });
})
    .catch(err => console.error('DB connection error:', err));
