import classNames from 'classnames'
import './LicensePlate.scss'

const LicensePlate = (props: any) => {
  return (
    <div className={classNames('licensePlate', `code-${props.code}`)}>
      <div className="licensePlateInner">
        <span className="licensePlateCode">{props.code}</span>
        <span className="licensePlateNumber">{props.number.replace('?', '')}</span>
        <span className="licensePlateRegion">
          {props.region?.code?.slice(0, 2)}
        </span>
      </div>
    </div>
  )
}

export default LicensePlate
