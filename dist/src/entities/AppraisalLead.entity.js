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
exports.AppraisalLead = void 0;
const typeorm_1 = require("typeorm");
const Appraisal_entity_1 = require("./Appraisal.entity");
const employee_entity_1 = __importDefault(require("./employee.entity"));
const abstract_entity_1 = __importDefault(require("./abstract.entity"));
let AppraisalLead = class AppraisalLead extends abstract_entity_1.default {
};
exports.AppraisalLead = AppraisalLead;
__decorate([
    (0, typeorm_1.ManyToOne)(() => Appraisal_entity_1.Appraisal),
    (0, typeorm_1.JoinColumn)({ name: 'appraisal_id' }),
    __metadata("design:type", Appraisal_entity_1.Appraisal)
], AppraisalLead.prototype, "appraisal", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => employee_entity_1.default),
    (0, typeorm_1.JoinColumn)({ name: 'lead_id' }),
    __metadata("design:type", employee_entity_1.default)
], AppraisalLead.prototype, "lead", void 0);
exports.AppraisalLead = AppraisalLead = __decorate([
    (0, typeorm_1.Entity)('appraisal_leads')
], AppraisalLead);
//# sourceMappingURL=AppraisalLead.entity.js.map