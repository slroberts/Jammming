const clientId = '81b1febfe50642f883ecb3ce0a10430b';
const redirectURI = 'http://localhost:3000/';
let accessToken;

const Spotify = {

  getAccessToken() {

    if(accessToken) {

      return accessToken;

    }

    const accessTokenRetrieve = window.location.href.match(/access_token=([^&]*)/);
    const expireTime = window.location.href.match(/expires_in=([^&]*)/);

   if (accessTokenRetrieve && expireTime) {

     accessToken = accessTokenRetrieve[1];

     let expiresIn = Number(expireTime[1]);

     window.setTimeout(() => accessToken = '', expiresIn * 1000);

     window.history.pushState('Access Token', null, '/');

     return accessToken;

   } else {

     const accessURL = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;

     window.location = accessURL;

 }

},

  search(searchTerm) {

    const accessToken = Spotify.getAccessToken();

    return fetch('https://cors-anywhere.herokuapp.com/' + `https://api.spotify.com/v1/search?type=track&q=${searchTerm}&limit=10`, {

        headers: {
          Authorization: `Bearer ${accessToken}`
        }

      }).then(response => {

        return response.json();

      }).then(jsonResponse => {

        if (jsonResponse.tracks) {

          return jsonResponse.tracks.items.map(track => ({

            id: track.id,
            name: track.name,
            artist: track.artists[0].name,
            album: track.album.name,
            uri: track.uri

          }));
        } else {

          return [];

        }

      });

    },

    savePlaylist(playlistName, trackURIs) {
            if (!(playlistName && trackURIs)) {
                return;
            }

            const headers = {
                Authorization: 'Bearer ' + accessToken
            };
            let userId;
            fetch('https://cors-anywhere.herokuapp.com/' + 'https://api.spotify.com/v1/me', {headers: headers})
                .then(response => {
                    return response.json();
                }).then(jsonResponse => {
                if (!jsonResponse.id) {
                    return;
                }

                userId = jsonResponse.id;
                fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify({name: playlistName})
                }).then(response => {
                    return response.json();
                }).then(jsonResponse => {
                    if (!jsonResponse.id) {
                        return;
                    }

                    let playlistID = jsonResponse.id;

                    fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistID}/tracks`, {
                        method: 'POST',
                        headers: headers,
                        body: JSON.stringify({uris: trackURIs})
                    })
                })

            })
        }


};

export default Spotify;
