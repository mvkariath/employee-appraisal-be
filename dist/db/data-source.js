"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const typeorm_naming_strategies_1 = require("typeorm-naming-strategies");
require("dotenv/config");
const datasource = new typeorm_1.DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    database: 'empAppraisalDb',
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    extra: { max: 5, min: 2 },
    synchronize: false,
    logging: true,
    namingStrategy: new typeorm_naming_strategies_1.SnakeNamingStrategy(),
    entities: ['dist/src/entities/*.js'],
    migrations: ["dist/db/migrations/*.js"]
});
exports.default = datasource;
//# sourceMappingURL=data-source.js.map