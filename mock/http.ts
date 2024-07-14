export function resultSuccess<T>(result?: T, { message = 'ok' } = {}) {
  return {
    code: 0,
    result,
    message
  }
}
