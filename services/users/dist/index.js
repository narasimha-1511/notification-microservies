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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const env_1 = require("./config/env");
const logger_1 = __importDefault(require("./utils/logger"));
const db_1 = __importDefault(require("./config/db"));
const prom_client_1 = require("prom-client");
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, prom_client_1.collectDefaultMetrics)({ register: prom_client_1.register });
        yield (0, db_1.default)();
        app_1.default.listen((0, env_1.getEnv)("PORT"), () => {
            logger_1.default.info(`user-service started on PORT : ${(0, env_1.getEnv)("PORT")}`);
        });
    }
    catch (error) {
        logger_1.default.error(`error starting user-service ${error}`);
        process.exit(1);
    }
});
main();
