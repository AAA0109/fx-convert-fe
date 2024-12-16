//config.js
module.exports = {
  files: ['./lib/api/**/data-contracts.ts', './lib/api/**/Api.ts'],
  from: [/[Nn]ull = null,/g, "'./http-client'"],
  to: ['null,', "'../http-client'"],
};
