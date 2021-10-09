import { EDITION_MARKER_BIT_SIZE, MetadataKey, MetaplexKey, } from "./types.js";
export class MasterEditionV1 {
    constructor(args) {
        this.key = MetadataKey.MasterEditionV1;
        this.supply = args.supply;
        this.maxSupply = args.maxSupply;
        this.printingMint = args.printingMint;
        this.oneTimePrintingAuthorizationMint =
            args.oneTimePrintingAuthorizationMint;
    }
}
export class MasterEditionV2 {
    constructor(args) {
        this.key = MetadataKey.MasterEditionV2;
        this.supply = args.supply;
        this.maxSupply = args.maxSupply;
    }
}
export class EditionMarker {
    constructor(args) {
        this.key = MetadataKey.EditionMarker;
        this.ledger = args.ledger;
    }
    editionTaken(edition) {
        const editionOffset = edition % EDITION_MARKER_BIT_SIZE;
        const indexOffset = Math.floor(editionOffset / 8);
        if (indexOffset > 30) {
            throw Error("bad index for edition");
        }
        const positionInBitsetFromRight = 7 - (editionOffset % 8);
        const mask = Math.pow(2, positionInBitsetFromRight);
        const appliedMask = this.ledger[indexOffset] & mask;
        return appliedMask !== 0;
    }
}
export class Edition {
    constructor(args) {
        this.key = MetadataKey.EditionV1;
        this.parent = args.parent;
        this.edition = args.edition;
    }
}
export class Creator {
    constructor(args) {
        this.address = args.address;
        this.verified = args.verified;
        this.share = args.share;
    }
}
export class Data {
    constructor(args) {
        this.name = args.name;
        this.symbol = args.symbol;
        this.uri = args.uri;
        this.sellerFeeBasisPoints = args.sellerFeeBasisPoints;
        this.creators = args.creators;
    }
}
export class Metadata {
    constructor(args) {
        this.key = MetadataKey.MetadataV1;
        this.updateAuthority = args.updateAuthority;
        this.mint = args.mint;
        this.data = args.data;
        this.primarySaleHappened = args.primarySaleHappened;
        this.isMutable = args.isMutable;
        this.editionNonce = args.editionNonce;
    }
}
export const METADATA_SCHEMA = new Map([
    [
        MasterEditionV1,
        {
            kind: "struct",
            fields: [
                ["key", "u8"],
                ["supply", "u64"],
                ["maxSupply", { kind: "option", type: "u64" }],
                ["printingMint", "pubkeyAsString"],
                ["oneTimePrintingAuthorizationMint", "pubkeyAsString"],
            ],
        },
    ],
    [
        MasterEditionV2,
        {
            kind: "struct",
            fields: [
                ["key", "u8"],
                ["supply", "u64"],
                ["maxSupply", { kind: "option", type: "u64" }],
            ],
        },
    ],
    [
        Edition,
        {
            kind: "struct",
            fields: [
                ["key", "u8"],
                ["parent", "pubkeyAsString"],
                ["edition", "u64"],
            ],
        },
    ],
    [
        Data,
        {
            kind: "struct",
            fields: [
                ["name", "string"],
                ["symbol", "string"],
                ["uri", "string"],
                ["sellerFeeBasisPoints", "u16"],
                ["creators", { kind: "option", type: [Creator] }],
            ],
        },
    ],
    [
        Creator,
        {
            kind: "struct",
            fields: [
                ["address", "pubkeyAsString"],
                ["verified", "u8"],
                ["share", "u8"],
            ],
        },
    ],
    [
        Metadata,
        {
            kind: "struct",
            fields: [
                ["key", "u8"],
                ["updateAuthority", "pubkeyAsString"],
                ["mint", "pubkeyAsString"],
                ["data", Data],
                ["primarySaleHappened", "u8"],
                ["isMutable", "u8"], // bool
            ],
        },
    ],
    [
        EditionMarker,
        {
            kind: "struct",
            fields: [
                ["key", "u8"],
                ["ledger", [31]],
            ],
        },
    ],
]);
export class WhitelistedCreator {
    constructor(args) {
        this.key = MetaplexKey.WhitelistedCreatorV1;
        this.activated = true;
        this.address = args.address;
        this.activated = args.activated;
    }
}
