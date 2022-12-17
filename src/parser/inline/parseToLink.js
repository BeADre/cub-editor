const MIN_LENGTH = 5
const emailReg = /(^|\s+)[A-Za-z0-9_\-.]+@[A-Za-z0-9_\-.]+\.[A-Za-z]{2,4}($|\s+)/
const urlReg = /(^|\s+)(?:ht|f)tps?:\/\/[\w-]+(?:\.[\w-]+)+([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?($|\s+)/
// eslint-disable-next-line max-len
const splitReg = /(^|\s+)([A-Za-z0-9_\-.]+@[A-Za-z0-9_\-.]+\.[A-Za-z]{2,4}|(?:ht|f)tps?:\/\/[\w-]+(?:\.[\w-]+)+(?:[\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?)($|\s+)/

export default function parseToLink({ tokens }) {
  tokens.some((token, index) => {
    if (
      typeof token !== 'string' ||
      token.length < MIN_LENGTH ||
      (!emailReg.test(token) && !urlReg.test(token))
    ) return false

    const newToken = token.split(splitReg).filter(str => str).map(value => {
      if (value.length < MIN_LENGTH) return value

      if (emailReg.test(value)) {
        return {
          type: 'email',
          content: [value]
        }
      }

      if (urlReg.test(value)) {
        return {
          type: 'url',
          content: [value]
        }
      }

      return value
    })

    tokens.splice(index, 1, ...newToken)
  })
}
