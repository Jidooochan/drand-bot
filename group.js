import { ethers } from "ethers";
import { sha256 } from "@noble/hashes/sha256";

export function group(address) {
  const hash = sha256(ethers.toUtf8Bytes(address))[0];
  if (hash % 2 == 0) return "A";
  else return "B";
}

/**
 * All rounds not ending on 0 are skipped. Rounds divisible by 20 go to group B and the others go to group A.
 */
export function eligibleGroup(round) {
  if (!round) throw new Error("Round is falsy");
  if (!Number.isInteger(round)) throw new Error("Round value not an Integer");

  if (round % 10 != 0) return null;

  if (round % 20 == 0) return "B";
  else return "A";
}

export function isMyGroup(address, round) {
  return eligibleGroup(round) == group(address);
}
