import dns from 'node:dns';

/**
 * Smart DNS Fallback for MongoDB Atlas
 * Resolves SRV, TXT, and A records via DNS-over-HTTPS (DoH)
 * if standard UDP port 53 DNS fails or times out.
 */

const dohCache = new Map<string, string>();

// Fallback for SRV records (e.g. _mongodb._tcp.cluster0.mgsd0db.mongodb.net)
const originalResolveSrv = dns.resolveSrv.bind(dns);
dns.resolveSrv = function (
  hostname: string,
  callback: (err: NodeJS.ErrnoException | null, addresses: dns.SrvRecord[]) => void
) {
  originalResolveSrv(hostname, async (err, addresses) => {
    if (!err && addresses && addresses.length > 0) {
      return callback(null, addresses);
    }

    try {
      const res = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(hostname)}&type=SRV`);
      const data = (await res.json()) as any;

      if (data.Answer && data.Answer.length > 0) {
        const records: dns.SrvRecord[] = data.Answer.map((a: any) => {
          const parts = a.data.trim().split(/\s+/);
          return {
            priority: Number(parts[0]),
            weight: Number(parts[1]),
            port: Number(parts[2]),
            name: parts[3].replace(/\.$/, ''),
          };
        });
        return callback(null, records);
      }
    } catch {
      // Fall through to error
    }

    return callback(err, addresses);
  });
};

// Fallback for TXT records (e.g. cluster0.mgsd0db.mongodb.net for replicaSet parameters)
const originalResolveTxt = dns.resolveTxt.bind(dns);
dns.resolveTxt = function (
  hostname: string,
  callback: (err: NodeJS.ErrnoException | null, records: string[][]) => void
) {
  originalResolveTxt(hostname, async (err, records) => {
    if (!err && records && records.length > 0) {
      return callback(null, records);
    }

    try {
      const res = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(hostname)}&type=TXT`);
      const data = (await res.json()) as any;

      if (data.Answer && data.Answer.length > 0) {
        const parsed: string[][] = data.Answer.map((a: any) => {
          const clean = a.data.replace(/^"|"$/g, '');
          return [clean];
        });
        return callback(null, parsed);
      }
    } catch {
      // Fall through to error
    }

    return callback(err, records);
  });
};

// Fallback for A records (host lookup to IP)
const originalLookup = dns.lookup.bind(dns);
dns.lookup = function (hostname: string, options: any, callback: any) {
  const cb = typeof options === 'function' ? options : callback;
  const opt = typeof options === 'function' ? {} : options;

  originalLookup(hostname, opt, async (err: any, address: any, family: any) => {
    if (!err && address) {
      return cb(null, address, family);
    }

    if (dohCache.has(hostname)) {
      return cb(null, dohCache.get(hostname), 4);
    }

    try {
      const res = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(hostname)}&type=A`);
      const data = (await res.json()) as any;
      const aRecord = data.Answer?.find((x: any) => x.type === 1);

      if (aRecord && aRecord.data) {
        dohCache.set(hostname, aRecord.data);
        return cb(null, aRecord.data, 4);
      }
    } catch {
      // Fall through
    }

    return cb(err, address, family);
  });
} as any;

