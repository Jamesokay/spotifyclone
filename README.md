# Spotify Clone

Reproduction of the Spotify web application for desktop, achieving the same functionality as the live site. Built using React, composed of functional components and React Hooks.

<br>


https://user-images.githubusercontent.com/78640728/169690021-2e07ff3a-b04b-4f95-9c3f-4055e32f01e4.mp4

<br>

## Features

<br>

-	Dashboard comprising user’s recently played contexts (albums, artists, playlists), as well as recommendations based on both recent and long-term user data.
-	Album and playlist pages with animated, interactive tables listing the tracks.
-	Artist pages, displaying the given artist’s most popular tracks, their discography sorted by both popularity and category, as well as related artists.
-	Library of user’s saved tracks, albums, artists and playlists. User is able to curate these libraries, with the ability to both add and remove items. 
-	User is able to create and modify their own playlists, as well as being provided with recommended additions to the given playlist based on its current content.
-	Search feature which structures results based on user’s past listening habits, providing a personalised response for the given query.
-	Fully functional web player component making use of Spotify Playback SDK; allowing the user to play, pause, skip, repeat, rewind, shuffle, adjust the volume, and drag to the desired position within a given track.
-	Recently Played section makes use of the Canvas API to derive the average RGB value of each card’s image. When any of the cards are hovered over, the background colour of the container transitions to match that card’s RGB value, replicating the effect seen on the official Spotify site.
-	Context API used for authentication, layout, theme, menu options and currently playing track.
-	Requests handled with both Axios and Spotify Web API Node.
-	Routing handled with React Router.
-	Server built using Node and Express, primarily for handling the authentication process and providing an access token to the front end.

