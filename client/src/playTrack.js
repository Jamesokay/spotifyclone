import axios from 'axios'

export default function playTrack(token, data) {

          const options = {
              url: 'https://api.spotify.com/v1/me/player/play',
              method: 'PUT',
              headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json',
              },
              data
          }

          console.log(options)

          axios(options)
          .then(response => {
            console.log(response)
          })
          .catch(error => {
            console.log(error)
          })
}
