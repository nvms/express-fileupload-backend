import * as path from 'path';
export const STATIC = path.join(__dirname, '..', 'public/');
export const TMP = path.join(__dirname, '..', 'tmp/');
export const APIV1 = '/api/v1/';
export const EXTERNALSTATIC = `${APIV1}static/`;
export const FILELIMIT = (+process.env.BYTERESTRICTOR) || 10485760; // 10MB.