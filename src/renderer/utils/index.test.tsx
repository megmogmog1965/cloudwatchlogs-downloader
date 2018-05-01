import * as index from './index';

describe('utils/index', () => {
  it('random: Referential transparency', () => {
    // invalid range.
    expect(() => index.random(0, 0, 0)).toThrow();

    // testing a list of seeds.
    expect(index.random(0, 0, 1)).toBe(0.21132115912208504);
    expect(index.random(1, 0, 1)).toBe(0.2511917009602195);
    expect(index.random(2, 0, 1)).toBe(0.2910622427983539);
    expect(index.random(3, 0, 1)).toBe(0.33093278463648834);
    expect(index.random(4, 0, 1)).toBe(0.3708033264746228);
    expect(index.random(5, 0, 1)).toBe(0.4106738683127572);
    expect(index.random(3134553, 0, 1)).toBe(0.5378515089163237);
    expect(index.random(-3134553, 0, 1)).toBe(-0.11520919067215364);

    // testing a list of minimum.
    expect(index.random(0, 0, 100)).toBe(21.132115912208505);
    expect(index.random(0, 1, 100)).toBe(21.92079475308642);
    expect(index.random(0, 2, 100)).toBe(22.709473593964333);
    expect(index.random(0, 3, 100)).toBe(23.49815243484225);
    expect(index.random(0, 4, 100)).toBe(24.286831275720164);
    expect(index.random(0, 5, 100)).toBe(25.07551011659808);
    expect(index.random(0, 3134553, 6664248)).toBe(3880452.238747428);
    expect(index.random(0, -6664248, -3134553)).toBe(-5918348.761252572);

    // testing a list of maximus.
    expect(index.random(0, 100, 1000)).toBe(290.18904320987656);
    expect(index.random(0, 100, 2000)).toBe(501.5102023319616);
    expect(index.random(0, 100, 3000)).toBe(712.8313614540466);
    expect(index.random(0, 100, 40000)).toBe(8531.714248971193);
    expect(index.random(0, 100, 500000)).toBe(105739.44744513031);
    expect(index.random(0, 100, 6000000)).toBe(1268005.822616598);
    expect(index.random(0, 3134553, 6664248)).toBe(3880452.238747428);
    expect(index.random(0, -6664248, -3134553)).toBe(-5918348.761252572);
  });

  it('hash: Referential transparency', () => {
    expect(index.hash('hello world')).toBe(1794106052);
    expect(index.hash('electron')).toBe(-17123870);
    expect(index.hash('sadfafsafasfsaf')).toBe(-1521380633);
  });

  it('encrypt: Referential transparency', () => {
    // text.
    expect(index.encrypt('hello world', '-3880452.238747428_sdfjlajEIFA!')).toBe('SVWhTe3OHRFGvxM=');
    expect(index.encrypt('foo bar baz !!!', '-3880452.238747428_sdfjlajEIFA!')).toBe('R1+iAeCPGF5Wsg2Z4Stg');
    expect(index.encrypt('hello \n world', '-3880452.238747428_sdfjlajEIFA!')).toBe('SVWhTe3OYF5DvAXVpA=='); // with LF.

    // passphrase.
    expect(index.encrypt('hello world', '-111111.2222222_aaaaBBBB!$**')).toBe('N3BDTpWF/Uxb01s=');
    expect(index.encrypt('hello world', '-444444.6666666_aaaaBBBB!$**')).toBe('b5Bzl8m5Xh0Vk9A=');
  });

  it('decript: Referential transparency', () => {
    // text.
    expect(index.decrypt('SVWhTe3OHRFGvxM=', '-3880452.238747428_sdfjlajEIFA!')).toBe('hello world');
    expect(index.decrypt('R1+iAeCPGF5Wsg2Z4Stg', '-3880452.238747428_sdfjlajEIFA!')).toBe('foo bar baz !!!');
    expect(index.decrypt('SVWhTe3OYF5DvAXVpA==', '-3880452.238747428_sdfjlajEIFA!')).toBe('hello \n world'); // with LF.

    // passphrase.
    expect(index.decrypt('N3BDTpWF/Uxb01s=', '-111111.2222222_aaaaBBBB!$**')).toBe('hello world');
    expect(index.decrypt('b5Bzl8m5Xh0Vk9A=', '-444444.6666666_aaaaBBBB!$**')).toBe('hello world');
  });

  it('extractJson: successful case', () => {
    expect(index.extractJson('{ "key": "value", "dummy1": "1", "dummy2": 2, "dummy3": { "dummy4": 4 } }', 'key')).toBe('value');
  });

  it('extractJson: error case', () => {
    // invalid json format.
    expect(index.extractJson('{ "key": "value"', 'key')).toBe('{ "key": "value"');

    // the value is NOT a string.
    expect(index.extractJson('{ "key": 999 }', 'key')).toBe('{ "key": 999 }');
    expect(index.extractJson('{ "key": true }', 'key')).toBe('{ "key": true }');
    expect(index.extractJson('{ "key": { "a": "b" } }', 'key')).toBe('{ "key": { "a": "b" } }');
    expect(index.extractJson('{ "key": [ "a", "b" ] }', 'key')).toBe('{ "key": [ "a", "b" ] }');
  });

  it('progressAt: successful case', () => {
    expect(index.progressAt(new Date (5), new Date(0), new Date(10))).toBeCloseTo(0.5);
    expect(index.progressAt(new Date (5), new Date(0), new Date(20))).toBeCloseTo(0.25);
    expect(index.progressAt(new Date (5), new Date(0), new Date(40))).toBeCloseTo(0.125);
    expect(index.progressAt(new Date (15), new Date(10), new Date(20))).toBeCloseTo(0.5);
    expect(index.progressAt(new Date (25), new Date(20), new Date(40))).toBeCloseTo(0.25);
    expect(index.progressAt(new Date (35), new Date(30), new Date(70))).toBeCloseTo(0.125);
  });

  it('progressAt: error case', () => {
    expect(index.progressAt(new Date (5), new Date(10), new Date(20))).toBeCloseTo(0);
    expect(index.progressAt(new Date (30), new Date(10), new Date(20))).toBeCloseTo(1);
  });

  it('safeTransformer: successful case', () => {
    // number => nubmer.
    expect(index.safeTransformer((t: number) => t * 2)(3)).toBe(6);
    // string => string.
    expect(index.safeTransformer((t: string) => 'hello ' + t)('world')).toBe('hello world');
  });

  it('safeTransformer: error case', () => {
    expect(index.safeTransformer((t: number) => {
      throw new Error('its a test.');
    })(3)).toBe(3);
  });
});
