import React from 'react';
import PropTypes from 'prop-types';

/*
* Playlist() returns a list of track
* @param string trackDuration,
* @param number trackNumber,
* @param callback onClick,
* @param string path,
* */

function Playlist({ trackDuration, trackNumber, trackName, onClick, path }) {
	return (
		<li id={`trackNumber-${trackNumber}`}>
			<div className="playlist__Item" onClick={() => onClick(trackNumber)}>
				<span className="playlist__Number"> {trackNumber}</span>
				<span className="playlist__Title">{trackName}</span>
				<span className="playlist__Length">
                    <i className="fa fa-volume-up"/>
                </span>
			</div>
		</li>
	);
}

Playlist.propTypes = {
	trackDuration: PropTypes.string.isRequired,
	trackName: PropTypes.string.isRequired,
	trackNumber: PropTypes.number.isRequired,
	onClick: PropTypes.func.isRequired,
	path: PropTypes.string.isRequired,
};

export default Playlist;
