export function toTitleCase (str: string) {
	let transformed = str[0].toUpperCase();
	transformed += str.slice(1).toLowerCase();
	return transformed;
}

export function promiseTimeout<T> (msDelay: number, promise: Promise<T>) {
	// promise that rejects in <ms> milliseconds
	const timeout = new Promise<T>((resolve, reject) => {
		const id = setTimeout(() => {
			clearTimeout(id);
			reject(`Timed out in ${msDelay} ms`);
		}, msDelay);
	});

	return Promise.race([promise, timeout]);
}

export function removeWhitespace (str: string) {
	return str.replace(/\s+/g, "");
}
