# Solana NFT Sales Tracker
This repository contains code that can be used to run your own marketplace sales tracker for Solana NFTs. It relies on the concept of royalties being automatically credited to the creators and uses those transactions to identify sales. This ensures that the code is marketplace agnostic i.e as long as royalties are properly credited to the creator of the NFT, the transaction can be identified and parsed for necessary values.

The codebase comes with a cron.js file which can be used to execute the tracking process at routine intervals - it uses a simple auditfile-*.json to track already processed transactions. (Can be replaced with a DB if you want to go that route)

Code developed and open sourced by the @FlutterNFT team. Follow us on Twitter @ https://twitter.com/FlutterNft to show support.

# Notes
The code is a mishmash of TypeScript and vanilla Javascript. Please excuse the mess. The Metaplex helper classes were taken from https://github.com/solana-labs/solana/tree/1428575be3bb71dc015184b63261609890dd695d/explorer/src/metaplex. (Thanks to the contributor)


# Requirements
NodeJS v14.x or higher and Typescript.

## Setup

Take a look at the ./config/sample.json file for the values used by the script. It's configured to track Flutter sales right now, but it's just a matter of changing the primaryRoyaltiesAccount, updateAuthority and candyMachineId to get it running for your own NFT collection.

Run the following commands to clone and install dependencies:

    $ git clone git@github.com:flutternft/solana-nft-sales-tracker.git
    $ cd solana-nft-sales-tracker
    $ npm install
    $ npm run build #Might spit out some errors, but it's inconsequential.
    $ npm run console_run (Essentially runs: node run-script-standalone.js --config='./config/sample.json' --outputType=console)

There are various output plugins available:
- console: Prints the output to the console. Will work out of the box.
- discord: Posts the output to a discord webhook. You need to create a webhook integration in Discord and supply the value in the config file.
- twitter: Posts the output to a twitter account (requires you to setup your own Twitter Developer account, setup a account on which you want to post the status updates, get the oauth token through the 3 legged oAuth process. Once you have the key/oAuth creds set it up in a config file under config/ and pass it when starting the script).

## Disclaimer
Code provided as is with no support/guarantee. 