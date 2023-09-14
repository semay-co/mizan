import { useEffect, useState } from 'react'
import style from './style.module.scss'
import { set } from 'ramda'

const chars = 'abcdefghijklmnopqrstuvwxyz0123456789.- '
const charsArr = chars.split('')

type Char = typeof charsArr[number]

const charMap = [

   `
    -***-
    *---*
    *---*
    *****
    *---*
    *---*
    *---*
  `,
   `
    ****-
    *---*
    *---*
    ****-
    *---*
    *---*
    ****-
  `,
   `
    -***-
    *---*
    *----
    *----
    *----
    *---*
    -***-
  `,
   `
    ****-
    *---*
    *---*
    *---* 
    *---*
    *---*
    ****-
  `,
   `
    *****
    *----
    *----
    ****-
    *----
    *----
    *****
  `,
   `
    *****
    *----
    *----
    ****-
    *----
    *----
    *----
  `,
   `
    -----
    -----
    -***-
    *----
    *-***
    *---*
    -***-
  `, 
   `
    *---*
    *---*
    *---*
    *****
    *---*
    *---*
    *---*
  `,
   `
    -***-
    --*--
    --*--
    --*--
    --*--
    --*--
    -***-
  `,
   `
    --***
    ---*-
    ---*-
    ---*-
    *--*-
    *--*-
    -**--
  `,
   `
    -----
    -----
    **--*
    -*-*-
    -**--
    -*-*-
    -*--*
  `,
   `
    *----
    *----
    *----
    *----
    *----
    *----
    *****
  `,
   `
    *---*
    **-**
    *-*-*
    *---*
    *---*
    *---*
    *---*
  `,
   `
    *---*
    *---*
    **--*
    *-*-*
    *--**
    *---*
    *---*
  `,
   `
    -***-
    *---*
    *---*
    *---*
    *---*
    *---*
    -***-
  `,
   `
    ****-
    *---*
    *---*
    ****-
    *----
    *----
    *----
  `,
   `
    -***-
    *---*
    *---*
    *---*
    *-*-*
     ***
    ----*
  `,
   `
    ****-
    *---*
    *---*
    ****-
    *--*-
    *---*
    *---*
  `,
   `
    -***-
    *---*
    *----
    -***-
    ----*
    *---*
    -***-
  `,
   `
    *****
    --*--
    --*--
    --*--
    --*--
    --*--
    --*--
  `,
   ` 
    *---*
    *---*
    *---*
    *---*
    *---*
    *---*
    -***-
  `,
   `
    *---*
    *---*
    *---*
    *---*
    *---*
    -*-*-
    --*--
  `,
   `
    *---*
    *---*
    *---*
    *-*-*
    *-*-*
    *-*-*
    -*-*-
  `,
   `
    *---*
    *---*
    -*-*-
    --*--
    -*-*-
    *---*
    *---*
  `,
   `
    *---*
    *---*
    *---*
    -*-*-
    --*--
    --*--
    --*--
  `,
   `
    *****
    ----*
    ---*-
    --*--
    -*---
    *----
    *****
  `,
   `
    -***-
    *---*
    *---*
    *-*-*
    *---*
    *---*
    -***-
  `,
   `
    --*--
    ***--
    --*--
    --*--
    --*--
    --*--
    *****
  `,
   `
    -***- 
    ----*
    ----*
    -***-
    *----
    *----
    *****
  `,
   `
    ****-
    ----*
    ----*
    --**-
    ----*
    ----*
    ****-
  `,
   `
    *----
    *---*
    *---*
    -****
    ----*
    ----*
    ----*
  `,
   `
    ****-
    *----
    *----
    ****-
    ----*
    ----*
    -***-
  `,
   `
    -***-
    *----
    *----
    ****-
    *---*
    *---*
    -***-
  `,
   `
    *****
    ----*
    ----*
    ---*-
    --*--
    --*--
    --*--
  `,
   `
    -***-
    *---*
    *---*
    -***-
    *---*
    *---*
    -***-
  `,
   `
    -***-
    *---*
    *---*
    -****
    ----*
    ----*
    -***-
  `,
   `
    -----
    -----
    -----
    *****
    -----
    -----
    -----
  `,
   `
    -----
    -----
    -----
    -----
    -----
    --**-
    --**-
  `,
   `
    -----
    -----
    -----
    -----
    -----
    -----
    -----
  `,
  
]

type Props = {
  char: string,
  size?: number
  color?: string
  backgroundFill?: string
}


const DotMatrixChar = ({char, size = 1000, color = '#33ff88', backgroundFill}: Props) => {

  // if char has changed in the last 3 seconds, change the color to red, else keep it green

  const startBlockSize = size / 7
  const startDotSize = startBlockSize * .5
  const startEmptySize = startBlockSize * .0

  const [updateColor, setUpdateColor] = useState('#33ff88')
  const [blockSize, setBlockSize] = useState(startBlockSize)
  const [dotSize, setDotSize] = useState(startDotSize)
  const [emptySize, setEmptySize] = useState(startEmptySize)

  useEffect(() => {
    setUpdateColor('#ffff00')
    setDotSize(startDotSize)
    setEmptySize(backgroundFill ? blockSize *.6 : blockSize * .0)

    const timeout = setTimeout(() => {
      setUpdateColor(color)
      setDotSize(blockSize *.8)
    setEmptySize(backgroundFill ? blockSize *.6 : blockSize * .0)
    }, 2000)
    return () => clearTimeout(timeout)
  }, [char, size, backgroundFill, color])


  const charIndex = chars.indexOf(char)

  const charVis = charMap[charIndex] || charMap[charsArr.indexOf(' ')]
  const charMatrix = charVis.split('\n').map((line: any) => line.split('').filter((char: any) => ['-', '*'].includes(char)).map((char: any) => char === '*' ? 1 : 0)).filter((line) => line.length).map((line) => [0, ...line, 0] )

  // const blockSize = size / 7
  // const dotSize = blockSize *.8


  return <span style={{display: 'grid', justifyContent: 'start'}}>
    {
      charMatrix.map((line: any, l) => <div style={{ display: 'grid',  gridTemplateColumns: 'repeat(7, 1fr)'}} className="dot-matrix-line">
        {
          line.map((dot: any, x: number) => <span style={{
            width: blockSize,
            height: blockSize,
            display: 'grid',
            alignItems: 'center',
            justifyItems: 'center',
          }}><span className={ `${style.dot} ${ dot === 0 ? 'emptyDot' : 'fullDot' }`} style={{
            width: dot === 1 ? dotSize : emptySize,
            height: dot === 1 ? dotSize : emptySize,
          borderRadius: size/2,
            backgroundColor: dot === 1 ? updateColor : backgroundFill ? backgroundFill : updateColor,
            alignSelf: 'center',
            justifySelf: 'center',
            transition: `${(() => {const r = Math.random()+.1; return r*(l+1)/.8*(1/(x+1)*2)})()}s` 
          }}></span></span>)
        }
      </div>)

    }
  </span>

}

export default DotMatrixChar
