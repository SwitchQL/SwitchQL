function toTitleCase (str) {
	let transformed = str[0].toUpperCase();
	transformed += str.slice(1).toLowerCase();
	return transformed;
}

function promiseTimeout (msDelay, promise) {
	// promise that rejects in <ms> milliseconds
	const timeout = new Promise((resolve, reject) => {
		const id = setTimeout(() => {
			clearTimeout(id);
			reject(`Timed out in ${msDelay} ms`);
		}, msDelay);
	});

	return Promise.race([promise, timeout]);
}

function removeWhitespace (str) {
	return str.replace(/\s+/g, "");
}

module.exports = {
	toTitleCase,
	removeWhitespace,
	promiseTimeout,
};
