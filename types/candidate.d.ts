import { User } from './user'

export type Candidate = {
  id: string
  user: User
  description: string
  imageUrl: string
}

export type CandidatePropToVote = Pick<Candidate, 'id' | 'user' | 'description'>
