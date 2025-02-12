import sha256 from 'crypto-js/sha256'

export default function generateHash(content: string) {
  return `id${sha256(content).toString()}`
}
