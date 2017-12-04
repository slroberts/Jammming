import React, { Component } from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import Spotify from '../../util/Spotify';

class App extends Component {
  constructor(props) {

      super(props);

      this.state = {

        searchResults: [

          {
            name: 'Theme Music',
            artist: 'Fabolous, Jadakiss, Swizz Beatz',
            album: 'Friday On Elm Street'
          },
          {
            name: 'The Seed (2.0)',
            artist: 'The Roots, Cody ChestnuTT',
            album: 'Friday On Elm Street'
          }

        ],

        playlistName: 'New Playlist',

        playlistTracks: [

          {
            name: 'Its The R',
            artist: 'Rakim',
            album: 'The Master'
          },

          {
            name: 'The Story of O.J',
            artist: 'Jay Z',
            album: '4:44'
          }

        ]

      };

      this.addTrack = this.addTrack.bind(this);
      this.removeTrack = this.removeTrack.bind(this);
      this.updatePlaylistName = this.updatePlaylistName.bind(this);
      this.savePlaylist = this.savePlaylist.bind(this);
      this.search = this.search.bind(this);

    }

    addTrack(track) {
        let tracks = this.state.playlistTracks;
        if (this.state.playlistTracks.indexOf(track) === -1) {
          tracks = tracks.push(track);
          this.setState({playlistTracks: tracks});
        }
      }

      removeTrack(track) {
        let tracks = this.state.playlistTracks;
        if (tracks.indexOf(track) > -1) {
          tracks.filter(currentTrack => currentTrack != track.id);
          this.setState({playlistTracks: tracks})
        }
      }

   updatePlaylistName(name) {
     this.setState({ playlistName: name });
   }

   savePlaylist(){
    let trackURIs = [];
    this.state.playlistTracks.forEach(track => {
      if (track.uri){
        trackURIs.push(track.uri)
      }
    });
    if (trackURIs.length>0){ // will not save an empty playlist
      Spotify.savePlaylist(this.state.playlistName, trackURIs);
      this.setState({ playlistName: 'New Playlist', playlistTracks: [], });
    }else{
      alert("Playlist is empty.");
    }
  }

   search(term) {
     Spotify.search(term);
   }

  render() {

    return (

      <div>

        <h1>Ja<span className="highlight">mmm</span>ing</h1>

        <div className="App">

          <SearchBar onSearch={this.search} />
          <div className="App-playlist">

            <SearchResults
              searchResults={this.state.searchResults}
              onAdd={this.addtrack}
            />

            <Playlist
              playlistName={this.state.playlistName}
              playlistTracks={this.state.playlistTracks}
              onRemove={this.removeTrack}
              onNameChange={this.updatePlaylistName}
              onSave={this.savePlaylist}
            />

          </div>

        </div>

      </div>
    );
  }
}

export default App;
