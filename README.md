# CKB Band Oracle

[![License](https://img.shields.io/badge/license-MIT-green)](https://github.com/duanyytop/ckb-band-oracle/blob/master/LICENSE)
[![Github Actions CI](https://github.com/duanyytop/ckb-band-oracle/workflows/CI/badge.svg?branch=master)](https://github.com/duanyytop/ckb-band-oracle/actions)
[![Telegram Group](https://cdn.rawgit.com/Patrolavia/telegram-badge/8fe3382b/chat.svg)](https://t.me/nervos_ckb_dev)

An oracle fetching oracle data from [Band Protocol](https://bandprotocol.com/) and posting to [Nervos CKB](https://nervos.org)

[`ckb-oracle-bridge`](https://github.com/duanyytop/ckb-oracle-bridge) provides a server to fetch Band Protocol oracle data and a web application to display oracle data and uses [rich-node](https://github.com/ququzone/ckb-rich-node) as ckb rpc and indexer server.

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

### Band Oracle Data Format

Now `ckb-band-oracle` provides ten tokens' oracle prices which are `['BTC', 'ETH', 'DAI', 'REP', 'ZRX', 'BAT', 'KNC', 'LINK', 'COMP', 'BAND']`.

And the cell data format:

`utf8ToHex('band') + hex(index of token list) + u32(timestamp) + u64(price)`

For example:

`0x62616e64055f437c0c00000000000650e7` means the index of token list is 05 (BAT) and the timestamp is `5f437c0c`(1598258188) and the price of BAT is \$0.413927.

> Note: `utf8ToHex('band') = 0x62616e64`

`ckb-band-oracle` provides two methods to generate and parse band oracle data in [utils](https://github.com/duanyytop/ckb-band-oracle/blob/master/src/utils/utils.js)

### Getting Started

Before starting the project, you should edit the `.env` file with your private key to sign above transactions later.
You should make sure the balance of the account is enough and if you have not enough Testnet ckb, you can claim free Testnet ckb from [CKB Faucet](https://faucet.nervos.org).

```shell
$ git clone https://github.com/duanyytop/ckb-band-oracle
$ cd ckb-band-oracle
$ yarn install
$ yarn start
```

### Resource

- [Band Protocol](https://bandprotocol.com/) - A cross-chain data oracle platform that aggregates and connects real-world data and APIs to smart contracts
- [CKB JavaScript SDK](https://github.com/nervosnetwork/ckb-sdk-js) - JavaScript SDK of Nervos CKB which can help developers to interact ckb node
- [CKB Rich Node](https://github.com/ququzone/ckb-rich-node) - Remote server which supports ckb rpc and ckb indexer
- [CKB Indexer](https://github.com/nervosnetwork/ckb-indexer) - Core Module of CKB Rich Node
- [CKB Explorer](https://explorer.nervos.org) - CKB blockchain explorer
- [CKB Faucet](https://faucet.nervos.org) - A faucet where you can claim free Testnet CKBytes
