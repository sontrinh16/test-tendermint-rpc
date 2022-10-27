const { toBech32, fromHex } = require('@cosmjs/encoding')

module.exports.checkMissBlock = (prefix, addresses, valcons) => {
    let check = true

    if (addresses.length <= 0) return check

    addresses.forEach(addr => {
        const addrUint8Array = fromHex(addr)

        const valconsAddr = toBech32(prefix, addrUint8Array)

        if (valconsAddr === valcons) {
            check = false
        }
    });

    return check
}