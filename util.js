const { toBech32, fromHex } = require('@cosmjs/encoding')

export const checkMissBlock = (prefix, signatures, valcons) => {
    if (signatures.length() <= 0) return true

    signatures.forEach(sig => {
        const sigUint8Array = fromHex(sig)

        const valconsAddr = toBech32(prefix, sigUint8Array)

        if (valconsAddr === valcons) {
            return false
        }

        return true
    });
}