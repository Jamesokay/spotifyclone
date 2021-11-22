import axios from 'axios'

export default function unlike(token, id) {
          const options = {
              url: `https://api.spotify.com/v1/me/albums?ids=${id}`,
              method: 'DELETE',
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