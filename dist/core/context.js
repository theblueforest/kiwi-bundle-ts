"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = require("path");
var fs_1 = require("fs");
var dropin_recipes_1 = require("dropin-recipes");
var chalk_1 = __importDefault(require("chalk"));
class KiwiBundleContext {
    constructor(path, env = dropin_recipes_1.Environment.PRODUCTION) {
        this.bundles = {};
        this.path = path;
        this.env = env;
        this.load();
    }
    load() {
        const packageJsonPath = path_1.join(this.path, "package.json");
        const bundlePath = path_1.join(this.path, "node_modules", "kiwi-bundle");
        const bundleJsonPath = path_1.join(bundlePath, "package.json");
        if (fs_1.existsSync(packageJsonPath) && fs_1.existsSync(bundleJsonPath)) {
            this.package = JSON.parse(fs_1.readFileSync(packageJsonPath, "utf8"));
            this.bundles.core = JSON.parse(fs_1.readFileSync(bundleJsonPath, "utf8"));
        }
        const tsConfigPath = path_1.join(this.path, "tsconfig.json");
        if (fs_1.existsSync(tsConfigPath)) {
            const tsConfig = JSON.parse(fs_1.readFileSync(tsConfigPath, "utf8"));
            if (typeof tsConfig.extends !== "undefined") {
                const extendsConfig = JSON.parse(fs_1.readFileSync(path_1.join(this.path, tsConfig.extends), "utf8")).compilerOptions;
                if (typeof tsConfig.compilerOptions !== "undefined") {
                    this.compilerOptions = Object.assign(extendsConfig, tsConfig.compilerOptions);
                }
                else {
                    this.compilerOptions = tsConfig.compilerOptions;
                }
            }
            if (typeof this.compilerOptions.target === "string") {
                this.compilerOptions.target = `lib.${this.compilerOptions.target}.d.ts`;
            }
            if (typeof this.compilerOptions.lib === "object") {
                this.compilerOptions.lib = this.compilerOptions.lib.map((lib) => `lib.${lib}.d.ts`);
            }
        }
    }
    display() {
        console.log(chalk_1.default.green(" _____ _       _    _____           _ _"));
        console.log(chalk_1.default.green("|  |  |_|_ _ _|_|  | __  |_ _ ___ _| | |___"));
        console.log(chalk_1.default.green("|    -| | | | | |  | __ -| | |   | . | | -_|"));
        console.log(chalk_1.default.green("|__|__|_|_____|_|  |_____|___|_|_|___|_|___|\n"));
        if (this.env === dropin_recipes_1.Environment.PRODUCTION) {
            console.log("============ [PRODUCTION MODE] =============");
        }
        else {
            console.log("============ [DEVELOPMENT MODE] ============");
        }
        console.log("Current package :", this.package.name);
        console.log("Current version :", this.package.version);
        console.log("Bundle version  :", this.bundles.core.version);
        console.log("============================================\n");
    }
}
exports.KiwiBundleContext = KiwiBundleContext;
