const { performance, PerformanceObserver } = require("perf_hooks")
const stats = require('simple-statistics')
const sizeof = require('object-sizeof')

const { BloomFilter } = require('bloom-filters')
const errorRate = 0.04 // 4 % error rate

const NUMBER_OF_ELEMENTS = 10 ** 6

const numbers = Array(NUMBER_OF_ELEMENTS).fill().map((item, i) => i)

const bloomFilterNumbers = BloomFilter.from(numbers, errorRate)

console.warn(`Array size: ${sizeof(numbers)}`)
console.warn(`Bloom size: ${sizeof(bloomFilterNumbers)}`)

const measure = (text, fn) => {
    const NUMBER_OF_TRIALS = 10
    const durations = []
    const perfObserver = new PerformanceObserver((items) => {
        items.getEntries().forEach((entry) => {
            durations.push(entry.duration)
        })
    })

    perfObserver.observe({ entryTypes: ["function"] })

    const perfWrapper = performance.timerify(fn)

    for (let trial = 0; trial < NUMBER_OF_TRIALS; trial++) {
        perfWrapper()
    }

    perfObserver.disconnect()
    console.warn(text, stats.mean(durations).toFixed(4), stats.standardDeviation(durations).toFixed(4))
}

measure('numbers-array-first', () => numbers.find(item => item === 0))
measure('numbers-array-middle', () => numbers.find(item => item === Math.floor(NUMBER_OF_ELEMENTS / 2)))
measure('numbers-array-last', () => numbers.find(item => item === NUMBER_OF_ELEMENTS - 1))

measure('numbers-bloom-first', () => bloomFilterNumbers.has(0))
measure('numbers-bloom-middle', () => bloomFilterNumbers.has(Math.floor(NUMBER_OF_ELEMENTS / 2)))
measure('numbers-bloom-last', () => bloomFilterNumbers.has(NUMBER_OF_ELEMENTS - 1))
