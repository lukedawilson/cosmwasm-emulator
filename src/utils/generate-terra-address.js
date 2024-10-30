// JavaScript implementation of bech32 encoding to generate a Terra address
// Reference for bech32 encoding: https://github.com/sipa/bech32/tree/master/ref/javascript

const generator = [0x3b6a57b2, 0x26508e6d, 0x1ea119fa, 0x3d4233dd, 0x2a1462b3];

function bech32Polymod(values) {
  let chk = 1;

  for (const element of values) {
    const top = chk >> 25;
    chk = ((chk & 0x1ffffff) << 5) ^ element;

    for (let i = 0; i < 5; ++i) {
      if ((top >> i) & 1) {
        chk ^= generator[i];
      }
    }
  }

  return chk;
}

function bech32HrpExpand(hrp) {
  const ret = [];

  for (let p = 0; p < hrp.length; ++p) {
    ret.push(hrp.charCodeAt(p) >> 5);
  }

  ret.push(0);

  for (let p = 0; p < hrp.length; ++p) {
    ret.push(hrp.charCodeAt(p) & 31);
  }

  return ret;
}

function bech32Encode(hrp, data) {
  const combined = bech32HrpExpand(hrp).concat(data);
  const mod = bech32Polymod(combined.concat([0, 0, 0, 0, 0])) ^ 1;
  let ret = `${hrp}1`;

  for (const element of data) {
    ret += "qpzry9x8gf2tvdw0s3jn54khce6mua7l"[element];
  }

  for (let p = 0; p < 6; ++p) {
    ret += "qpzry9x8gf2tvdw0s3jn54khce6mua7l"[(mod >> (5 * (5 - p))) & 31];
  }

  return ret;
}

function convertBits(data, fromBits, toBits, pad = true) {
  let acc = 0;
  let bits = 0;
  const ret = [];
  const maxv = (1 << toBits) - 1;

  for (const element of data) {
    const value = element;
    if (value < 0 || (value >> fromBits) !== 0) {
      return null;
    }

    acc = (acc << fromBits) | value;
    bits += fromBits;

    while (bits >= toBits) {
      bits -= toBits;
      ret.push((acc >> bits) & maxv);
    }
  }

  if (pad) {
    if (bits > 0) {
      ret.push((acc << (toBits - bits)) & maxv);
    }
  } else if (bits >= fromBits || ((acc << (toBits - bits)) & maxv) !== 0) {
    return null;
  }

  return ret;
}

export default function generateTerraAddress() {
  const data = new Uint8Array(20);
  crypto.getRandomValues(data); // generate 20 random bytes

  const words = convertBits([...data], 8, 5);
  return bech32Encode("terra", words);
}
