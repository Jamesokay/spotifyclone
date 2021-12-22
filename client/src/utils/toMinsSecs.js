export default function toMinsSecs(time) {
    let mins = parseInt(time / 1000 / 60)
    let secs = parseInt(Math.floor(time / 1000 % 60))

      if (secs < 10) {
        return (mins + ':0' + secs)
      }
      else {
        return (mins + ':' + secs)
      }
}
