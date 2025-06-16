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
exports.PerformanceFactor = exports.Competency = void 0;
const typeorm_1 = require("typeorm");
const Appraisal_entity_1 = require("./Appraisal.entity");
const abstract_entity_1 = __importDefault(require("./abstract.entity"));
var Competency;
(function (Competency) {
    Competency["TECHNICAL"] = "TECHNICAL";
    Competency["FUNCTIONAL"] = "FUNCTIONAL";
    Competency["COMMUNICATION"] = "COMMUNICATION";
    Competency["ENERGY_DRIVE"] = "ENERGY & DRIVE";
    Competency["RESPONSIBILITY_TRUST"] = "RESPONSIBILITY & TRUST";
    Competency["TEAMWORK"] = "TEAMWORK";
    Competency["MANAGINGPROCESSES_WORK"] = "MANAGING PROCESSES & WORK";
})(Competency || (exports.Competency = Competency = {}));
let PerformanceFactor = class PerformanceFactor extends abstract_entity_1.default {
};
exports.PerformanceFactor = PerformanceFactor;
__decorate([
    (0, typeorm_1.ManyToOne)(() => Appraisal_entity_1.Appraisal),
    (0, typeorm_1.JoinColumn)({ name: 'appraisal_id' }),
    __metadata("design:type", Appraisal_entity_1.Appraisal)
], PerformanceFactor.prototype, "appraisal", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: Competency,
        default: Competency.TECHNICAL
    }),
    __metadata("design:type", String)
], PerformanceFactor.prototype, "competency", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], PerformanceFactor.prototype, "strengths", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], PerformanceFactor.prototype, "improvements", void 0);
__decorate([
    (0, typeorm_1.Column)('int'),
    __metadata("design:type", Number)
], PerformanceFactor.prototype, "rating", void 0);
exports.PerformanceFactor = PerformanceFactor = __decorate([
    (0, typeorm_1.Entity)('performance_factors')
], PerformanceFactor);
//# sourceMappingURL=PerformanceFactor.entity.js.map