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
            searchResults: [],
            playlistName: "Test Playlist",
            playlistTracks: []
        };

        this.addTrack = this.addTrack.bind(this);
        this.removeTrack = this.removeTrack.bind(this);
        this.updatePlaylistName = this.updatePlaylistName.bind(this);
        this.savePlaylist = this.savePlaylist.bind(this);
        this.search = this.search.bind(this);
    }

    search(searchTerm) {
        Spotify.search(searchTerm).then(tracks => this.setState({searchResults: tracks}) );
    }

    savePlaylist(){
        Spotify.savePlaylist(this.state.playlistName, this.state.playlistTracks.map(track => track.uri));
//    SearchBar.clearSearchBar();
        this.setState({
            searchResults: [],
            playlistName: "New Playlist",
            playlistTracks: []
        });
    }

    updatePlaylistName(name) {
        this.setState({playlistName: name});
    }

    addTrack(track) {
        const playlistIndex = this.state.playlistTracks.findIndex(t => t.id === track.id);
        if (playlistIndex === -1){
            this.state.playlistTracks.push(track);
            this.setState({playlistTracks: this.state.playlistTracks});
        }
    }

    removeTrack(track){
        const playlistIndex = this.state.playlistTracks.findIndex(t => t.id === track.id);
        if (playlistIndex !== -1){
            this.state.playlistTracks.splice(playlistIndex, 1);
            this.setState({playlistTracks: this.state.playlistTracks});
        }
    }

  render() {
    return (
        <div>
            <h1>Ja<span className="highlight">mmm</span>ing</h1>
            <div className="App">
                <SearchBar onSearch={this.search}/>
                <div className="App-playlist">
                    <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack}/>
                    <Playlist playlistName={this.state.playlistName} onNameChange={this.updatePlaylistName} playlistTracks={this.state.playlistTracks} onRemove={this.removeTrack} onSave={this.savePlaylist}/>
                </div>
            </div>
        </div>
    );
  }
}

export default App;
