"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
try {
    fs_1.default.readdirSync("uploads");
}
catch (error) {
    console.log("uploads 폴더가 없어 uploads 폴더를 생성합니다.");
    fs_1.default.mkdirSync("uploads");
}
const upload = (0, multer_1.default)({
    storage: multer_1.default.diskStorage({
        destination(req, file, done) {
            done(null, "uploads/");
        },
        filename(req, file, done) {
            const ext = path_1.default.extname(file.originalname);
            done(null, path_1.default.basename(file.originalname, ext) + Date.now() + ext);
        },
    }),
    limits: { fileSize: 5 * 1024 * 1024 },
});
exports.default = upload;
