
export const getPrice = (type: number) => {
	switch (type) {
		case 0:
			return 80 // pickup
		case 1:
			return 100 // light truck
		case 2:
			return 150 // midium truck
		case 3:
			return 200 // heavy truck
		case 4:
			return 250 // heavy truck + trailer
		default:
			return 0
	}
}