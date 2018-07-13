import * as crypto from 'crypto';
import { FilterTypes } from '../constants';
import { Filter } from '../common-interfaces';

const algorithm = 'aes-256-ctr';

export function range(begin: number, end: number): number[] {
  if (begin >= end) {
    throw new Error('begin >= end');
  }

  return Array.from({ length: end - begin }, (v, k) => begin + k);
}

export function random(seed: number, min: number = 0, max: number = 1) {
  if (min >= max) {
    throw new Error('min >= max');
  }

  let lastseed = (Math.round(seed) * 9301 + 49297) % 233280;
  let rnd = lastseed / 233280;

  return min + rnd * ((max || 1) - (min || 0));
}

export function hash(text: string) {
  let ret = 0;
  for (let i = 0, len = text.length; i < len; i++) {
    ret = (31 * ret + text.charCodeAt(i)) << 0;
  }

  return ret;
}

export function encrypt(text: string, passphrase: string): string {
  let cipher = crypto.createCipher(algorithm, passphrase);
  let crypted = cipher.update(text, 'utf8', 'base64');

  return crypted + cipher.final('base64');
}

export function decrypt(text: string, passphrase: string): string {
  let decipher = crypto.createDecipher(algorithm, passphrase);
  let decrypted = decipher.update(text, 'base64', 'utf8');

  return decrypted + decipher.final('utf8');
}

/**
 * @param jsonstr a json formatted string.
 * @param key a root key of the json object.
 * @returns a value for `key`, or `jsonstr` itself.
 */
export function extractJson(jsonstr: string, key: string): string {
  try {
    let val = JSON.parse(jsonstr)[key];

    // missing key.
    if (val === undefined) {
      return jsonstr;
    }

    return (typeof val === 'string') ? val : JSON.stringify(val);

  } catch (e) {
    // return itself when "jsonstr" is NOT as json format.
    return jsonstr;
  }
}

/**
 * @returns percentage: 0 to 1.0
 */
export function progressAt(t: Date, startTime: Date, endTime: Date): number {
  let progress = (t.getTime() - startTime.getTime()) / (endTime.getTime() - startTime.getTime());

  return Math.min(Math.max(0, progress), 1.0);
}

/**
 * @param inner a transformer function.
 * @return a funtion returns a calculated value or the argument itself without throwing error.
 */
export function safeFilter<T>(inner: (t: T) => T)
: (t: T) => T {
  return (t: T) => {
    try {
      return inner(t);
    } catch {
      return t;
    }
  };
}

/**
 * @param filters filter params.
 * @return a function returns transformed line or undefined that represents removed.
 */
export function mergeFilters(filters: Filter[])
  : (line: string) => string | undefined {

  // create filter functions from filter types.
  let funcs = filters.map(f => {
    switch (f.type) {
      case FilterTypes.FILTER_REGEX:
        return (line: string) => new RegExp(f.pattern, 'm').test(line) ? line : undefined;
      case FilterTypes.REPLACE_REGEX:
        return (line: string) => line.replace(new RegExp(f.pattern, 'm'), f.replacement);
      case FilterTypes.EXTRACT_JSON:
        return (line: string) => extractJson(line, f.key);
      default:
        throw new Error('error detected, invalid filter type.');
    }
  });

  // merge all filter functions to be called orderly.
  return funcs.reduce(
    (pre, cur) => (line: string) => {
      let evaluated = pre(line);
      return evaluated !== undefined ? cur(evaluated) : undefined;
    },
    (line: string) => line,
  );
}
