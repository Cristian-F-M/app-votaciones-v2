export function findConfig({ configs, code }) {
  return configs.find(c => {
    return c.code === code.trim()
  })
}
