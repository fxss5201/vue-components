import type { AxiosRequestConfig } from 'axios'
import CacheMemory from 'f-cache-memory'

const httpCache = new CacheMemory()
// const httpCache = new CacheMemory(100, 1000)

export function configToKey(config: AxiosRequestConfig): string {
  let key = config.url as string
  if (config.params) {
    key += JSON.stringify(config.params)
  }
  return key
}

export default httpCache
