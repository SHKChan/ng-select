// 1. 'Math.random() * 16' generates a random float between 0 and 16
// 2. '| 0' is a bitwise OR that converts the float to an integer
// 3. Effectively creates a random integer between 0 and 15
// 4. Conversion to Hexadecimal
// Return id like 'a7f3b2d1e5c9a'
export function newId() {
	// First character is an 'a', it's good practice to tag id to begin with a letter
	return 'axxxxxxxxxxx'.replace(/[x]/g, () => {
		// eslint-disable-next-line no-bitwise
		const val = (Math.random() * 16) | 0;
		return val.toString(16);
	});
}
