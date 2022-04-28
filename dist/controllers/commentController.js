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
exports.removeComment = exports.editComment = exports.uploadComment = exports.getComments = void 0;
const post_1 = __importDefault(require("../models/post"));
const user_1 = __importDefault(require("../models/user"));
const comment_1 = __importDefault(require("../models/comment"));
/* 게시글에 달란 댓글 조회 기능 */
const getComments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { post_id } = req.params;
    try {
        // @ts-ignore
        const comments = yield comment_1.default.findAll({
            where: { post_id },
            attributes: { exclude: ["deletedAt"] },
            include: [
                { model: user_1.default, attributes: ["user_id", "email", "nickname", "role"] },
                { model: post_1.default, attributes: ["post_id"] },
            ],
        });
        return res.json({ ok: true, rows: comments });
    }
    catch (error) {
        // 클라이언트 요청에 문제가 있었다고 보고 => 400 Bad Request
        return res.status(400).json({ ok: false, message: error.message });
    }
});
exports.getComments = getComments;
/* 게시글에 댓글 등록 기능 */
const uploadComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user: { user_id }, } = res.locals;
    const { post_id } = req.params;
    const { content } = req.body;
    try {
        // @ts-ignore
        yield comment_1.default.create({ user_id, post_id, content });
        // 코멘트 생성 완료되었으므로 => 201 Created
        return res.status(201).json({ ok: true });
    }
    catch (error) {
        // 클라이언트 요청에 문제가 있었다고 보고 => 400 Bad Request
        return res.status(400).json({ ok: false, message: error.message });
    }
});
exports.uploadComment = uploadComment;
/* 게시글에 달린 댓글 수정 기능 */
const editComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user: { user_id }, } = res.locals;
    const { comment_id } = req.params;
    const { content } = req.body;
    try {
        // @ts-ignore
        yield comment_1.default.update({ content }, { where: { user_id, comment_id } });
        return res.json({ ok: true });
    }
    catch (error) {
        // 클라이언트 요청에 문제가 있었다고 보고 => 400 Bad Request
        return res.status(400).json({ ok: false, message: error.message });
    }
});
exports.editComment = editComment;
/* 게시글에 달린 댓글 삭제 기능 */
const removeComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user: { user_id }, } = res.locals;
    const { comment_id } = req.params;
    try {
        // TODO: [요구사항 6] 관리자 권한 추가하여 모든 게시글, 댓글 삭제 가능하도록 (user의 role이 1이면 comment_id만으로 삭제가능)
        // @ts-ignore
        const user = yield user_1.default.findOne({ where: user_id });
        // @ts-ignore
        if (user.role === 1) {
            // @ts-ignore
            yield comment_1.default.destroy({ where: { comment_id } });
        }
        else {
            // @ts-ignore
            yield comment_1.default.destroy({ where: { user_id, comment_id } });
        }
        return res.json({ ok: true });
    }
    catch (error) {
        // 클라이언트 요청에 문제가 있었다고 보고 => 400 Bad Request
        return res.status(400).json({ ok: false, message: error.message });
    }
});
exports.removeComment = removeComment;
