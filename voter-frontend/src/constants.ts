export const NOT_FUNDED_ERROR_MESSAGE = 'Wallet could not be funded with Ether.'
export const NO_CONTRACT_ADDRESS_ERROR_MESSAGE =
  'No correct contract address was returned from the server. Maybe the contract was not deployed yet.'
export const NO_ACCOUNTS_FOUND_ERROR_MESSAGE = 'Could not get any existing addresses on the chain.'
export const PERSONAL_ACCOUNT_ERROR_MESSAGE = 'Could not create your wallet.'

export const ACCESS_PROVIDER_URL = `https://${process.env.REACT_APP_ACCESS_PROVIDER_IP}:${process.env.REACT_APP_ACCESS_PROVIDER_PORT}`
export const IDENTITY_PROVIDER_URL = `https://${process.env.REACT_APP_IDENTITY_PROVIDER_IP}:${process.env.REACT_APP_IDENTITY_PROVIDER_PORT}`
export const ETHSTATS_URL = `https://${process.env.REACT_APP_ETHSTATS_IP}:${process.env.REACT_APP_ETHSTATS_PORT}`
