const assert = require('assert');
const main = require('..');

describe('youtube-dash', () => {
  it('returns with placeholder', () => {
    assert.equal(main(), 'youtube-dash');
  });
});
