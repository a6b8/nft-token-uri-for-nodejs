<a href="#table-of-contents">
<img src="https://raw.githubusercontent.com/a6b8/a6b8/main/docs/nft-token-uri-for-nodejs/readme/headlines/Headline.svg" height="55px" name="headline" alt="# Headline">
</a>

Module to fetch information from readable evm smart contract methods. Mainly build for ERC721 Methods like tokenURI(n), name() and symbol() ...

<br>
<br>
<a href="#table-of-contents">
<img src="https://raw.githubusercontent.com/a6b8/a6b8/main/docs/nft-token-uri-for-nodejs/readme/headlines/quickstart.svg" height="55px" name="quickstart" alt="Quickstart">
</a>


<br>
<a href="#table-of-contents">
<img src="https://raw.githubusercontent.com/a6b8/a6b8/main/docs/nft-token-uri-for-nodejs/readme/headlines/table-of-contents.svg" height="55px" name="table-of-contents" alt="Table of Contents">
</a>
<br>

1. [Quickstart](#quickstart)<br>
2. [Setup](#setup)<br>
3. [Methods](#methods)<br>
4. [Contributing](#contributing)<br>
5. [Limitations](#limitations)<br>
6. [Credits](#credits)<br>
7. [License](#license)<br>
8. [Code of Conduct](#code-of-conduct)<br>
9. [Support my Work](#support-my-work)<br>

<br>
<br>
<a href="#table-of-contents">
<img src="https://raw.githubusercontent.com/a6b8/a6b8/main/docs/local-path-builder-for-ruby/readme/headlines/setup.svg" height="55px" name="setup" alt="Setup">
</a>

<br>
<br>
<a href="#table-of-contents">
<img src="https://raw.githubusercontent.com/a6b8/a6b8/main/docs/nft-token-uri-for-nodejs/readme/headlines/methods.svg" height="55px" name="methods" alt="Methods">
</a>

### NFT.load_abi( address )

### tokenURI( cmds, config, abis=null )

Expect an Objects. Every Object is one address, every address can have multiple methods to call.

```bash
npm i nft-token-uri
npm i dotenv
```

```javascript
require( 'dotenv' ).config( { path: '.env' } )
const { tokenURI } = require( 'nft-meta-data' )

let cmd = {
    'cmd': 253
    'address': '0xFF9C1b15B16263C61d017ee9F65C50e4AE0113D7',
    'network': 'homestead',
    'etherscan_api_key': process.env.ETHERSCAN_API_KEY,
    'infura_project_id': process.env.INFURA_PROJECT_ID,
    'infura_project_secret': process.env.INFURA_PROJECT_SECRET,
    'silent': false,
    'shrink': true
}


tokenURI( cmd )
.then( ( results ) => {
    data = { 'data': results }
    content = JSON.stringify( results, null, 4 )
    console.log( content )
} )
```


### .tokenURIs( [] )

Expect an Array of Objects. Every Object is one address, every address can have multiple methods to call.


```bash
npm i nft-token-uri
npm i dotenv
```

```javascript
require( 'dotenv' ).config( { path: '.env' } )
const { tokenURIs } = require( 'nft-token-uri' )

let config = {
    'cmd': null,
    'address': null,
    'network': 'homestead',
    'etherscan_api_key': process.env.ETHERSCAN_API_KEY,
    'infura_project_id': process.env.INFURA_PROJECT_ID,
    'infura_project_secret': process.env.INFURA_PROJECT_SECRET,
    'silent': false,
    'shrink': true
}

tests = [
    {
        "name": "Anchor Certificate",
        "address": "0x600a4446094C341693C415E6743567b9bfc8a4A8"
        "cmd": "40304442284165873759735888198141729455299047240663990062446596565539534752893" //uint256 as "string"
    },
    {
        "name": "Loot",
        "address": "0xFF9C1b15B16263C61d017ee9F65C50e4AE0113D7"
        "cmd": 253 // short for tokenURI(253)
    },
]

adresses = tests.map( ( test ) => { 
    config['cmd'] = [ test['cmd], 'name()', 'symbol()' ]
    config['address'] = test['address']
    return config
} )


tokenURIs( adresses )
.then( ( results ) => {
    JSON.stringify( results, null, 4 )
} )
```






**Input**
| **Type** | **Required** | **Description** | **Example** | **Description** |
|------:|:------|:------|:------|:------| 
| **** | `````` |  |  |  |

**Return**<br>
Hash    
<br>
<br>
<br>
<a href="#table-of-contents">
<img src="https://raw.githubusercontent.com/a6b8/a6b8/main/docs/nft-token-uri-for-nodejs/readme/headlines/contributing.svg" height="55px" name="contributing" alt="Contributing">
</a>

Bug reports and pull requests are welcome on GitHub at https://github.com/a6b8/nft-token-uri-for-nodejs. This project is intended to be a safe, welcoming space for collaboration, and contributors are expected to adhere to the [code of conduct](https://github.com/a6b8/nft-token-uri-for-nodejs/blob/master/CODE_OF_CONDUCT.md).
<br>
<br>
<br>
<a href="#table-of-contents">
<img src="https://raw.githubusercontent.com/a6b8/a6b8/main/docs/nft-token-uri-for-nodejs/readme/headlines/limitations.svg" height="55px" name="limitations" alt="Limitations">
</a>
- Tested for a small list of addresses.
<br>
<br>
<br>

<a href="#table-of-contents">
<img src="https://raw.githubusercontent.com/a6b8/a6b8/main/docs/nft-token-uri-for-nodejs/readme/headlines/credits.svg" height="55px" name="credits" alt="Credits">
</a>

- Ether.js
- https
<br>
<br>
<br>

<a href="#table-of-contents">
<img src="https://raw.githubusercontent.com/a6b8/a6b8/main/docs/nft-token-uri-for-nodejs/readme/headlines/license.svg" height="55px" name="license" alt="License">
</a>

The gem is available as open source under the terms of the [MIT License](https://opensource.org/licenses/MIT).
<br>
<br>
<br>
<a href="#table-of-contents">
<img src="https://raw.githubusercontent.com/a6b8/a6b8/main/docs/nft-token-uri-for-nodejs/readme/headlines/code-of-conduct.svg" height="55px" name="code-of-conduct" alt="Code of Conduct">
</a>
    
Everyone interacting in the nft-token-uri-for-nodejs project's codebases, issue trackers, chat rooms and mailing lists is expected to follow the [code of conduct](https://github.com/a6b8/nft-token-uri-for-nodejs/blob/master/CODE_OF_CONDUCT.md).
<br>
<br>
<br>