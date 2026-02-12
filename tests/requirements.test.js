const test = require('node:test');
const assert = require('node:assert/strict');
const { API_ENDPOINTS, PAGES } = require('../src/config/apiCatalog');

test('project has at least 12 API endpoints', () => {
  assert.ok(API_ENDPOINTS.length >= 12);
});

test('project has at least 6 pages', () => {
  assert.ok(PAGES.length >= 6);
});
