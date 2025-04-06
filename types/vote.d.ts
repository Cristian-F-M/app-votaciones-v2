import { User } from './user'

export interface Vote {
  id: string
  userId: string
  cantVotes: number
  totalVotes: number
  startDate: string
  endDate: string
  finishVoteInfo: finishVoteInfo
  isFinished: boolean
}

interface finishVoteInfo {
  cantVotesWinner: number
  totalVotes: number
  candidates: {
    id: string
    imageUrl: string
    description: string
    votes: number
    user: Pick<User, 'id' | 'name' | 'lastname' | 'imageUrl'>
  }[]
}
