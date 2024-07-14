import type { AxiosRequestConfig } from 'axios'
import axios from 'axios'
import httpCache, { configToKey } from './httpCache'

const instance = axios.create({
  timeout: 3000
})

instance.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

instance.interceptors.response.use(
  (response) => {
    if (response.status === 200 && response.config.method === 'get') {
      const curHttpCacheKey = configToKey(response.config)
      httpCache.setCache(curHttpCacheKey, response)
    }
    return response
  },
  (error) => {
    return Promise.reject(error)
  }
)

export function get<T = any>(url: string, config: AxiosRequestConfig = {}): Promise<T> {
  const curHttpCacheKey: string = configToKey({
    url,
    ...config
  })
  if (!httpCache.hasCache(curHttpCacheKey)) {
    const httpRequest = instance.get(url, config)
    httpCache.setCache(curHttpCacheKey, httpRequest)
    return httpRequest as Promise<T>
  } else {
    return Promise.resolve(httpCache.getCache(curHttpCacheKey))
  }
}

export function post<T = any, D = any>(
  url: string,
  data: D,
  config: AxiosRequestConfig = {}
): Promise<T> {
  httpCache.deleteCacheByStarts(url)
  return instance.post(url, data, config)
}

export function put<T = any, D = any>(
  url: string,
  data: D,
  config: AxiosRequestConfig = {}
): Promise<T> {
  httpCache.deleteCacheByStarts(getCacheUrl(url))
  return instance.put(url, data, config)
}

export function del<T = any>(url: string, config: AxiosRequestConfig = {}): Promise<T> {
  httpCache.deleteCacheByStarts(getCacheUrl(url))
  return instance.delete(url, config)
}

function getCacheUrl(url: string) {
  return url.split('/').slice(0, -1).join('/')
}

export default {
  get,
  post,
  put,
  delete: del
}
