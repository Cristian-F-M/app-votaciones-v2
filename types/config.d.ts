export type Config = {
  id: string
  name: string
  code: string
  description: string
  value: string
}

export type ConfigContextType = {
  config: Config[] | []
  setConfig: React.Dispatch<React.SetStateAction<Config[] | []>>
} | null
