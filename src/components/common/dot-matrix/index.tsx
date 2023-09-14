import DotMatrixChar from '../dot-matrix-char'

type Props = {
  color?: string,
  size?: number,
  text: string,
  backgroundFill?: string
}

const DotMatrix = ({ color, size = 100, text, backgroundFill}: Props) => {
  return <span style={{
    display: 'grid',
    gridAutoFlow: 'column',
  }}>{
  text.split('').map((c, i) => <DotMatrixChar key={i} color={color} backgroundFill={backgroundFill} size={size} char={c} /> )
}</span>
}


export default DotMatrix