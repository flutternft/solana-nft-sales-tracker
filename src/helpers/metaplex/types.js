/*
    Taken from: https://github.com/metaplex-foundation/metaplex/blob/master/js/packages/common/src/actions/metadata.ts
*/
export const EDITION = "edition";
export const METADATA_PREFIX = "metadata";
export const MAX_AUCTION_DATA_EXTENDED_SIZE = 8 + 9 + 2 + 200;
export const MAX_NAME_LENGTH = 32;
export const MAX_SYMBOL_LENGTH = 10;
export const MAX_URI_LENGTH = 200;
export const MAX_CREATOR_LIMIT = 5;
export const EDITION_MARKER_BIT_SIZE = 248;
export const MAX_CREATOR_LEN = 32 + 1 + 1;
export const MAX_METADATA_LEN = 1 +
    32 +
    32 +
    MAX_NAME_LENGTH +
    MAX_SYMBOL_LENGTH +
    MAX_URI_LENGTH +
    MAX_CREATOR_LIMIT * MAX_CREATOR_LEN +
    2 +
    1 +
    1 +
    198;
export var MetadataKey;
(function (MetadataKey) {
    MetadataKey[MetadataKey["Uninitialized"] = 0] = "Uninitialized";
    MetadataKey[MetadataKey["MetadataV1"] = 4] = "MetadataV1";
    MetadataKey[MetadataKey["EditionV1"] = 1] = "EditionV1";
    MetadataKey[MetadataKey["MasterEditionV1"] = 2] = "MasterEditionV1";
    MetadataKey[MetadataKey["MasterEditionV2"] = 6] = "MasterEditionV2";
    MetadataKey[MetadataKey["EditionMarker"] = 7] = "EditionMarker";
})(MetadataKey || (MetadataKey = {}));
export var MetadataCategory;
(function (MetadataCategory) {
    MetadataCategory["Audio"] = "audio";
    MetadataCategory["Video"] = "video";
    MetadataCategory["Image"] = "image";
    MetadataCategory["VR"] = "vr";
    MetadataCategory["HTML"] = "html";
})(MetadataCategory || (MetadataCategory = {}));
export var ArtType;
(function (ArtType) {
    ArtType[ArtType["Master"] = 0] = "Master";
    ArtType[ArtType["Print"] = 1] = "Print";
    ArtType[ArtType["NFT"] = 2] = "NFT";
})(ArtType || (ArtType = {}));
export var MetaplexKey;
(function (MetaplexKey) {
    MetaplexKey[MetaplexKey["Uninitialized"] = 0] = "Uninitialized";
    MetaplexKey[MetaplexKey["OriginalAuthorityLookupV1"] = 1] = "OriginalAuthorityLookupV1";
    MetaplexKey[MetaplexKey["BidRedemptionTicketV1"] = 2] = "BidRedemptionTicketV1";
    MetaplexKey[MetaplexKey["StoreV1"] = 3] = "StoreV1";
    MetaplexKey[MetaplexKey["WhitelistedCreatorV1"] = 4] = "WhitelistedCreatorV1";
    MetaplexKey[MetaplexKey["PayoutTicketV1"] = 5] = "PayoutTicketV1";
    MetaplexKey[MetaplexKey["SafetyDepositValidationTicketV1"] = 6] = "SafetyDepositValidationTicketV1";
    MetaplexKey[MetaplexKey["AuctionManagerV1"] = 7] = "AuctionManagerV1";
    MetaplexKey[MetaplexKey["PrizeTrackingTicketV1"] = 8] = "PrizeTrackingTicketV1";
    MetaplexKey[MetaplexKey["SafetyDepositConfigV1"] = 9] = "SafetyDepositConfigV1";
    MetaplexKey[MetaplexKey["AuctionManagerV2"] = 10] = "AuctionManagerV2";
    MetaplexKey[MetaplexKey["BidRedemptionTicketV2"] = 11] = "BidRedemptionTicketV2";
    MetaplexKey[MetaplexKey["AuctionWinnerTokenTypeTrackerV1"] = 12] = "AuctionWinnerTokenTypeTrackerV1";
})(MetaplexKey || (MetaplexKey = {}));
