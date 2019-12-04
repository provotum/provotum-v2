import express from 'express'
import { setValue, getValueFromDB } from '../database/database'
import { BallotManager } from '../utils/ballotManager/index'

export enum VotingState {
  REGISTER = 'REGISTER',
  STARTUP = 'STARTUP',
  CONFIG = 'CONFIG',
  VOTING = 'VOTING',
  TALLY = 'TALLY',
}

// database tables
const VOTING_STATE: string = 'state'

const router: express.Router = express.Router()

router.get('/state', (req, res) => {
  const currentState: string = <string>getValueFromDB(VOTING_STATE)
  res.status(201).json({ state: currentState })
})

router.post('/state', async (req, res) => {
  const currentState: string = <string>getValueFromDB(VOTING_STATE)

  var newState: string = ''

  console.log(currentState)
  switch (currentState) {
    case VotingState.REGISTER:
      newState = VotingState.STARTUP
      break
    case VotingState.STARTUP:
      newState = VotingState.CONFIG
      break
    case VotingState.CONFIG:
      newState = VotingState.VOTING
      break
    case VotingState.VOTING:
      newState = VotingState.TALLY
      break
  }

  let status = false
  if (newState === VotingState.VOTING) {
    await BallotManager.openBallot()
    status = await BallotManager.isBallotOpen()
  } else if (newState === VotingState.TALLY) {
    await BallotManager.closeBallot()
    status = await BallotManager.isBallotOpen()
  } else if (newState === '') {
    res.status(400).json({ state: currentState, msg: `There is nothing to change!` })
    return
  }

  setValue(VOTING_STATE, newState)

  res.status(201).json({ state: newState, msg: `Changed from '${currentState}' to '${newState}'`, isBallotOpen: `${status}` })
})

export default router
