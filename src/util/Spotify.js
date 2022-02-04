const fetch = require('node-fetch');
const CLIENT_ID= 'YOUR CLIENT ID';
const REDIRECT_URI = 'http://localhost:3000/';

//

let accessToken;

const Spotify = {
  
	getAccessToken(){
		if (accessToken){
			return accessToken;
		}
		else{
			// Check for access token match
			const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
			const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

			if (accessTokenMatch && expiresInMatch){
				accessToken = accessTokenMatch[1];
				const expiresIn = Number(expiresInMatch[1]);

				//Clear the parameters
				window.setTimeout(() => accessToken = '', expiresIn*1000);
				window.history.pushState('Access Token', null, '/');
				return accessToken;
			}else {
				const accessUrl = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=token&scope=playlist-modify-public&redirect_uri=${REDIRECT_URI}`;
				window.location = accessUrl;
			}
		}
		
	},
	 async search (termSearch){
		let TrackList = [];
		let url = `https://api.spotify.com/v1/search?type=track&q=${termSearch}`
		try {
			let response =  await fetch (url, {headers: {Authorization: `Bearer ${accessToken}`}})
			if (response.ok){
				const trackList = await response.json().then((response)=>{
					response.tracks.items.map((track, index) => {
					TrackList[index] = {'id':track.id, 
										'name':track.name,
										'artist':track.artists[0].name,
										'album': track.album.name,
										'uri': track.uri}})
				})
				return TrackList
			}	
		}catch(error){
			console.log(`There was a problem - maybe I need to retrieve again the access token. Thi is the error ${error}`)
		}
	},
	
	//Function that saves the playlist
	async savePlaylist(playlistName, URI_arrays){
		if (playlistName && URI_arrays){
			try{
				// Getting the userID
				let headers = {Authorization: `Bearer ${accessToken}`}
				let url = 'https://api.spotify.com/v1/me'
				let response =  await fetch (url, {headers: headers})
				let userID = await response.json().then((response => response.id))

				// Creating the Spotify list
				let urlCreateList = `https://api.spotify.com/v1/users/${userID}/playlists`;		
				let body = {name:playlistName}
				let postMethod = await fetch(urlCreateList,{headers:headers, method: 'POST', body:JSON.stringify(body)})
				let playListId = await postMethod.json().then((response => response.id));


				//Add Tracks to the list
				let urlAddTracks = `https://api.spotify.com/v1/playlists/${playListId}/tracks`;
				body = {uris:URI_arrays};
				let postMethodAdd = await fetch(urlAddTracks, {headers:headers, method: 'POST', body:JSON.stringify(body)})
				let responseAddTrack = await postMethodAdd.json().then((response => response));
			}catch(error){
				console.log(error);
			}
			}
		else{
			return;
			}
	},

	// Function that gets the link for the preview of a song
	async searchPreview(song_id){
		let url = `https://api.spotify.com/v1/tracks/${song_id}`
		
		try{
			let response = await fetch (url, {headers:{Authorization: `Bearer ${accessToken}`}})
			if (response.ok){
				let url_preview = await response.json().then(response => response.preview_url)
				return url_preview;
			}
		}catch(e){
			console.log(e);
		}
	}
}



accessToken = Spotify.getAccessToken();
module.exports = Spotify;



