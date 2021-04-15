import { config } from 'dotenv'

// Important. This is needed, else the provess.env variables are undefined
config()

export const serverConfig = {
  authUrl: `http://${process.env.VOTING_AUTH_BACKEND_IP}:${process.env.VOTING_AUTH_BACKEND_PORT}`,
  nodeUrl: `http://${process.env.PARITY_NODE_IP}:${process.env.PARITY_NODE_PORT}`,
  nodeUrlExternal: `http://${process.env.PARITY_NODE_EXTERNAL_IP}:${process.env.PARITY_NODE_EXTERNAL_PORT}`,
  accountAddress: '0x004661de90cd1dcb998e8464a0f3c3da9f085950',
  accountPassword: 'access',
}
