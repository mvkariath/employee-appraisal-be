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
exports.IndividualDevelopmentPlan = exports.IDP_Competency = void 0;
const typeorm_1 = require("typeorm");
const Appraisal_entity_1 = require("./Appraisal.entity");
const employee_entity_1 = __importDefault(require(".//employee.entity"));
const abstract_entity_1 = __importDefault(require("./abstract.entity"));
var IDP_Competency;
(function (IDP_Competency) {
    IDP_Competency["TECHNICAL"] = "TECHNICAL";
    IDP_Competency["BEHAVIORAL"] = "BEHAVIORAL";
    IDP_Competency["FUNCTIONAL"] = "FUNCTIONAL";
})(IDP_Competency || (exports.IDP_Competency = IDP_Competency = {}));
let IndividualDevelopmentPlan = class IndividualDevelopmentPlan extends abstract_entity_1.default {
};
exports.IndividualDevelopmentPlan = IndividualDevelopmentPlan;
__decorate([
    (0, typeorm_1.OneToOne)(() => Appraisal_entity_1.Appraisal),
    (0, typeorm_1.JoinColumn)({ name: 'appraisal_id' }),
    __metadata("design:type", Appraisal_entity_1.Appraisal)
], IndividualDevelopmentPlan.prototype, "appraisal", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: IDP_Competency,
        default: IDP_Competency.TECHNICAL
    }),
    __metadata("design:type", String)
], IndividualDevelopmentPlan.prototype, "competency", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], IndividualDevelopmentPlan.prototype, "technical_objective", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], IndividualDevelopmentPlan.prototype, "technical_plan", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => employee_entity_1.default),
    (0, typeorm_1.JoinColumn)({ name: 'filled_by' }),
    __metadata("design:type", employee_entity_1.default)
], IndividualDevelopmentPlan.prototype, "filled_by", void 0);
exports.IndividualDevelopmentPlan = IndividualDevelopmentPlan = __decorate([
    (0, typeorm_1.Entity)('individual_development_plan')
], IndividualDevelopmentPlan);
//# sourceMappingURL=IndividualDevelopmentPlan.entity.js.map