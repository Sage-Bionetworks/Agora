// -------------------------------------------------------------------------- //
// External
// -------------------------------------------------------------------------- //
import * as NodeCache from 'node-cache';

// -------------------------------------------------------------------------- //
// Cache
// -------------------------------------------------------------------------- //
export const cache = new NodeCache();

// TODO: Performance issues with node-cache on large object, this should be revisited when possible.
// For now used AlternativeCache (local variables) to store large set of data.

class AlternativeCache {
  data: { [key: string]: any } = {};

  set(key: string, data: any) {
    this.data[key] = data;
  }

  get(key: string) {
    return this.data[key] || undefined;
  }
}

export const altCache = new AlternativeCache();
