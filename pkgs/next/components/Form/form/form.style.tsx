import styled from 'styled-components'
import { transparentize } from 'polished'

const Styled = styled.div`
	.capture-button {
		background: ${({theme}) => theme.colors?.brand?.blue};
		text-transform: uppercase;
		font-size: 4rem;
		text-align: center;
		padding: 2rem 1rem;
		letter-spacing: .5rem;
		color: ${({theme}) => transparentize(.3, theme.colors.dark)}
	}
`

export default Styled