import { ethers } from "ethers";
import { sha256 } from "@noble/hashes/sha256";

export function group(address) {
  const hash = sha256(ethers.toUtf8Bytes(address))[0];
  if (hash % 2 == 0) return "A";
  else return "B";
}
