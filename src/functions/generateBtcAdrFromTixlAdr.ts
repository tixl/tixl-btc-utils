import sha256 from "js-sha256";
//@ts-ignore
import bs58 from "bs58";

const hash = (x: string | Buffer | Uint8Array) =>
  Uint8Array.from(
    sha256
      //@ts-ignore
      .create()
      .update(x)
      .digest()
  );

export default (tixlAdr: string) => {
  const hashedAdr = hash(tixlAdr);
  const payload = hashedAdr.slice(0, 20);
  const networkBytes = Uint8Array.from([111]);
  const toCheck = Uint8Array.from([...networkBytes, ...payload]);
  const checksum = hash(hash(toCheck)).slice(0, 4);
  const btcAdr = Uint8Array.from([...toCheck, ...checksum]);
  return bs58.encode(Buffer.from(btcAdr));
};
