import axios from 'axios'

export default function like(token, URL) {
          const options = {
              url: URL,
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