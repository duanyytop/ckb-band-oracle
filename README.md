# ckb-band-oracle

An oracle fetching oracle data from [BandChain](https://github.com/bandprotocol/bandchain) and posting to [Nervos CKB](https://nervos.org)

### How to work

`ckb-band-oracle` is a `node.js` server fetching band oracle data and posting data to Nervos CKB per block.

[band](https://github.com/duanyytop/ckb-band-oracle/blob/master/src/poster/band.js) shows the workflow fetching oracle data of 10 tokens from BandChain.

> Note: BandChain oracle data is updated every five minutes

[poster](https://github.com/duanyytop/ckb-band-oracle/blob/master/src/poster/poster.js) shows the workflow posting oracle data to Nervos CKB per block.

`ckb-band-oracle` has five stages to post band oracle data to Nervos CKB

- Generate some live cells whose count is equal to oracle tokens' count to carry band oracle data
- Fetch latest band oracle data from BandChain
- Generate transaction whose outputs data contain band oracle data and send to Nervos CKB
- Fetch latest band oracle data from BandChain
- Update cells data which contain band oracle data with new oracle data per block

### Getting Started

Before starting the project, you should edit the `.env` file with your private key to sign above transactions later.

```shell
$ git clone https://github.com/duanyytop/ckb-band-oracle
$ cd ckb-band-oracle
$ yarn start
```

### Resource

- [BandChain](https://github.com/bandprotocol/bandchain/tree/master/helpers) - A BandChain tool which help developers to fetch oracle data
- [CKB JavaScript SDK](https://github.com/nervosnetwork/ckb-sdk-js) - JavaScript SDK of Nervos CKB which can help developers to interact ckb node
- [CKB Rich Node](https://github.com/ququzone/ckb-rich-node) - Remote server which supports ckb rpc and ckb indexer
- [CKB Indexer](https://github.com/nervosnetwork/ckb-indexer) - Core Module of CKB Rich Node
- [CKB Explorer](https://explorer.nervos.org) - CKB blockchain explorer
- [CKB Faucet](https://faucet.nervos.org) - A faucet where you can claim free Testnet CKBytes
