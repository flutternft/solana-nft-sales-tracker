/*
    Taken from: https://github.com/metaplex-foundation/metaplex/blob/master/js/packages/common/src/utils/ids.ts
*/
import { PublicKey } from "@solana/web3.js";
export class LazyAccountInfoProxy {
    constructor() {
        this.executable = false;
        this.owner = "";
        this.lamports = 0;
    }
    get data() {
        //
        return undefined;
    }
}
const PubKeysInternedMap = new Map();
export const toPublicKey = (key) => {
    if (typeof key !== "string") {
        return key;
    }
    let result = PubKeysInternedMap.get(key);
    if (!result) {
        result = new PublicKey(key);
        PubKeysInternedMap.set(key, result);
    }
    return result;
};
export const SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID = new PublicKey("ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL");
export const BPF_UPGRADE_LOADER_ID = new PublicKey("BPFLoaderUpgradeab1e11111111111111111111111");
export const MEMO_ID = new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr");
export const METADATA_PROGRAM_ID = "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s";
export const VAULT_ID = "vau1zxA2LbssAUEF7Gpw91zMM1LvXrvpzJtmZ58rPsn";
export const AUCTION_ID = "auctxRXPeJoc4817jDhf4HbjnhEcr1cCXenosMhK5R8";
export const METAPLEX_ID = "p1exdMJcjVao65QdewkaZRUnU6VPSXhus9n2GzWfh98";
export const SYSTEM = new PublicKey("11111111111111111111111111111111");
