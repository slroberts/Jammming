let accessToken;
const clientId = '0b649226fd83459889328f3e6d2206c5';
const redirectUri = 'http://localhost:3000/';
let userId;


let Spotify = {
    getAccessToken: function(){
        if (accessToken){
            return new Promise(resolve => resolve(accessToken));
        }
        const accessTokenRetrieve = window.location.href.match(/access_token=([^&]*)/);
        const expireTime = window.location.href.match(/expires_in=([^&]*)/);

        if (accessTokenRetrieve && expireTime) {
            accessToken = accessTokenRetrieve[1];
            const expiresIn = expireTime[1];
            window.setTimeout(() => accessToken = '', expiresIn * 1000);
            window.history.pushState('Access Token', null, '/');
        }
        else{
            window.location.href = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&&redirect_uri=${redirectUri}&scope=playlist-modify-public`;
        }
    },

search: function(searchTerm){
    Spotify.getAccessToken();
    const urlToFetch = `https://cors-anywhere.herokuapp.com/https://api.spotify.com/v1/search?type=track&q=${searchTerm}`;
    return fetch(urlToFetch,
        {
            headers: {Authorization: `Bearer ${accessToken}`}
        })
        .then(response => response.json())
        .then(jsonResponse => {
            if (jsonResponse.tracks){
                return jsonResponse.tracks.items.map(track => {
                    return {
                        id: track.id,
                        name: track.name,
                        artist: track.artists[0].name,
                        album: track.album.name,
                        uri: track.uri
                    };
                });
            }
        });
},

savePlaylist(listName, trackUriList){
    if (!listName || !trackUriList){
        return;
    }
    Spotify.getUserId().then(() => {
        Spotify.createPlaylist(listName).then(id => {
            Spotify.addTracksPlaylist(id, trackUriList).then(id => id);
        });
    });
},

getUserId(){
    if (userId){
        return new Promise(resolve => resolve(userId));
    }
    const urlToFetch = `https://cors-anywhere.herokuapp.com/https://api.spotify.com/v1/me`;
    return fetch(urlToFetch,
        {
            headers: {Authorization: `Bearer ${accessToken}`}
        })
        .then(response => response.json())
        .then(jsonResponse => {
            if (jsonResponse.id){
                userId = jsonResponse.id;
                return userId;
            }
        });
},

createPlaylist(playlistName){
    const urlToFetch = `https://cors-anywhere.herokuapp.com/https://api.spotify.com/v1/users/${userId}/playlists`;
    return fetch(urlToFetch,
        {
            method: 'POST',
            headers: {Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json; charset=utf-8'},
            body: JSON.stringify({name: playlistName})
        })
        .then(response => response.json())
        .then(jsonResponse => {
            if (jsonResponse.id){
                return jsonResponse.id;
            }
        });
},

addTracksPlaylist(playlistId, trackUriList){
    const urlToFetch = `https://cors-anywhere.herokuapp.com/https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`;
    return fetch(urlToFetch,
        {
            method: 'POST',
            headers: {Authorization: `Bearer ${accessToken}`},
            body: JSON.stringify({uris: trackUriList})
        })
        .then(response => response.json())
        .then(jsonResponse => {
            if (jsonResponse.snapshot_id){
                return jsonResponse.snapshot_id;
            }
        });
}
};

export default Spotify;
