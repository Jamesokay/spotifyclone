export default function getTotalMs(array) {
        const durationRaw = array.map(item => item.duration_ms)
        const reducer = (accumulator, currentValue) => accumulator + currentValue
        const total = durationRaw.reduce(reducer)
        return total
}
