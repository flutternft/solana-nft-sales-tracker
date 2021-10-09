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
import { getMetadata } from './helpers/metadata-helpers.js';
import DiscordHelper from './helpers/discord-helper.js';
import TwitterHelper from './helpers/twitter-helper.js';
import _ from 'lodash';
import axios from 'axios';
import fs from 'fs';
export default class SaleTracker {
    constructor(config, outputType) {
        this.config = config;
        this.connection = new Connection(this.config.rpc);
        this.auditFilePath = `./auditfile-${outputType}.json`;
        this.outputType = outputType;
    }
    /**
     * The main function.
     */
    checkSales() {
        return __awaiter(this, void 0, void 0, function* () {
            const me = this;
            let lockFile = me._readOrCreateAuditFile();
            let lastProcessedSignature = _.last(lockFile.processedSignatures);
            console.log("Started");
            const confirmedSignatures = _.reverse(yield this.connection.getConfirmedSignaturesForAddress2(new PublicKey(me.config.primaryRoyaltiesAccount), { limit: 25, until: lastProcessedSignature }));
            _.remove(confirmedSignatures, (tx) => {
                return _.includes(lockFile.processedSignatures, tx.signature);
            });
            console.log("Got transactions", confirmedSignatures.length);
            for (let confirmedSignature of confirmedSignatures) {
                let saleInfo = yield me._parseTransactionForSaleInfo(confirmedSignature.signature);
                if (saleInfo) {
                    yield me._getOutputPlugin().send(saleInfo);
                }
                yield me._updateLockFile(confirmedSignature.signature);
                console.log("Updated lockfile", confirmedSignature.signature);
            }
            console.log("Done");
        });
    }
    /**
     * A basic factory to return the output plugin.
     * @returns
     */
    _getOutputPlugin() {
        const me = this;
        if (me.outputType === 'console') {
            return {
                send: function (saleInfo) {
                    return __awaiter(this, void 0, void 0, function* () {
                        console.log(JSON.stringify(saleInfo), null, 2);
                    });
                }
            };
        }
        if (me.outputType === 'discord') {
            return new DiscordHelper(me.config);
        }
        else {
            return new TwitterHelper(me.config);
        }
    }
    /**
     * Returns a dummy audit file for first run.
     * @returns
     */
    _getNewAuditFileStructure() {
        return JSON.stringify({
            processedSignatures: []
        });
    }
    /**
     * Returns the auditfile if it exists, if not createss a new empty one.
     * @returns The contents of the auditfile.
     */
    _readOrCreateAuditFile() {
        const me = this;
        if (fs.existsSync(me.auditFilePath)) {
            return JSON.parse(fs.readFileSync(me.auditFilePath).toString());
        }
        else {
            fs.writeFileSync(me.auditFilePath, me._getNewAuditFileStructure());
            return JSON.parse(fs.readFileSync(me.auditFilePath).toString());
        }
    }
    /**
     * Keeping it simple. Using a file to track processed signatures. Routinely trimming
     * signatures from the file to keep size in check.
     * Improvement: Use a database to store the processed file information - helpes with easier deployment since in the current scheme the lock file is part of the commit.
     * @param signature
     */
    _updateLockFile(signature) {
        return __awaiter(this, void 0, void 0, function* () {
            const me = this;
            let file = me._readOrCreateAuditFile();
            file.processedSignatures.push(signature);
            if (file.processedSignatures.length > 300) {
                file.processedSignatures = _.takeRight(file.processedSignatures, 10);
            }
            yield fs.writeFileSync(me.auditFilePath, JSON.stringify(file));
        });
    }
    /**
     * Gets the mint metadata using the metaplex helper classes.
     * @param mintInfo
     * @returns
     */
    _getMintMetadata(mintInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            const me = this;
            let metadata = yield getMetadata(new PublicKey(mintInfo), me.config.rpc);
            return metadata;
        });
    }
    /**
     * Identifies the marketplace using the addresses asssociated with the transaction.
     * The marketplaces have their own royalty addresses which are credited as part of the sale.
     * @param addresses
     * @returns
     */
    _mapMarketPlace(addresses) {
        const me = this;
        let marketPlace = '';
        _.forEach(me.config.marketPlaceInfos, (mpInfo) => {
            if (_.size(_.intersection(addresses, mpInfo.addresses)) > 0) {
                marketPlace = mpInfo.name;
                return false;
            }
        });
        return marketPlace;
    }
    /**
     * The amount debited from the buyer is the actual amount paid for the NFT.
     * @param accountPostBalances - Map of account addresses and the balances post this transaction
     * @param buyer - The buyer address
     * @returns
     */
    _getSaleAmount(accountPostBalances, accountPreBalances, buyer) {
        return _.round(Math.abs(accountPostBalances[buyer] - accountPreBalances[buyer]) / Math.pow(10, 9), 2).toFixed(2);
    }
    /**
     * Some basic ways to avoid people sending fake transactions to our primaryRoyaltiesAccount in an attempt
     * to appear on the sale bots result.
     * @param mintMetadata
     * @returns
     */
    _verifyNFT(mintMetadata) {
        const me = this;
        let creators = _.map(mintMetadata.data.creators, 'address');
        let updateAuthority = _.get(mintMetadata, `updateAuthority`);
        return _.includes(creators, me.config.primaryRoyaltiesAccount) && updateAuthority === me.config.updateAuthority;
    }
    /**
     * Get the detailed transaction info, compute account balance changes, identify the marketplaces involved
     * Get the sale amount, get the NFT information from the transaction and thenr retrieve the image from
     * ARWeave.
     * @param signature
     * @returns saleInfo object
     */
    _parseTransactionForSaleInfo(signature) {
        return __awaiter(this, void 0, void 0, function* () {
            const me = this;
            let transactionInfo = yield me.connection.getTransaction(signature);
            let accountKeys = transactionInfo === null || transactionInfo === void 0 ? void 0 : transactionInfo.transaction.message.accountKeys;
            let accountMap = [];
            if (accountKeys) {
                let idx = 0;
                for (let accountKey of accountKeys) {
                    accountMap[idx++] = accountKey.toBase58();
                }
            }
            let allAddresses = _.values(accountMap);
            let buyer = accountMap[0];
            let { balanceDifferences, seller, mintInfo, saleAmount, marketPlace } = me._parseTransactionMeta(transactionInfo, accountMap, buyer, allAddresses);
            if (balanceDifferences && balanceDifferences[me.config.primaryRoyaltiesAccount] > 0 && !_.isEmpty(marketPlace)) {
                let mintMetaData = yield me._getMintMetadata(mintInfo);
                if (!me._verifyNFT(mintMetaData)) {
                    console.log("Not an NFT transaction that we're interested in", mintMetaData);
                    return;
                }
                let arWeaveUri = _.get(mintMetaData, `data.uri`);
                let arWeaveInfo = yield axios.get(arWeaveUri);
                return {
                    time: transactionInfo === null || transactionInfo === void 0 ? void 0 : transactionInfo.blockTime,
                    txSignature: signature,
                    marketPlace: marketPlace ? marketPlace : 'Unknown',
                    buyer,
                    seller,
                    saleAmount,
                    nftInfo: {
                        id: _.get(mintMetaData, `data.name`),
                        name: _.get(mintMetaData, `data.name`),
                        image: arWeaveInfo.data.image
                    }
                };
            }
        });
    }
    /**
     * Some rudimentary logic to compute account balance changes. Assumes that the
     * account which is credited the largest amount is the account of the seller.
     * @param transactionInfo
     * @param accountMap
     * @param buyer
     * @param allAddresses
     * @returns
     */
    _parseTransactionMeta(transactionInfo, accountMap, buyer, allAddresses) {
        const me = this;
        let txMetadata = transactionInfo.meta, mintInfo = _.get(txMetadata, `postTokenBalances.0.mint`), balanceDifferences = {}, seller = '';
        let accountPreBalances = {};
        let accountPostBalances = {};
        _.forEach(txMetadata.preBalances, (balance, index) => {
            accountPreBalances[accountMap[index]] = balance;
        });
        _.forEach(txMetadata.postBalances, (balance, index) => {
            accountPostBalances[accountMap[index]] = balance;
        });
        let largestBalanceIncrease = 0;
        _.forEach(accountPostBalances, (balance, address) => {
            let balanceIncrease = accountPostBalances[address] - accountPreBalances[address];
            balanceDifferences[address] = balanceIncrease;
            if (balanceIncrease > largestBalanceIncrease) {
                seller = address;
                largestBalanceIncrease = balanceIncrease;
            }
        });
        return {
            accountPreBalances,
            accountPostBalances,
            balanceDifferences,
            seller,
            mintInfo,
            marketPlace: me._mapMarketPlace(allAddresses),
            saleAmount: me._getSaleAmount(accountPostBalances, accountPreBalances, buyer)
        };
    }
}
