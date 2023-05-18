
export const getPrice = (type: number) => {
	switch (type) {
		case 0:
			return 100 // pickup
		case 1:
			return 150 // light truck
		case 2:
			return 200 // midium truck
		case 3:
			return 250 // heavy truck
		case 4:
			return 350 // heavy truck + trailer
		default:
			return 0
	}
}