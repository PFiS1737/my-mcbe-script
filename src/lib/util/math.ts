export function round(n: number) {
  if (n >= 0) return Math.round(n)
  return n % 0.5 === 0 ? Math.floor(n) : Math.round(n)
}

export function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min)) + min
}

export function withProbability(p: number) {
  return Math.random() <= p
}

export function equals(a: number, b: number, epsilon = 0.000001) {
  return Math.abs(a - b) <= epsilon * Math.max(1, Math.abs(a), Math.abs(b))
}

export function factorial(n: number): number {
  return n > 1 ? n * factorial(n - 1) : 1
}

export function combination(n: number, k: number) {
  return factorial(n) / (factorial(k) * factorial(n - k))
}

export function binomial(a: number, b: number, n: number) {
  return (k: number) => a ** (n - k) * b ** k * combination(n, k)
}

export function binomialDistribution(n: number, p: number) {
  return binomial(1 - p, p, n)
}

export function sum(from: number, to: number, fn: (i: number) => number) {
  let output = 0
  for (let i = from; i <= to; i++) output += fn(i)
  return output
}

export function range(from: number, to: number, step = 1) {
  const output = []
  for (let i = from; i < to; i += step) output.push(i)
  return output
}
