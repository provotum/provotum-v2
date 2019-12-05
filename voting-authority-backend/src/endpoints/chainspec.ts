import express from 'express'

import { verifyAddress } from '../utils/addressVerification'
import {
  getValueFromDB,
  getObjectFromDB,
  setValue,
  addToList,
  STATE_TABLE,
  CHAINSPEC_TABLE,
  DEFAULT_CHAINSPEC_TABLE,
  AUTHORITIES_TABLE,
} from '../database/database'

const SUCCESS_MSG: string = 'Successfully registered authority address.'
const ADDRESS_INVALID: string = 'Address registration failed. Address is not valid or has already been registered.'
const AUTHORITY_REGISTRATION_CLOSED: string = 'Authority registration is closed. Cannot register Authority address.'

const router: express.Router = express.Router()

router.get('/chainspec', (req, res) => {
  const state: string = <string>getValueFromDB(STATE_TABLE)

  // REGISTER -> returns default chainspec for authority account creation
  if (state === 'REGISTER') {
    const defaultConfig = getObjectFromDB(DEFAULT_CHAINSPEC_TABLE)
    res.status(200).json(defaultConfig)
  }
  // STARTUP -> returns the new chainspec containing all authority addresses
  else {
    const customConfig = getObjectFromDB(CHAINSPEC_TABLE)
    res.status(200).json(customConfig)
  }
})

router.post('/chainspec', (req, res) => {
  const state: string = <string>getValueFromDB(STATE_TABLE)

  // no longer allow authority registration once the voting state has changed to STARTUP
  if (state !== 'REGISTER') {
    res.status(400).json({ created: false, msg: AUTHORITY_REGISTRATION_CLOSED })
    return
  }

  // validate authority ethereum address
  const voterAddress: string = req.body.address
  const isAddressValid: boolean = verifyAddress(AUTHORITIES_TABLE, voterAddress)

  if (!isAddressValid) {
    res.status(400).json({ created: false, msg: ADDRESS_INVALID })
    return
  }

  // update list of validators
  const oldChainspec: any = getObjectFromDB(CHAINSPEC_TABLE)
  addToList(AUTHORITIES_TABLE, [voterAddress])

  try {
    const newChainspec: any = addValidatorToChainspec(oldChainspec, voterAddress)
    setValue(CHAINSPEC_TABLE, newChainspec)
    res.status(201).json({ created: true, msg: SUCCESS_MSG })
  } catch (error) {
    res.status(400).json({ created: false, msg: error.message })
  }
})

export const addValidatorToChainspec = (chainspec: any, address: string): any => {
  if (chainspec === null || typeof chainspec === undefined) {
    throw new TypeError('Cannot read chainspec since it is null.')
  }

  // updates the list of current validators in the current chainspec
  const validators: string[] = chainspec['engine']['authorityRound']['params']['validators']['list']
  if (validators === null || typeof validators === undefined) {
    throw new TypeError('Validators cannot be retrieved from chainspec since it is null.')
  }
  validators.push(address)
  chainspec['engine']['authorityRound']['params']['validators']['list'] = validators

  // pre-fund validator
  const accounts: any = chainspec['accounts']
  if (accounts === null || typeof accounts === undefined) {
    throw new TypeError('Accounts cannot be retrieved from chainspec since it is null.')
  }
  accounts[`${address}`] = { balance: "10000000000000000000000" }
  chainspec['accounts'] = accounts

  return chainspec
}

export default router