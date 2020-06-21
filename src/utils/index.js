/*
* param milli seconds
* */
const millisToMins = (seconds) => {
	const numminutes = Math.floor((((seconds % 31536000) % 86400) % 3600) / 60);
	const numseconds = (((seconds % 31536000) % 86400) % 3600) % 60;
	if (numseconds >= 10) {
		return `${numminutes}:${Math.round(numseconds)}`;
	}
	return `${numminutes}:0${Math.round(numseconds)}`;
};

export { millisToMins };
