"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createClient = void 0;
function createClient({ privateKey }) {
    function throwError(msg) {
        throw new Error("[🍊] " + msg);
    }
    if (!privateKey) {
        throwError("privateKey is required");
    }
    return {
        async getPosts() {
            return [
                { title: "How to start a cult", slug: "how-to-start-a-cult" },
                { title: "Cultpreneurship", slug: "cultpreneurship" },
                { title: "Groupthinking essentials", slug: "groupthinking-essentials" },
            ];
        },
        async getPost(id) {
            return { title: "hello world", slug: "hello-world", content: "..." };
        },
    };
}
exports.createClient = createClient;
//# sourceMappingURL=index.js.map