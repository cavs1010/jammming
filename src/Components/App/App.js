import './App.css';
import fetch from 'node-fetch';
import React from 'react';
import SearchBar from '../SearchBar/SearchBar.js';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
const Spotify = require('../../util/Spotify.js')



class App extends React.Component{
  constructor(props){
    super(props);   
    this.state = {searchResults:[
                                  {name:'Is this love', artist:'Bob Marley & The Wailers', album:'Kaya', id:'spotify:track:6JRLFiX9NJSoRRKxowlBYr'}],
                  playListName:'New Playlist',
                  playListTracks:[
                                  {name:"Knoking on Heaven's door", artist:'Bob Dylan', album:'Hurricane', id:'spotify:track:6HSXNV0b4M4cLJ7ljgVVeh'},
                                  {name:'Like a rolling stone',  artist:'Bob Dylan', album:'Hurricane', id:'spotify:track:3AhXZa8sUQht0UEdBJgpGc'},
                                  {name:'Blowin in the wind',  artist:'Bob Dylan', album:'Hurricane', id:'spotify:track:18GiV1BaXzPVYpp9rmOg0E'}],
                  currentPlayedSong:null
                }
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);   
    this.savePlaylist = this.savePlaylist.bind(this);  
    this.search = this.search.bind(this);   
    this.searchPreview = this.searchPreview.bind(this);  
    this.playAudio = this.playAudio.bind(this);                
  }

  //Search songs
  async search(searchTerm){
    let searchTracks = await Spotify.search(searchTerm);
    let listSearchResults = searchTracks.map(track => ({name: track.name, artist: track.artist, album: track.album, id:track.uri}));
    this.setState({searchResults: listSearchResults})
  }

  //Search preview of a song
  async searchPreview(){
    Spotify.searchPreview();
  }

  //Play the preview afterclicking the object
  async playAudio (songToPlay) {
    let url = await Spotify.searchPreview(songToPlay);
    let audioObj = new Audio(url);
    audioObj.volume = 0.3;
    if (this.state.currentPlayedSong == null){
      this.setState({currentPlayedSong: audioObj});
      audioObj.play()
    }else{
      if (this.state.currentPlayedSong.paused){
        this.setState({currentPlayedSong: audioObj});
      }else{
        this.state.currentPlayedSong.pause();
        this.setState({currentPlayedSong: audioObj});
      }
      audioObj.play()
    }
  }

  savePlaylist(){
    let trackURIs = this.state.playListTracks.map(track => track.id);
    Spotify.savePlaylist(this.state.playListName, trackURIs)
  }

  addTrack(track){
    let tracks = this.state.playListTracks;
    if (tracks.find(savedTrack => savedTrack.id === track.id)){
      return;
    }else{
      tracks.push(track);
     this.setState({playListTracks:tracks}); 
    }
  }

  removeTrack(track){
    let tracks = this.state.playListTracks;
    tracks = tracks.filter(currentTrack => currentTrack.id !== track.id ); 
    this.setState({playListTracks:tracks});
  }

  updatePlaylistName(newName){
    this.setState({playListName:newName});
  }

  render (){
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar
            onSearch={this.search}
          />
          <div className="App-playlist">
            <SearchResults 
              searchResults={this.state.searchResults} 
              onAdd={this.addTrack}
              onPlay={this.playAudio}
            />
            <Playlist 
              playListName={this.state.playListName} 
              playListTracks={this.state.playListTracks} 
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
