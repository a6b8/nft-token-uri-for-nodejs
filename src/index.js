const ethers = require( './ethers' )
const https= require( 'https' )

const NFT = class NFT {
    constructor( _config, _abis=null ) {
        this.config = null
        this.silent = false
        this.address = null
        this.provider = ''
        this.messages = []
        this.results = null
    }

    init( config, _abis=null ) {
        return new Promise( ( resolve, reject ) => {
            this.config = config
            this.silent = this.config['silent']
            this.address = this.config['address']
            this.provider = ethers.getDefaultProvider(
                this.config['network'], {
                    etherscan: this.config['etherscan_api_key'],
                    infura: {
                        projectId: this.config['infura_project_id'],
                        projectSecret: this.config['infura_project_secret'],
                    }
                } 
            )

            if( _abis === null ) {
                this.load_abi( this.address )
                    .then( ( results ) => {
                        this.abis = results[ 0 ]
                        resolve( results )
                    } )
                    .catch( ( err ) => { 
                        resolve( err ) } )
            } else {
                this.abis = _abis
                resolve( true )
            }
        } )
    }


    load_abi( address ) {
        return new Promise( ( resolve, reject ) => {
            let human_readable = []

            let url = ''
            url += 'https://api.etherscan.io/api?module=contract&action=getabi&address='
            url +=  address
            url += `&apikey=${this.config['etherscan_api_key']}`

            const req = https.get( url, ( res ) => {
                let body = ''
                res.on( 'data', ( chunk ) => ( body += chunk.toString() ) )
                res.on( 'end', () => {
                    if( res.statusCode >= 200 && res.statusCode <= 299 ) {
                        if( body !== null ) {
                            let json = JSON.parse( body )
                            switch( json['status'] ) {
                                case "0":
                                    !this.silent ? process.stdout.write( '❌ ABI     ' ) : ''
                                    this.messages.push( `Etherscan: ${json['result']}` )
                                    break
                                case "1":
                                    !this.silent ? process.stdout.write( '✅ ABI     ' ) : ''
                                    let tmp = JSON.parse( json['result'] )
                                    const iface = new ethers.utils.Interface( tmp )
                                    human_readable = iface.format( ethers.utils.FormatTypes.full )
                                    break
                                default: 
                                    !this.silent ? process.stdout.write( '❌ ABI     ' ) : ''
                                    this.messages.push( `Etherscan: Unknown Etherscan status: ${json['status']}` )
                            }
                            resolve( [ human_readable, this.messages ] )
                        } else {
                            this.messages.push( `Etherscan: Body is null.`)
                            resolve( [ human_readable, this.messages ] )
                        }
                    } else {
                        this.messages.push( `Etherscan: Http status is not in range 2**.` )
                        resolve( [ human_readable, this.messages ] )
                    }
                } )
            } )
            req.on( 'error', ( err ) => {
                this.messages.push( `Etherscan: Http Request raised an error. Please check "address" and "etherscan api key".` )
                return resolve( [ human_readable, this.messages ] ) 
            } )
        } )
    }


    tokenURI( cmd, silent=false ) {
        return new Promise( ( resolve, reject ) => {
            let item = {
                'input': cmd,
                'key': null,
                'value': null,
                'success': false,
                'standard': null,
                'type': null
            }

            let cmd_full = null
            switch( typeof( cmd ) ) {
                case 'number':
                    cmd = `tokenURI(${cmd})`
                    item['standard'] = 'ERC721'
                    break
                case 'string':
                    if( cmd.includes( 'tokenURI(' ) ) {
                        item['standard'] = 'ERC721'
                    } else {
                        item['standard'] = 'n/a'
                    }
                    break
                default:
                    this.messages.push( 'Wrong input type, use Integer or String instead.' )
                    break
            }

            if( this.messages.length == 0 ) {
                let cmd_full = `etherjs.${cmd}`

                let validation = this.compare( cmd, this.abis )
                item['key'] = validation['func']

                if( validation['success'] ) {
                    let etherjs = new ethers.Contract(
                        this.address, 
                        this.abis, 
                        this.provider
                    )

                    try {
                        eval( cmd_full )
                        .then( ( value ) => {
                            item['value'] = value
                            item['success'] = true
                            this.results = item
                            resolve( [ item, this.messages ] )
                        } )
                        .catch( ( err ) => {
                            // console.log(err)
                            this.messages.push( 'Function not found or parse error.' )
                            this.results = item
                            resolve( [ item, this.messages ] )
                        } )  
                    } catch( err ) {
                        this.messages.push( `CMDs: ${cmd_full} raised an error.` )
                        this.results = item
                        resolve( [ item, this.messages ] )
                    }  
                } else {
                    this.messages.push( validation['message'] )
                    this.results = item
                    resolve( [ item, this.messages ] )
                }
            } else {
                this.results = item
                resolve( [ item, this.messages ] )
            }
            
        } )
    }


    compare( search, list ) {        
        function str_difference( search, change ) {
            let longer = Math.max( ...[ search.length, change.length ] )
            let same = search
                .split( '' )
                .map( ( str, i ) => [ str, change[ i ] ] )
                .filter( ( a, b ) => { return ( a[ 0 ] === a[ 1 ] ) } )
                .length

            let result = ( longer - same ) / search.length
            return result
        }

        search = this.helper_func_name( search )
        let z = list
            .map( ( word ) => {
                let result = {
                    'score': null,
                    'func': this.helper_func_name( word ),
                    'search': word,
                    'exact': search === this.helper_func_name( word ),
                }
                result['score'] = str_difference( search, this.helper_func_name( word ) )
                result['exact'] = search == this.helper_func_name( word )
                return result
            } )

        let result = null
        let exact = z.filter( ( item ) => { return item['exact'] } ).length != 0

        if( exact ) {
            result = z.filter( ( item ) => { return item['exact'] } )[ 0 ]
            result['message'] = `Success! "${result['func']}" found!`
            result['success'] = true
            return result
        } else {
            result = z.reduce( ( prev, current ) => {
                return ( prev.score < current.score ) ? prev : current
            } )

            result['message'] = `"${search}" not found. Did you mean "${result['func']}()"?`
            result['success'] = false
            return result
        }
    }


    metadata_to_ascii() { 
        let payload = this.results

        if( payload['success'] ) {
            if( typeof( payload ) == 'object' ) {
                if( payload['standard'] === 'ERC721' && payload['success'] == true ) {
                    let tmp = this.helper_base64_to_ascii( payload['value'] )
                    payload['value'] = JSON.parse( tmp.split( "\n" ).join(' ') )
                    payload['value']['image'] = this.helper_base64_to_ascii( payload['value']['image'] )
                }
            }
        }
        this.results = payload
    }


    helper_base64_to_ascii( str ) {
        let result = null

        if( typeof( 'string' ) ) {
            if( str.includes( 'base64,' ) ) {
                let tmp = str
                    .split( 'base64,' )
                    .slice( -1 )[ 0 ]
                result = Buffer
                    .from( tmp, 'base64')
                    .toString('ascii')
            } else {
                result = str
            }
        }

        return result
    }


    helper_func_name( str ) {
        let search = str
            .split( '(' )[ 0 ]
            .split( ' ' )
            .slice( -1 )[ 0 ]
        return search
    }
    

    messages() { return this.messages }
    results() { return this.results }
    abis() { return this.abis }
}


const methodSingle = async ( cmd, config, abis=null ) => {
    try { 
        const token = new NFT()
        await token.init( config, abis )
        await token.tokenURI( cmd )

        return [ token.results, token.messages ]
    } catch ( err ) { return err }
}


const tokenURI = async ( cmds, config, abis=null ) => {
    try {

        if( typeof( cmds ) !== 'object' ) {
            cmds = [ cmds ]
        }

        let nr = 25
        !config['silent'] ? process.stdout.write( `${config['address'].substring( 0, nr )}... > `) : ''

        const tkn = new NFT()
        if( abis == null ) {
            await tkn.init( config, abis )
        }

        results = []
        messages = []
        for( let i = 0; i < cmds.length; i++ ) {
            let str = ''

            str += cmds[ i ].length > nr-5 ? `${cmds[ i ].substring( 0, nr-5 )}...` : cmds[ i ]
            a = new Array( nr - str.length )
            str += a.map( () => { '' } ).join( ' ' )

            let tmp = await methodSingle( cmds[ i ], config, tkn.abis )
            results.push( tmp[ 0 ] )
            tmp[ 0 ]['value'] == null ? str = '❌ ' + str : str = '✅ ' + str
            messages = messages.concat( tmp[ 1 ] )
            process.stdout.write( `${str}` )
        }

        // console.log( messages )
        if( messages.length == 0 ) {
            console.log()
        } else {
            messages.forEach( ( message, index ) => {
                index == 0 ? console.log() : ''
                console.log( `      - ${message}`)
            } )
        }


        item = {}
        item['address'] = config['address']
        if( config['shrink'] ) {
            results.forEach( ( r ) => { item[ r['key'] ] =  r['value'] } )
        } else {
            item = results
        }
        

        return item 
    } catch ( error ) {
        // console.log( error )
        item = {}
        item['address'] = config['address']
        return item
    }
}


const tokenURIs = async ( configs ) => {
    
    try {
        let results = { 'data': [] }

        for( let i = 0; i < configs.length; i++ ) {
            let tmp = new Array( 5 - ( i + '' ).length )
            let space = tmp.map( () => { '' } ).join( ' ' )

            process.stdout.write( `[${i}]${space}` )

            let config = configs[ i ]
            const a = await tokenURI( config['cmd'], config )
            results['data'].push( a )
        }

        return results
    } catch( err ) {
        //console.log( err )
        return {}
    }
}


module.exports = {
    'tokenURI': tokenURI,
    'tokenURIs': tokenURIs,
    'NFT': NFT
}