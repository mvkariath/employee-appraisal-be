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
exports.Status = void 0;
const typeorm_1 = require("typeorm");
const employee_entity_1 = __importDefault(require("./employee.entity"));
const abstract_entity_1 = __importDefault(require("./abstract.entity"));
var Status;
(function (Status) {
    Status["INITIATED"] = "INITIATED";
    Status["IN_PROGRESS"] = "IN_PROGRESS";
    Status["COMPLETED"] = "COMPLETED";
})(Status || (exports.Status = Status = {}));
let AppraisalCycle = class AppraisalCycle extends abstract_entity_1.default {
    constructor() {
        super(...arguments);
        this.status = Status;
    }
};
__decorate([
    (0, typeorm_1.Column)({ length: 100 }),
    __metadata("design:type", String)
], AppraisalCycle.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", String)
], AppraisalCycle.prototype, "start_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", String)
], AppraisalCycle.prototype, "end_date", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: Status,
        default: Status.INITIATED
    }),
    __metadata("design:type", Object)
], AppraisalCycle.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => employee_entity_1.default),
    (0, typeorm_1.JoinColumn)({ name: 'created_by' }),
    __metadata("design:type", employee_entity_1.default)
], AppraisalCycle.prototype, "created_by", void 0);
AppraisalCycle = __decorate([
    (0, typeorm_1.Entity)('appraisal_cycles')
], AppraisalCycle);
exports.default = AppraisalCycle;
//# sourceMappingURL=AppraisalCycle.entity.js.map