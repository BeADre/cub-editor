const ALPHABET = []
const INTEGER = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1]
const ROMAN = ['m', 'cm', 'd', 'cd', 'c', 'xc', 'l', 'xl', 'x', 'ix', 'v', 'iv', 'i']

for (let i = 97; i <= 122; i++) {
  ALPHABET.push(String.fromCharCode(i))
}

const transformAlphabet = n => {
  if (n <= 26) return ALPHABET[n - 1]

  else if (n % 26 === 0) return transformAlphabet(Math.floor(n / 26) - 1) + 'z'

  return transformAlphabet(Math.floor(n / 26)) + transformAlphabet(n % 26)
}

const transformRoman = n => {
  let res = ''
  let pointer = 0

  while (n > 0) {
    if (n >= INTEGER[pointer]) {
      res += ROMAN[pointer]
      n -= INTEGER[pointer]
    } else pointer++
  }

  return res
}


export function transformLevel(indentation, level) {
  const tab = indentation.split('\t').length - 1

  if (tab % 3 === 0) return level
  if (tab % 3 === 1) return transformRoman(level)
  if (tab % 3 === 2) return transformAlphabet(level)
}
