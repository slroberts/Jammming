const clientId = '0f82e39e9b5d4d79ba0df074a1e1d940';
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

     const expiresIn = Number(expireTime[1]);

     window.setTimeout(() => accessToken = '', expiresIn * 1000);

     window.history.pushState('Access Token', null, '/');

     return accessToken;

   } else {

     const accessURL = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;

     window.location = accessURL;

 }

},

  search(term) {

    return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {

        headers: {
          'Authorization': `Bearer ${accessToken}`
        }

      }).then(response => {

        return response.json();

      }).then(jsonResponse => {

        if (jsonResponse.tracks) {

          return jsonResponse.tracks.map(track => ({

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

    savePlaylist(playlistName, trackUri) {

      if (!playlistName && !trackUri.length) {

        return;

      }

    let accessToken = `${accessToken}`;

    let headers = {

      'Authorization': `Bearer ${accessToken}`

    }

    let userId = '';

    return fetch(`https://api.spotify.com/v1/me`, {headers: headers}).then(response => {

      return response.json();

    }).then(jsonResponse => {

      response.id = userId;

    }).then(fetch (`https://api.spotify.com//v1/users/${userId}/${this.props.playlistName}`, {

      headers: headers,
      method: 'POST',
      body: JSON.stringify({name: this.props.playlistName})

    }).then(response => {

      return response.json();

    }).then(jsonResponse => {

      response.id = playlistID;

    }))
  }

};

export default Spotify;
