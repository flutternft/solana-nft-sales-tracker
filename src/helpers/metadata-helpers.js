var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Connection, PublicKey } from "@solana/web3.js";
import { Metadata, METADATA_SCHEMA, } from "./metaplex/classes.js";
import { MetadataKey, METADATA_PREFIX } from "./metaplex/types.js";
import { deserializeUnchecked, BinaryReader, BinaryWriter } from "borsh";
// @ts-ignore
import base58 from "bs58";
import { METADATA_PROGRAM_ID, SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID, METAPLEX_ID, BPF_UPGRADE_LOADER_ID, SYSTEM, MEMO_ID, VAULT_ID, AUCTION_ID, toPublicKey, } from "./metaplex/ids.js";
const TOKEN_PROGRAM_ID = new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA");
let STORE;
export const programIds = () => {
    return {
        token: TOKEN_PROGRAM_ID,
        associatedToken: SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
        bpf_upgrade_loader: BPF_UPGRADE_LOADER_ID,
        system: SYSTEM,
        metadata: METADATA_PROGRAM_ID,
        memo: MEMO_ID,
        vault: VAULT_ID,
        auction: AUCTION_ID,
        metaplex: METAPLEX_ID,
        store: STORE,
    };
};
export function getMetadata(pubkey, url) {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = new Connection(url, "confirmed");
        const metadataKey = yield generatePDA(pubkey);
        const accountInfo = yield connection.getAccountInfo(toPublicKey(metadataKey));
        if (accountInfo && accountInfo.data.length > 0) {
            if (!isMetadataAccount(accountInfo))
                return;
            if (isMetadataV1Account(accountInfo)) {
                const metadata = decodeMetadata(accountInfo.data);
                if (isValidHttpUrl(metadata.data.uri)) {
                    return metadata;
                }
            }
        }
    });
}
function generatePDA(tokenMint, addEditionToSeeds = false) {
    return __awaiter(this, void 0, void 0, function* () {
        const PROGRAM_IDS = programIds();
        const metadataSeeds = [
            Buffer.from(METADATA_PREFIX),
            toPublicKey(PROGRAM_IDS.metadata).toBuffer(),
            tokenMint.toBuffer(),
        ];
        if (addEditionToSeeds) {
            metadataSeeds.push(Buffer.from("edition"));
        }
        return (yield PublicKey.findProgramAddress(metadataSeeds, toPublicKey(PROGRAM_IDS.metadata)))[0];
    });
}
const decodeMetadata = (buffer) => {
    const metadata = deserializeUnchecked(METADATA_SCHEMA, Metadata, buffer);
    // Remove any trailing null characters from the deserialized strings
    metadata.data.name = metadata.data.name.replace(/\0/g, "");
    metadata.data.symbol = metadata.data.symbol.replace(/\0/g, "");
    metadata.data.uri = metadata.data.uri.replace(/\0/g, "");
    metadata.data.name = metadata.data.name.replace(/\0/g, "");
    return metadata;
};
const isMetadataAccount = (account) => account.owner.toBase58() === METADATA_PROGRAM_ID;
const isMetadataV1Account = (account) => account.data[0] === MetadataKey.MetadataV1;
function isValidHttpUrl(text) {
    try {
        return text.startsWith('http://') || text.startsWith('https://');
    }
    catch (err) {
        return false;
    }
}
// Required to properly serialize and deserialize pubKeyAsString types
const extendBorsh = () => {
    BinaryReader.prototype.readPubkey = function () {
        const reader = this;
        const array = reader.readFixedArray(32);
        return new PublicKey(array);
    };
    BinaryWriter.prototype.writePubkey = function (value) {
        const writer = this;
        writer.writeFixedArray(value.toBuffer());
    };
    BinaryReader.prototype.readPubkeyAsString = function () {
        const reader = this;
        const array = reader.readFixedArray(32);
        return base58.encode(array);
    };
    BinaryWriter.prototype.writePubkeyAsString = function (value) {
        const writer = this;
        writer.writeFixedArray(base58.decode(value));
    };
};
extendBorsh();
