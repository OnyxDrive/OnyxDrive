//TODO: diisplay in 1000s
export function convertBytesToMBorGB(bytes: number) {
	const kb = bytes / 1024
	const mb = kb / 1024
	const gb = mb / 1024

	let unit
	let value

	if (gb >= 1) {
		unit = 'GB'
		value = gb.toFixed(2)
	} else {
		unit = 'MB'
		value = mb.toFixed(2)
	}

	return { unit, value }
}
