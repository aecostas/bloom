const fs = require('fs')
const { BloomFilter } = require('bloom-filters')

const BRITISH_ENGLISH_DICT = '/usr/share/dict/british-english'

const wordsText = fs.readFileSync(BRITISH_ENGLISH_DICT, 'utf-8');
const words = wordsText.split(/\r?\n/)

const searchedWords = [
    words[0],
    words[Math.floor(words.length / 2)],
    words[words.length - 1]
]

const errorRate = 0.04 // 4 % error rate
const bloomFilter = BloomFilter.from(words, errorRate)

const twice = [...searchedWords, ...searchedWords, ...searchedWords]

twice.forEach((word, i) => {
    console.time(`search-array-${i}`)
    const foundInArray = words.find(item => item === word)
    console.timeEnd(`search-array-${i}`)

    console.time(`search-bloom-${i}`)
    const foundInBloom = bloomFilter.has(word)
    console.timeEnd(`search-bloom-${i}`)
})


const used = process.memoryUsage().heapUsed / 1024 / 1024;

console.log(`The script uses approximately ${Math.round(used * 100) / 100} MB`);


