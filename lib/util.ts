/**
 * Encodes latitude and longitude into a base64 string.
 *
 * The encoding uses 16 bytes: 8 for latitude and 8 for longitude.
 * The output is URL-safe, replacing '+' with '-', '/' with '_', and removing padding.
 *
 * @param lat
 * @param lng
 * @returns A base64 encoded string representing the latitude and longitude.
 */
export function encodeLatLng(lat: number, lng: number): string {
	const buffer = new ArrayBuffer(16);
	const view = new DataView(buffer);

	view.setFloat64(0, lat); // 8 bytes for latitude
	view.setFloat64(8, lng); // 8 bytes for longitude

	// Convert buffer to base64
	let binary = "";
	for (let i = 0; i < 16; i++) {
		binary += String.fromCharCode(view.getUint8(i));
	}

	// Standard base64, then make it URL-safe
	return btoa(binary)
		.replace(/\+/g, "-")
		.replace(/\//g, "_")
		.replace(/=+$/, ""); // Remove padding
}

/**
 * Decodes a base64 encoded string representing latitude and longitude.
 * The input should be URL-safe, with '-' replacing '+', '_' replacing '/', and no padding.
 *
 * @param encoded - A base64 encoded string representing latitude and longitude.
 * @returns A tuple containing the latitude and longitude as numbers.
 */
export function decodeLatLng(encoded: string): [number, number] {
	// Restore padding
	const padded = encoded + "===".slice((encoded.length + 3) % 4);

	// Make base64 from URL-safe
	const base64 = padded.replace(/-/g, "+").replace(/_/g, "/");

	const binary = atob(base64);
	const buffer = new ArrayBuffer(16);
	const view = new DataView(buffer);

	for (let i = 0; i < 16; i++) {
		view.setUint8(i, binary.charCodeAt(i));
	}

	const lat = view.getFloat64(0);
	const lon = view.getFloat64(8);
	return [lat, lon];
}
