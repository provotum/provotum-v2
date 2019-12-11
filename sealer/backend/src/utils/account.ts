import fs from 'fs'
import path from 'path'
import { getValueFromDB, WALLET_TABLE } from '../database/database'

export const getWallet = () => {
  let storedWallet = getValueFromDB(WALLET_TABLE)

  if (storedWallet === '') {
    const wallet = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../wallet/sealer.json'), 'utf8'))
    return '0x' + wallet.address
  } else {
    return '0x' + storedWallet
  }
}

export const getPassword = () => {
  const password = fs.readFileSync(path.resolve(__dirname, '../../wallet/sealer.pwd'), 'utf8')
}
