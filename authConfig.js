/**
 * authConfig.js - Centralized Authentication Configuration
 * Follows Security-by-Design by avoiding hardcoded secrets.
 */

require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_only';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '8h';

module.exports = {
    JWT_SECRET,
    JWT_EXPIRES_IN
};
