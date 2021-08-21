export default function getTotalDuration(array) {
    
    const durationRaw = array.map(item => {
       return (item.track)? item.track.duration_ms : item.duration_ms
    })
    const reducer = (accumulator, currentValue) => accumulator + currentValue
    const totalMS = durationRaw.reduce(reducer)

    if (totalMS < 3600000) {
        let mins = parseInt(totalMS / 1000 / 60)
        let secs = parseInt(Math.floor(totalMS / 1000 % 60))   
        return (mins + ' min ' + secs + ' secs ')
    }
    else {
        let hours = parseInt(totalMS / 60000 / 60)
        let mins = parseInt(Math.floor(totalMS / 60000 % 60))
        return (hours + ' hours ' + mins + ' mins')
    }   
}
