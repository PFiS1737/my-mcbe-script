export function round(n) {
  if (n >= 0) return Math.round(n)
  return n % 0.5 === 0 ? Math.floor(n) : Math.round(n)
}

export function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min
}

export function withProbability(p) {
  return Math.random() <= p
}

export function equals(a, b, epsilon = 0.000001) {
  return Math.abs(a - b) <= epsilon * Math.max(1, Math.abs(a), Math.abs(b))
}

export function factorial(n) {
  return n > 1 ? n * factorial(n - 1) : 1
}

export function combination(n, k) {
  return factorial(n) / (factorial(k) * factorial(n - k))
}

export function binomial(a, b, n) {
  return (k) => a ** (n - k) * b ** k * combination(n, k)
}

export function binomialDistribution(n, p) {
  return binomial(1 - p, p, n)
}

export function sum(from, to, fn) {
  let output = 0
  for (let k = from; k <= to; k++) output += fn(k)
  return output
}

export function range(from, to, step = 1) {
  const output = []
  for (let i = from; i < to; i += step) output.push(i)
  return output
}
