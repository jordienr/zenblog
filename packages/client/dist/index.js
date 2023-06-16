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
exports.createClient = void 0;
const BASE_URL = "https://localhost:300/api";
function throwError(msg) {
    throw new Error("[🍊] " + msg);
}
function wait(ms) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve) => setTimeout(resolve, ms));
    });
}
function createClient({ privateKey }) {
    if (!privateKey) {
        throwError("privateKey is required");
    }
    return {
        getPosts() {
            return __awaiter(this, void 0, void 0, function* () {
                return [
                    { title: "How to start a cult", slug: "how-to-start-a-cult" },
                    { title: "Cultpreneurship", slug: "cultpreneurship" },
                    { title: "Groupthinking essentials", slug: "groupthinking-essentials" },
                ];
            });
        },
        getPost(id) {
            return __awaiter(this, void 0, void 0, function* () {
                return { title: "hello world", slug: "hello-world", content: "..." };
            });
        },
    };
}
exports.createClient = createClient;
//# sourceMappingURL=index.js.map