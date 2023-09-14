import { ReactElement } from 'react'
import style from './style.module.scss'
import React from 'react'

type Props = React.ComponentProps<'div'> 

const Card = ({children}: Props) => {
  return <div className={style.cardWrap}>

    {children}
  </div>
}

export default Card