export default function flagSavedTracks(tracksArr, savedArr) {
        let newArr = []
        for (let i = 0; i < tracksArr.length; i++) {
            let obj = {...tracksArr[i], saved: savedArr[i]}
            newArr.push(obj)
        }
        return newArr
}
