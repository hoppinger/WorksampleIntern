"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parse_date = (e) => { return Object.assign({}, e, { CreatedDate: Date.parse(e.CreatedDate) }); };
exports.make_page = (res, parse_other_args) => {
    return {
        Items: res.Items.map((i) => { return Object.assign({}, i, { Item: exports.parse_date(i.Item) }); }).map((i) => { return Object.assign({}, i, { Item: parse_other_args(i.Item) }); }),
        PageIndex: res.PageIndex,
        NumPages: res.NumPages,
        PageSize: res.PageSize
    };
};
function get_HomePage_HomePage_Courses(source, page_index, page_size) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/HomePage/${source.Id}/HomePage_Courses?page_index=${page_index}&page_size=${page_size}`, { method: 'get', credentials: 'include', headers: { 'content-type': 'application/json' } });
        if (!res.ok)
            throw Error(res.statusText);
        let json = yield res.json();
        return exports.make_page(json, e => { return Object.assign({}, e); });
    });
}
exports.get_HomePage_HomePage_Courses = get_HomePage_HomePage_Courses;
function create_HomePage() {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/HomePage/`, { method: 'post', credentials: 'include', headers: { 'content-type': 'application/json',
                'X-XSRF-TOKEN': document.getElementsByName("__RequestVerificationToken")[0].value } });
        if (!res.ok)
            throw Error(res.statusText);
        let json = yield res.json();
        return Object.assign({}, json, { CreatedDate: new Date(json.CreatedDate) });
    });
}
exports.create_HomePage = create_HomePage;
function update_HomePage(item) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/HomePage/`, { method: 'put', body: JSON.stringify(Object.assign({}, item, { CreatedDate: undefined })), credentials: 'include', headers: { 'content-type': 'application/json', 'X-XSRF-TOKEN': document.getElementsByName("__RequestVerificationToken")[0].value } });
        if (!res.ok)
            throw Error(res.statusText);
        return;
    });
}
exports.update_HomePage = update_HomePage;
function delete_HomePage(source) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/HomePage/${source.Id}`, { method: 'delete', credentials: 'include', headers: { 'content-type': 'application/json', 'X-XSRF-TOKEN': document.getElementsByName("__RequestVerificationToken")[0].value } });
        if (!res.ok)
            throw Error(res.statusText);
        return;
    });
}
exports.delete_HomePage = delete_HomePage;
function get_HomePage(id) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/HomePage/${id}`, { method: 'get', credentials: 'include', headers: { 'content-type': 'application/json' } });
        if (!res.ok)
            throw Error(res.statusText);
        let json = yield res.json();
        return Object.assign({}, json, { CreatedDate: new Date(json.CreatedDate) });
    });
}
exports.get_HomePage = get_HomePage;
function get_HomePages(page_index, page_size) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/HomePage?page_index=${page_index}&page_size=${page_size}`, { method: 'get', credentials: 'include', headers: { 'content-type': 'application/json' } });
        if (!res.ok)
            throw Error(res.statusText);
        let json = yield res.json();
        return exports.make_page(json, e => { return Object.assign({}, e); });
    });
}
exports.get_HomePages = get_HomePages;
function get_Course_HomePage_Courses(source, page_index, page_size) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Course/${source.Id}/HomePage_Courses?page_index=${page_index}&page_size=${page_size}`, { method: 'get', credentials: 'include', headers: { 'content-type': 'application/json' } });
        if (!res.ok)
            throw Error(res.statusText);
        let json = yield res.json();
        return exports.make_page(json, e => { return Object.assign({}, e); });
    });
}
exports.get_Course_HomePage_Courses = get_Course_HomePage_Courses;
function get_Course_Course_Lectures(source, page_index, page_size) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Course/${source.Id}/Course_Lectures?page_index=${page_index}&page_size=${page_size}`, { method: 'get', credentials: 'include', headers: { 'content-type': 'application/json' } });
        if (!res.ok)
            throw Error(res.statusText);
        let json = yield res.json();
        return exports.make_page(json, e => { return Object.assign({}, e); });
    });
}
exports.get_Course_Course_Lectures = get_Course_Course_Lectures;
function get_unlinked_Course_Course_Lectures(source, page_index, page_size) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Course/${source.Id}/unlinked/Course_Lectures?page_index=${page_index}&page_size=${page_size}`, { method: 'get', credentials: 'include', headers: { 'content-type': 'application/json' } });
        if (!res.ok)
            throw Error(res.statusText);
        let json = yield res.json();
        return exports.make_page(json, e => { return Object.assign({}, e); });
    });
}
exports.get_unlinked_Course_Course_Lectures = get_unlinked_Course_Course_Lectures;
function create_linked_Course_Course_Lectures_Lecture(source) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Course/${source.Id}/Course_Lectures_Lecture`, { method: 'post', credentials: 'include', headers: { 'content-type': 'application/json' } });
        if (!res.ok)
            throw Error(res.statusText);
        let json = yield res.json();
        return json.map(e => { return Object.assign({}, e, { CreatedDate: new Date(e.CreatedDate) }); });
    });
}
exports.create_linked_Course_Course_Lectures_Lecture = create_linked_Course_Course_Lectures_Lecture;
function link_Course_Course_Lectures(source, target) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Course/${source.Id}/Course_Lectures/${target.Id}`, { method: 'post', credentials: 'include', headers: { 'content-type': 'application/json' } });
        if (!res.ok)
            throw Error(res.statusText);
        return;
    });
}
exports.link_Course_Course_Lectures = link_Course_Course_Lectures;
function unlink_Course_Course_Lectures(source, target) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Course/${source.Id}/Course_Lectures/${target.Id}`, { method: 'delete', credentials: 'include', headers: { 'content-type': 'application/json' } });
        if (!res.ok)
            throw Error(res.statusText);
        return;
    });
}
exports.unlink_Course_Course_Lectures = unlink_Course_Course_Lectures;
function create_Course() {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Course/`, { method: 'post', credentials: 'include', headers: { 'content-type': 'application/json',
                'X-XSRF-TOKEN': document.getElementsByName("__RequestVerificationToken")[0].value } });
        if (!res.ok)
            throw Error(res.statusText);
        let json = yield res.json();
        return Object.assign({}, json, { CreatedDate: new Date(json.CreatedDate) });
    });
}
exports.create_Course = create_Course;
function update_Course(item) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Course/`, { method: 'put', body: JSON.stringify(Object.assign({}, item, { CreatedDate: undefined })), credentials: 'include', headers: { 'content-type': 'application/json', 'X-XSRF-TOKEN': document.getElementsByName("__RequestVerificationToken")[0].value } });
        if (!res.ok)
            throw Error(res.statusText);
        return;
    });
}
exports.update_Course = update_Course;
function delete_Course(source) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Course/${source.Id}`, { method: 'delete', credentials: 'include', headers: { 'content-type': 'application/json', 'X-XSRF-TOKEN': document.getElementsByName("__RequestVerificationToken")[0].value } });
        if (!res.ok)
            throw Error(res.statusText);
        return;
    });
}
exports.delete_Course = delete_Course;
function get_Course(id) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Course/${id}`, { method: 'get', credentials: 'include', headers: { 'content-type': 'application/json' } });
        if (!res.ok)
            throw Error(res.statusText);
        let json = yield res.json();
        return Object.assign({}, json, { CreatedDate: new Date(json.CreatedDate) });
    });
}
exports.get_Course = get_Course;
function get_Courses(page_index, page_size) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Course?page_index=${page_index}&page_size=${page_size}`, { method: 'get', credentials: 'include', headers: { 'content-type': 'application/json' } });
        if (!res.ok)
            throw Error(res.statusText);
        let json = yield res.json();
        return exports.make_page(json, e => { return Object.assign({}, e); });
    });
}
exports.get_Courses = get_Courses;
function get_Lecture_Course_Lectures(source, page_index, page_size) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Lecture/${source.Id}/Course_Lectures?page_index=${page_index}&page_size=${page_size}`, { method: 'get', credentials: 'include', headers: { 'content-type': 'application/json' } });
        if (!res.ok)
            throw Error(res.statusText);
        let json = yield res.json();
        return exports.make_page(json, e => { return Object.assign({}, e); });
    });
}
exports.get_Lecture_Course_Lectures = get_Lecture_Course_Lectures;
function get_unlinked_Lecture_Course_Lectures(source, page_index, page_size) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Lecture/${source.Id}/unlinked/Course_Lectures?page_index=${page_index}&page_size=${page_size}`, { method: 'get', credentials: 'include', headers: { 'content-type': 'application/json' } });
        if (!res.ok)
            throw Error(res.statusText);
        let json = yield res.json();
        return exports.make_page(json, e => { return Object.assign({}, e); });
    });
}
exports.get_unlinked_Lecture_Course_Lectures = get_unlinked_Lecture_Course_Lectures;
function create_linked_Lecture_Course_Lectures_Course(source) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Lecture/${source.Id}/Course_Lectures_Course`, { method: 'post', credentials: 'include', headers: { 'content-type': 'application/json' } });
        if (!res.ok)
            throw Error(res.statusText);
        let json = yield res.json();
        return json.map(e => { return Object.assign({}, e, { CreatedDate: new Date(e.CreatedDate) }); });
    });
}
exports.create_linked_Lecture_Course_Lectures_Course = create_linked_Lecture_Course_Lectures_Course;
function link_Lecture_Course_Lectures(source, target) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Lecture/${source.Id}/Course_Lectures/${target.Id}`, { method: 'post', credentials: 'include', headers: { 'content-type': 'application/json' } });
        if (!res.ok)
            throw Error(res.statusText);
        return;
    });
}
exports.link_Lecture_Course_Lectures = link_Lecture_Course_Lectures;
function unlink_Lecture_Course_Lectures(source, target) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Lecture/${source.Id}/Course_Lectures/${target.Id}`, { method: 'delete', credentials: 'include', headers: { 'content-type': 'application/json' } });
        if (!res.ok)
            throw Error(res.statusText);
        return;
    });
}
exports.unlink_Lecture_Course_Lectures = unlink_Lecture_Course_Lectures;
function get_Lecture_Lecture_Topics(source, page_index, page_size) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Lecture/${source.Id}/Lecture_Topics?page_index=${page_index}&page_size=${page_size}`, { method: 'get', credentials: 'include', headers: { 'content-type': 'application/json' } });
        if (!res.ok)
            throw Error(res.statusText);
        let json = yield res.json();
        return exports.make_page(json, e => { return Object.assign({}, e); });
    });
}
exports.get_Lecture_Lecture_Topics = get_Lecture_Lecture_Topics;
function get_unlinked_Lecture_Lecture_Topics(source, page_index, page_size) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Lecture/${source.Id}/unlinked/Lecture_Topics?page_index=${page_index}&page_size=${page_size}`, { method: 'get', credentials: 'include', headers: { 'content-type': 'application/json' } });
        if (!res.ok)
            throw Error(res.statusText);
        let json = yield res.json();
        return exports.make_page(json, e => { return Object.assign({}, e); });
    });
}
exports.get_unlinked_Lecture_Lecture_Topics = get_unlinked_Lecture_Lecture_Topics;
function create_linked_Lecture_Lecture_Topics_Topic(source) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Lecture/${source.Id}/Lecture_Topics_Topic`, { method: 'post', credentials: 'include', headers: { 'content-type': 'application/json' } });
        if (!res.ok)
            throw Error(res.statusText);
        let json = yield res.json();
        return json.map(e => { return Object.assign({}, e, { CreatedDate: new Date(e.CreatedDate) }); });
    });
}
exports.create_linked_Lecture_Lecture_Topics_Topic = create_linked_Lecture_Lecture_Topics_Topic;
function link_Lecture_Lecture_Topics(source, target) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Lecture/${source.Id}/Lecture_Topics/${target.Id}`, { method: 'post', credentials: 'include', headers: { 'content-type': 'application/json' } });
        if (!res.ok)
            throw Error(res.statusText);
        return;
    });
}
exports.link_Lecture_Lecture_Topics = link_Lecture_Lecture_Topics;
function unlink_Lecture_Lecture_Topics(source, target) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Lecture/${source.Id}/Lecture_Topics/${target.Id}`, { method: 'delete', credentials: 'include', headers: { 'content-type': 'application/json' } });
        if (!res.ok)
            throw Error(res.statusText);
        return;
    });
}
exports.unlink_Lecture_Lecture_Topics = unlink_Lecture_Lecture_Topics;
function create_Lecture() {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Lecture/`, { method: 'post', credentials: 'include', headers: { 'content-type': 'application/json',
                'X-XSRF-TOKEN': document.getElementsByName("__RequestVerificationToken")[0].value } });
        if (!res.ok)
            throw Error(res.statusText);
        let json = yield res.json();
        return Object.assign({}, json, { CreatedDate: new Date(json.CreatedDate) });
    });
}
exports.create_Lecture = create_Lecture;
function update_Lecture(item) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Lecture/`, { method: 'put', body: JSON.stringify(Object.assign({}, item, { CreatedDate: undefined })), credentials: 'include', headers: { 'content-type': 'application/json', 'X-XSRF-TOKEN': document.getElementsByName("__RequestVerificationToken")[0].value } });
        if (!res.ok)
            throw Error(res.statusText);
        return;
    });
}
exports.update_Lecture = update_Lecture;
function delete_Lecture(source) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Lecture/${source.Id}`, { method: 'delete', credentials: 'include', headers: { 'content-type': 'application/json', 'X-XSRF-TOKEN': document.getElementsByName("__RequestVerificationToken")[0].value } });
        if (!res.ok)
            throw Error(res.statusText);
        return;
    });
}
exports.delete_Lecture = delete_Lecture;
function get_Lecture(id) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Lecture/${id}`, { method: 'get', credentials: 'include', headers: { 'content-type': 'application/json' } });
        if (!res.ok)
            throw Error(res.statusText);
        let json = yield res.json();
        return Object.assign({}, json, { CreatedDate: new Date(json.CreatedDate) });
    });
}
exports.get_Lecture = get_Lecture;
function get_Lectures(page_index, page_size) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Lecture?page_index=${page_index}&page_size=${page_size}`, { method: 'get', credentials: 'include', headers: { 'content-type': 'application/json' } });
        if (!res.ok)
            throw Error(res.statusText);
        let json = yield res.json();
        return exports.make_page(json, e => { return Object.assign({}, e); });
    });
}
exports.get_Lectures = get_Lectures;
function get_Topic_Lecture_Topics(source, page_index, page_size) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Topic/${source.Id}/Lecture_Topics?page_index=${page_index}&page_size=${page_size}`, { method: 'get', credentials: 'include', headers: { 'content-type': 'application/json' } });
        if (!res.ok)
            throw Error(res.statusText);
        let json = yield res.json();
        return exports.make_page(json, e => { return Object.assign({}, e); });
    });
}
exports.get_Topic_Lecture_Topics = get_Topic_Lecture_Topics;
function get_unlinked_Topic_Lecture_Topics(source, page_index, page_size) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Topic/${source.Id}/unlinked/Lecture_Topics?page_index=${page_index}&page_size=${page_size}`, { method: 'get', credentials: 'include', headers: { 'content-type': 'application/json' } });
        if (!res.ok)
            throw Error(res.statusText);
        let json = yield res.json();
        return exports.make_page(json, e => { return Object.assign({}, e); });
    });
}
exports.get_unlinked_Topic_Lecture_Topics = get_unlinked_Topic_Lecture_Topics;
function create_linked_Topic_Lecture_Topics_Lecture(source) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Topic/${source.Id}/Lecture_Topics_Lecture`, { method: 'post', credentials: 'include', headers: { 'content-type': 'application/json' } });
        if (!res.ok)
            throw Error(res.statusText);
        let json = yield res.json();
        return json.map(e => { return Object.assign({}, e, { CreatedDate: new Date(e.CreatedDate) }); });
    });
}
exports.create_linked_Topic_Lecture_Topics_Lecture = create_linked_Topic_Lecture_Topics_Lecture;
function link_Topic_Lecture_Topics(source, target) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Topic/${source.Id}/Lecture_Topics/${target.Id}`, { method: 'post', credentials: 'include', headers: { 'content-type': 'application/json' } });
        if (!res.ok)
            throw Error(res.statusText);
        return;
    });
}
exports.link_Topic_Lecture_Topics = link_Topic_Lecture_Topics;
function unlink_Topic_Lecture_Topics(source, target) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Topic/${source.Id}/Lecture_Topics/${target.Id}`, { method: 'delete', credentials: 'include', headers: { 'content-type': 'application/json' } });
        if (!res.ok)
            throw Error(res.statusText);
        return;
    });
}
exports.unlink_Topic_Lecture_Topics = unlink_Topic_Lecture_Topics;
function create_Topic() {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Topic/`, { method: 'post', credentials: 'include', headers: { 'content-type': 'application/json',
                'X-XSRF-TOKEN': document.getElementsByName("__RequestVerificationToken")[0].value } });
        if (!res.ok)
            throw Error(res.statusText);
        let json = yield res.json();
        return Object.assign({}, json, { CreatedDate: new Date(json.CreatedDate) });
    });
}
exports.create_Topic = create_Topic;
function update_Topic(item) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Topic/`, { method: 'put', body: JSON.stringify(Object.assign({}, item, { CreatedDate: undefined })), credentials: 'include', headers: { 'content-type': 'application/json', 'X-XSRF-TOKEN': document.getElementsByName("__RequestVerificationToken")[0].value } });
        if (!res.ok)
            throw Error(res.statusText);
        return;
    });
}
exports.update_Topic = update_Topic;
function delete_Topic(source) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Topic/${source.Id}`, { method: 'delete', credentials: 'include', headers: { 'content-type': 'application/json', 'X-XSRF-TOKEN': document.getElementsByName("__RequestVerificationToken")[0].value } });
        if (!res.ok)
            throw Error(res.statusText);
        return;
    });
}
exports.delete_Topic = delete_Topic;
function get_Topic(id) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Topic/${id}`, { method: 'get', credentials: 'include', headers: { 'content-type': 'application/json' } });
        if (!res.ok)
            throw Error(res.statusText);
        let json = yield res.json();
        return Object.assign({}, json, { CreatedDate: new Date(json.CreatedDate) });
    });
}
exports.get_Topic = get_Topic;
function get_Topics(page_index, page_size) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Topic?page_index=${page_index}&page_size=${page_size}`, { method: 'get', credentials: 'include', headers: { 'content-type': 'application/json' } });
        if (!res.ok)
            throw Error(res.statusText);
        let json = yield res.json();
        return exports.make_page(json, e => { return Object.assign({}, e); });
    });
}
exports.get_Topics = get_Topics;
//# sourceMappingURL=generated_api.js.map