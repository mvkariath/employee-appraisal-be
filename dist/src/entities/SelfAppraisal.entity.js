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
exports.SelfAppraisalEntry = void 0;
const typeorm_1 = require("typeorm");
const Appraisal_entity_1 = require("./Appraisal.entity");
const abstract_entity_1 = __importDefault(require("./abstract.entity"));
let SelfAppraisalEntry = class SelfAppraisalEntry extends abstract_entity_1.default {
};
exports.SelfAppraisalEntry = SelfAppraisalEntry;
__decorate([
    (0, typeorm_1.ManyToOne)(() => Appraisal_entity_1.Appraisal),
    (0, typeorm_1.JoinColumn)({ name: 'appraisal_id' }),
    __metadata("design:type", Appraisal_entity_1.Appraisal)
], SelfAppraisalEntry.prototype, "appraisal", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], SelfAppraisalEntry.prototype, "delivery_details", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], SelfAppraisalEntry.prototype, "accomplishments", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], SelfAppraisalEntry.prototype, "approach_solution", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], SelfAppraisalEntry.prototype, "improvement_possibilities", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], SelfAppraisalEntry.prototype, "project_time_frame", void 0);
exports.SelfAppraisalEntry = SelfAppraisalEntry = __decorate([
    (0, typeorm_1.Entity)('self_appraisal_entries')
], SelfAppraisalEntry);
//# sourceMappingURL=SelfAppraisal.entity.js.map