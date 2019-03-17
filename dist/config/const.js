"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
exports.STATIC = path.join(__dirname, '..', 'public/');
exports.TMP = path.join(__dirname, '..', 'tmp/');
exports.APIV1 = '/api/v1/';
exports.EXTERNALSTATIC = `${exports.APIV1}static/`;
exports.FILELIMIT = (+process.env.BYTERESTRICTOR) || 10485760; // 10MB.
