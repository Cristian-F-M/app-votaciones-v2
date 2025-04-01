import type { Role } from 'role'
import type { TypeDocument } from 'typeDocument'

export type User = {
  id: string
  name: string
  lastname: string
  typeDocument: string
  document: string
  phone: string
  email: string
  imageUrl: string
  role: string
  voted: boolean
  roleUser?: Role
  typeDocumentUser?: TypeDocument
}
