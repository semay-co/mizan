const Dot = () => {
	return <span></span>
}

const DotMatrix = () => {
	const rows = new Array(7).fill(0)
	const cols = new Array(7).fill(0)

	return (
		<div>
			{
				rows.map((row: number) => 
					cols.map((col: number) => <Dot/>)
				)	
			}
		</div>
	)
}

export default DotMatrix