"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Appraisal = exports.Status = void 0;
const typeorm_1 = require("typeorm");
const employee_entity_1 = __importDefault(require("./employee.entity"));
const AppraisalCycle_entity_1 = __importDefault(require("./AppraisalCycle.entity"));
const abstract_entity_1 = __importDefault(require("./abstract.entity"));
var Status;
(function (Status) {
    Status["NA"] = "N/A";
    Status["INITIATED"] = "INITIATED";
    Status["SELF_APPRAISED"] = "SELF_APPRAISED";
    Status["INITIATE_FEEDBACK"] = "INITIATE_FEEDBACK";
    Status["FEEDBACK_SUBMITTED"] = "FEEDBACK_SUBMITTED";
    Status["MEETING_DONE"] = "MEETING_DONE";
    Status["DONE"] = "DONE";
    Status["ALL_DONE"] = "ALL_DONE";
})(Status || (exports.Status = Status = {}));
let Appraisal = class Appraisal extends abstract_entity_1.default {
};
exports.Appraisal = Appraisal;
__decorate([
    (0, typeorm_1.ManyToOne)(() => employee_entity_1.default),
    (0, typeorm_1.JoinColumn)({ name: 'employee_id' }),
    __metadata("design:type", employee_entity_1.default)
], Appraisal.prototype, "employee", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => AppraisalCycle_entity_1.default),
    (0, typeorm_1.JoinColumn)({ name: 'cycle_id' }),
    __metadata("design:type", AppraisalCycle_entity_1.default)
], Appraisal.prototype, "cycle", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: Status,
        default: Status.NA
    }),
    __metadata("design:type", String)
], Appraisal.prototype, "current_status", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 20 }),
    __metadata("design:type", String)
], Appraisal.prototype, "remarks_by", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], Appraisal.prototype, "content", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Appraisal.prototype, "submitted_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Appraisal.prototype, "closed_at", void 0);
exports.Appraisal = Appraisal = __decorate([
    (0, typeorm_1.Entity)('appraisals')
], Appraisal);
//# sourceMappingURL=Appraisal.entity.js.map