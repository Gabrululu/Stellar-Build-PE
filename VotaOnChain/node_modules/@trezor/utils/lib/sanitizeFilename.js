"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sanitizeFilename = void 0;
const MAX_FILENAME_LENGTH = 250;
const sanitizeFilename = (filename, replacement = '_') => {
  if (!filename || filename.trim().length === 0) {
    return undefined;
  }
  const illegalRe = /[<>:"\/\\|?*\x00-\x1F]/g;
  let safeName = filename.replace(illegalRe, replacement);
  if (safeName.length > MAX_FILENAME_LENGTH) {
    safeName = safeName.substring(0, MAX_FILENAME_LENGTH);
  }
  safeName = safeName.replace(/[. ]+$/, '');
  const reservedRe = /^(con|prn|aux|nul|com[0-9]|lpt[0-9])$/i;
  if (reservedRe.test(safeName)) {
    safeName = `${safeName}${replacement}`;
  }
  return safeName || undefined;
};
exports.sanitizeFilename = sanitizeFilename;
//# sourceMappingURL=sanitizeFilename.js.map