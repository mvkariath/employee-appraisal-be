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
exports.TableInitialization1749954572138 = void 0;
class TableInitialization1749954572138 {
    constructor() {
        this.name = 'TableInitialization1749954572138';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`CREATE TYPE "public"."employee_role_enum" AS ENUM('LEAD', 'DEVELOPER', 'HR')`);
            yield queryRunner.query(`CREATE TYPE "public"."employee_status_enum" AS ENUM('ACTIVE', 'INACTIVE', 'PROBATION')`);
            yield queryRunner.query(`CREATE TABLE "employee" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "employee_id" character varying NOT NULL, "email" character varying NOT NULL, "name" character varying NOT NULL, "age" integer NOT NULL, "role" "public"."employee_role_enum" NOT NULL DEFAULT 'DEVELOPER', "password" character varying NOT NULL, "experience" integer NOT NULL, "status" "public"."employee_status_enum" NOT NULL DEFAULT 'INACTIVE', "date_of_joining" date NOT NULL, CONSTRAINT "UQ_f9d306b968b54923539b3936b03" UNIQUE ("employee_id"), CONSTRAINT "UQ_817d1d427138772d47eca048855" UNIQUE ("email"), CONSTRAINT "PK_3c2bc72f03fd5abbbc5ac169498" PRIMARY KEY ("id"))`);
            yield queryRunner.query(`CREATE TABLE "audit_logs" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "action" text NOT NULL, "table_name" text NOT NULL, "record_id" integer NOT NULL, "old_value" json, "new_value" json, "timestamp" TIMESTAMP NOT NULL DEFAULT now(), "employee_id" integer, CONSTRAINT "PK_1bb179d048bbc581caa3b013439" PRIMARY KEY ("id"))`);
            yield queryRunner.query(`CREATE TYPE "public"."appraisal_cycles_status_enum" AS ENUM('INITIATED', 'IN_PROGRESS', 'COMPLETED')`);
            yield queryRunner.query(`CREATE TABLE "appraisal_cycles" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "name" character varying(100) NOT NULL, "start_date" date NOT NULL, "end_date" date NOT NULL, "status" "public"."appraisal_cycles_status_enum" NOT NULL DEFAULT 'INITIATED', "created_by" integer, CONSTRAINT "PK_f677a325911322fb9328bbb0b9d" PRIMARY KEY ("id"))`);
            yield queryRunner.query(`CREATE TYPE "public"."appraisals_current_status_enum" AS ENUM('N/A', 'INITIATED', 'SELF_APPRAISED', 'INITIATE_FEEDBACK', 'FEEDBACK_SUBMITTED', 'MEETING_DONE', 'DONE', 'ALL_DONE')`);
            yield queryRunner.query(`CREATE TABLE "appraisals" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "current_status" "public"."appraisals_current_status_enum" NOT NULL DEFAULT 'N/A', "remarks_by" character varying(20) NOT NULL, "content" text NOT NULL, "submitted_at" TIMESTAMP, "closed_at" TIMESTAMP, "employee_id" integer, "cycle_id" integer, CONSTRAINT "PK_c4c4dfe76db3c762a3193370d02" PRIMARY KEY ("id"))`);
            yield queryRunner.query(`CREATE TABLE "self_appraisal_entries" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "delivery_details" text NOT NULL, "accomplishments" text NOT NULL, "approach_solution" text NOT NULL, "improvement_possibilities" text NOT NULL, "project_time_frame" text NOT NULL, "appraisal_id" integer, CONSTRAINT "PK_f54c6b4e2592177ad0320c7639b" PRIMARY KEY ("id"))`);
            yield queryRunner.query(`CREATE TYPE "public"."individual_development_plan_competency_enum" AS ENUM('TECHNICAL', 'BEHAVIORAL', 'FUNCTIONAL')`);
            yield queryRunner.query(`CREATE TABLE "individual_development_plan" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "competency" "public"."individual_development_plan_competency_enum" NOT NULL DEFAULT 'TECHNICAL', "technical_objective" text NOT NULL, "technical_plan" text NOT NULL, "appraisal_id" integer, "filled_by" integer, CONSTRAINT "REL_f506915b2c4c123d4bd016389c" UNIQUE ("appraisal_id"), CONSTRAINT "PK_31c5b742040499463f3f9985aa4" PRIMARY KEY ("id"))`);
            yield queryRunner.query(`CREATE TYPE "public"."performance_factors_competency_enum" AS ENUM('TECHNICAL', 'FUNCTIONAL', 'COMMUNICATION', 'ENERGY & DRIVE', 'RESPONSIBILITY & TRUST', 'TEAMWORK', 'MANAGING PROCESSES & WORK')`);
            yield queryRunner.query(`CREATE TABLE "performance_factors" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "competency" "public"."performance_factors_competency_enum" NOT NULL DEFAULT 'TECHNICAL', "strengths" text NOT NULL, "improvements" text NOT NULL, "rating" integer NOT NULL, "appraisal_id" integer, CONSTRAINT "PK_28d0c6450edf207d8ada9dc9166" PRIMARY KEY ("id"))`);
            yield queryRunner.query(`CREATE TABLE "appraisal_leads" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "appraisal_id" integer, "lead_id" integer, CONSTRAINT "PK_63df4c7da996b06e8e6519fdd56" PRIMARY KEY ("id"))`);
            yield queryRunner.query(`ALTER TABLE "audit_logs" ADD CONSTRAINT "FK_d58632e91171a9cb02fc1562383" FOREIGN KEY ("employee_id") REFERENCES "employee"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE "appraisal_cycles" ADD CONSTRAINT "FK_3024bca457bb6a68b0605d803df" FOREIGN KEY ("created_by") REFERENCES "employee"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE "appraisals" ADD CONSTRAINT "FK_c5410c173bc7d9694f99fa91ae5" FOREIGN KEY ("employee_id") REFERENCES "employee"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE "appraisals" ADD CONSTRAINT "FK_c16605301b8264f9f89b741eeec" FOREIGN KEY ("cycle_id") REFERENCES "appraisal_cycles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE "self_appraisal_entries" ADD CONSTRAINT "FK_d3c0657e98b389e5a83dc20ad77" FOREIGN KEY ("appraisal_id") REFERENCES "appraisals"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE "individual_development_plan" ADD CONSTRAINT "FK_f506915b2c4c123d4bd016389cc" FOREIGN KEY ("appraisal_id") REFERENCES "appraisals"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE "individual_development_plan" ADD CONSTRAINT "FK_8745b787de2792c318b3f0d4a8d" FOREIGN KEY ("filled_by") REFERENCES "employee"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE "performance_factors" ADD CONSTRAINT "FK_a87806199b5851e951ba699d9d5" FOREIGN KEY ("appraisal_id") REFERENCES "appraisals"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE "appraisal_leads" ADD CONSTRAINT "FK_3cfd1dda8bf6c54e77123fc2e2a" FOREIGN KEY ("appraisal_id") REFERENCES "appraisals"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE "appraisal_leads" ADD CONSTRAINT "FK_fe780a0909032420c61c647e3a3" FOREIGN KEY ("lead_id") REFERENCES "employee"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE "appraisal_leads" DROP CONSTRAINT "FK_fe780a0909032420c61c647e3a3"`);
            yield queryRunner.query(`ALTER TABLE "appraisal_leads" DROP CONSTRAINT "FK_3cfd1dda8bf6c54e77123fc2e2a"`);
            yield queryRunner.query(`ALTER TABLE "performance_factors" DROP CONSTRAINT "FK_a87806199b5851e951ba699d9d5"`);
            yield queryRunner.query(`ALTER TABLE "individual_development_plan" DROP CONSTRAINT "FK_8745b787de2792c318b3f0d4a8d"`);
            yield queryRunner.query(`ALTER TABLE "individual_development_plan" DROP CONSTRAINT "FK_f506915b2c4c123d4bd016389cc"`);
            yield queryRunner.query(`ALTER TABLE "self_appraisal_entries" DROP CONSTRAINT "FK_d3c0657e98b389e5a83dc20ad77"`);
            yield queryRunner.query(`ALTER TABLE "appraisals" DROP CONSTRAINT "FK_c16605301b8264f9f89b741eeec"`);
            yield queryRunner.query(`ALTER TABLE "appraisals" DROP CONSTRAINT "FK_c5410c173bc7d9694f99fa91ae5"`);
            yield queryRunner.query(`ALTER TABLE "appraisal_cycles" DROP CONSTRAINT "FK_3024bca457bb6a68b0605d803df"`);
            yield queryRunner.query(`ALTER TABLE "audit_logs" DROP CONSTRAINT "FK_d58632e91171a9cb02fc1562383"`);
            yield queryRunner.query(`DROP TABLE "appraisal_leads"`);
            yield queryRunner.query(`DROP TABLE "performance_factors"`);
            yield queryRunner.query(`DROP TYPE "public"."performance_factors_competency_enum"`);
            yield queryRunner.query(`DROP TABLE "individual_development_plan"`);
            yield queryRunner.query(`DROP TYPE "public"."individual_development_plan_competency_enum"`);
            yield queryRunner.query(`DROP TABLE "self_appraisal_entries"`);
            yield queryRunner.query(`DROP TABLE "appraisals"`);
            yield queryRunner.query(`DROP TYPE "public"."appraisals_current_status_enum"`);
            yield queryRunner.query(`DROP TABLE "appraisal_cycles"`);
            yield queryRunner.query(`DROP TYPE "public"."appraisal_cycles_status_enum"`);
            yield queryRunner.query(`DROP TABLE "audit_logs"`);
            yield queryRunner.query(`DROP TABLE "employee"`);
            yield queryRunner.query(`DROP TYPE "public"."employee_status_enum"`);
            yield queryRunner.query(`DROP TYPE "public"."employee_role_enum"`);
        });
    }
}
exports.TableInitialization1749954572138 = TableInitialization1749954572138;
//# sourceMappingURL=1749954572138-table-initialization.js.map