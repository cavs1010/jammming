import './Track.css';
import React from 'react';

class Track extends React.Component{
  
	constructor(props){
		super(props);
		this.addTrack = this.addTrack.bind(this);
		this.removeTrack = this.removeTrack.bind(this);
		this.playTrack = this.playTrack.bind(this);
	}
	
	addTrack(){
		this.props.onAdd(this.props.track);
	}

	removeTrack(){
		this.props.onRemove(this.props.track);
	}

	playTrack(){
		//console.log(this.props.track.id.split(':')[2]);
		let songToPlay = this.props.track.id.split(':')[2];
		this.props.onPlay(songToPlay);
	}
	
	render (){
    return (
		<div className="Track">
			<div className="Track-information">
				<h3>{this.props.track.name}</h3>
				<p>{this.props.track.artist}| {this.props.track.album}</p>
			</div>
			<button className="Track-play-preview" onClick={this.props.isPlayable ? this.playTrack: (e)=>{e.preventDefault();}}>{this.props.isPlayable ? <i className="fa fa-play-circle"></i> : ''}</button>
			<button className="Track-action" onClick={this.props.isRemoval ? this.removeTrack : this.addTrack}>{this.props.isRemoval ? '-' : '+'}</button>
		</div>
    );
  }
}

export default Track;