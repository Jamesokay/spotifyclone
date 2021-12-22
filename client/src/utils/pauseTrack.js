import axios from 'axios'

export default function pauseTrack(token) {
          const options = {
              url: 'https://api.spotify.com/v1/me/player/pause',
              method: 'PUT',
              headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json',
              }
          }

          axios(options)
          .then(response => {
            console.log(response)
          })
          .catch(error => {
            console.log(error)
          })
}