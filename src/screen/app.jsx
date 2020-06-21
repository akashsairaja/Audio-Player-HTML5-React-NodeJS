import React from 'react';

import Playlist from '../components';

import { millisToMins } from '../utils';


const endPoint = 'http://localhost:4000';
const streamUrl = endPoint.concat('/api/streaming?path=');
const trackUrl = endPoint.concat('/api/tracks');

const MyMusicPlayer = () => {

	const [tracks, setTracks] = React.useState([]);

	const player = React.useRef(null);
	const playerSlider = React.useRef(null);

	React.useEffect(() => {
		async function fetchTracks() {
			const config = {
				method: 'GET',
				'async': true,
				'crossDomain': true,
			};
			const { tracks } = await window.fetch(trackUrl, config)
				.then((response => response.json()));
			setTracks(tracks);
		}
		fetchTracks();
	}, []);

	let interval = null;

	const playerTrackStatus = {
		currentRange: 0,
		paused: false,
		currentTrack: 0,
	};

	const updateActiveList = (trackNumber) => {
		const lists = document.querySelectorAll('li');
		lists.forEach((list) => {
			list.classList.remove('active');
		});
		const list = document.getElementById(`trackNumber-${trackNumber + 1}`);
		list.classList.add('active');
	};

	const updateSongControl = () => {
		const playIcon = document.getElementById('btnPlay');
		const { current } = playerSlider;
		const { currentTime, duration } = player.current;
		document.getElementById('trackCurrentTime').innerHTML = millisToMins(currentTime);
		if (Math.floor(currentTime) === Math.floor(duration)) {
			document.getElementById('npAction').innerText = 'paused';
			playIcon.classList.remove('fa-pause');
			playIcon.classList.add('fa-play');
			clearInterval(interval);
			// eslint-disable-next-line no-use-before-define
			playSong(playerTrackStatus.currentTrack + 2);
		}
		playerTrackStatus.currentRange = currentTime;
		const trackStatus = document.getElementById('trackStatus');
		trackStatus.innerText = `${millisToMins(currentTime)}  / ${millisToMins(duration)}`;
		current.value = currentTime;
	};

	const playing = (trackNumber = 0, canPlay = false, playNext = false) => {
		updateActiveList(trackNumber);
		playerTrackStatus.currentTrack = trackNumber;
		playerSlider.current.classList.remove('form-control');
		const { name, path } = tracks[trackNumber];
		const targetUrl = streamUrl + path;
		const { current } = player;
		const playerStatus = document.getElementById('npAction');
		const playIcon = document.getElementById('btnPlay');
		const npTitle = document.getElementById('npTitle');
		if (playerStatus.textContent.includes('playing') && !canPlay) {
			console.log('stop playing');
			playIcon.classList.remove('fa-pause');
			playIcon.classList.add('fa-play');
			current.pause();
			playerStatus.innerText = 'paused';
			playerSlider.current.value = playerTrackStatus.currentRange;
			playerTrackStatus.paused = true;
		} else {
			if (!playerTrackStatus.paused || playNext) {
				current.src = targetUrl;
				npTitle.innerText = name;
				current.crossOrigin = 'anonymous';
			}
			playerStatus.innerText = 'Now playing - '.concat(name);
			playIcon.classList.remove('fa-play');
			playIcon.classList.add('fa-pause');
			console.log('start playing');
			current.play();
			setTimeout(() => {
				if (!Number.isNaN(current.duration)) {
					playerSlider.current.max = Math.floor(current.duration);
				}
			}, 1000);
			interval = setInterval(updateSongControl, 100);
		}
	};

	const hdlerVolumeControl = ({ target: { value } }) => {
		const { current } = player;
		const volumeControl = document.getElementById('volumeControl');
		if (volumeControl.classList.contains('fa-volume-down') && +value === 0) {
			volumeControl.classList.remove('fa-volume-down');
			volumeControl.classList.add('fa-volume-off');
		} else if (volumeControl.classList.contains('fa-volume-off')) {
			volumeControl.classList.remove('fa-volume-off');
			volumeControl.classList.add('fa-volume-down');
		}
		current.volume = value;
	};

	const hdlerSongControl = ({ target: { value } }) => {
		const { current } = player;
		playerTrackStatus.currentRange = value;
		current.currentTime = value;
	};

	const playFromBeginning = () => {
		const { current } = player;
		current.currentTime = 0;
	};

	const playSong = (trackNumber) => {
		if (trackNumber === 1 || trackNumber === 0) trackNumber = 1;
		playing(trackNumber - 1, true, true);
	};

	return (
		<div className="container-fluid musicPlayer">
			<div className="mb-2">
				<div className="container">
					<div className="row">
						<div className="col-lg-12">
							<div id="nowPlay">
                                <span id="npAction" className="pull-left">
                                    Player is Ready ...
                                </span>
								<span id="npTitle" className="pull-right nowPlaying__title"/>
							</div>
						</div>
						<div className="col-lg-12 justify-content-end overflow-hidden">
							<div className="d-flex float-right pull-right pb-2">
								<span id="volumeControl" className="fa fa-volume-down mt-1 mx-2"/>
								<input
									min={0}
									max={1}
									step={0.1}
									defaultValue={0.3}
									onChange={(e) => hdlerVolumeControl(e)}
									type="range"
									className="cursor-pointer"
								/>
								<span className="fa fa-volume-up mt-1 mx-2"/>
							</div>
						</div>
						<div className="col-lg-12 overflow-hidden">
							<div className="m-auto">
								<div>
									<div className="d-flex">
										<input
											type="range"
											className="cursor-pointer w-100"
											ref={playerSlider}
											onChange={(e) => hdlerSongControl(e)}
											min={0}
											value={0}
										/>
									</div>
									<p className="pull-left" id="trackCurrentTime">
										O:OO
									</p>
									<p className="float-right" id="trackStatus">
										0:00 / 0:00
									</p>
								</div>
								<div id="tracks" className="my-4">
									<button
										type="button"
										id="btnNext"
										aria-label="repeat"
										onClick={() => playFromBeginning()}
										className="fa fa-repeat cursor-pointer"
									/>
									<button
										type="button"
										id="btnPrev"
										aria-label="backward"
										className="fa fa-backward"
										onClick={() => playSong(playerTrackStatus.currentTrack)}
									/>
									<button
										type="button"
										id="btnPlay"
										aria-label="play"
										className="fa fa-play"
										onClick={() => playing()}
									/>
									<button
										type="button"
										id="btnNext"
										aria-label="forward"
										className="fa fa-forward"
										onClick={() => playSong(playerTrackStatus.currentTrack + 2)}
									/>
									<button
										type="button"
										id="btnRandom"
										className="fa fa-random"
										aria-label="random"
										onClick={() =>
											playSong(Math.floor(Math.random() * tracks.length))
										}
									/>
								</div>
							</div>
							<audio controls="controls" autoPlay ref={player}/>
						</div>
					</div>
					<div className="m-auto playlist__wrap">
						<ul id="playlist__List">
							{tracks.map(({ duration, track, name, path }) => (
								<Playlist
									key={track}
									trackDuration={duration}
									trackName={name}
									trackNumber={track}
									onClick={playSong}
									path={path}
								/>
							))}
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
};

export default MyMusicPlayer;
