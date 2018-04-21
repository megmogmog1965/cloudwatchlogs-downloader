import * as crypto from 'crypto';

const algorithm = 'aes-256-ctr';

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
