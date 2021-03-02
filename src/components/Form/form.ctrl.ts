// import { connect } from 'react-redux'
// import './Form.scss'
// import { updateReading } from '../../state/actions/scoreboard.action'
// import {
//   updateRecordDraft,
//   deleteRecordDraft,
//   updateRecordResult,
// } from '../../state/actions/record.action'
// import { VEHICLE_TYPES } from '../../model/vehicle.model'
// import { useMutation, useQuery } from '@apollo/client'
// import { FETCH_RECORD, FETCH_RECORDS } from '../../gql/queries/record.queries'
// import $ from 'jquery'
// import { CREATE_RECORD } from '../../gql/mutations/record.mutations'

// const Form = (props: any) => {
//   const [runCreateRecord] = useMutation(CREATE_RECORD)
//   const recordQuery = useQuery(FETCH_RECORD, {
//     variables: {
//       id: props.result,
//     },
//     skip: !props.result,
//   })

//   const selectedVehicleRecords = useQuery(FETCH_RECORDS, {
//     variables: {
//       vehicleId: props.draft?.vehicleId,
//     },
//   })

//   // VEHICLE_TYPES

//   const clearForm = () => {
//     props.deleteRecordDraft()
//     props.updateRecordResult(undefined)
//   }

//   const clearSelectedVehicle = () => {
//     props.updateRecordDraft({
//       ...props.draft,
//       vehicleId: undefined,
//       vehicle: undefined,
//     })
//   }

//   const recordReading = () => {
//     if (props.reading) {
//       props.updateRecordDraft({
//         ...props.draft,
//         reading: props.reading,
//         licensePlate: {
//           plate: props.draft?.licensePlate?.plate || '',
//           code: props.draft?.licensePlate?.code || 3,
//           region: props.draft?.licensePlate?.region || 'AA',
//         },
//       })

//       setTimeout(() => {
//         const input = $('#license-plate-input').find('input').first()
//         input.focus()
//         input.val = props.draft?.licensePlate?.plate
//       }, 200)
//     }
//   }

//   const createRecord = () => {
//     const draft = props.draft
//     selectedVehicleRecords.refetch()

//     if (draft && draft.reading?.weight && draft.licensePlate?.plate) {
//       console.log(draft)

//       runCreateRecord({
//         variables: {
//           weight: draft.reading.weight,
//           vehicleId: draft.vehicleId,
//         },
//       }).then((record) => {
//         console.log('record', record)
//         props.updateRecordResult(record.data.createRecord)
//         if (props.result) {
//           recordQuery.refetch()
//           selectedVehicleRecords.refetch()
//         }
//       })
//     } else {
//       alert('Record information incomplete')
//     }
//   }

//   const getVehicleType = (type: number) => {
//     return VEHICLE_TYPES[type] || 'UNKNOWN'
//   }
// }

// const mapStateToProps = (state: any) => {
//   return {
//     reading: state.scoreboard.reading,
//     draft: state.record.recordDraft,
//     result: state.record.recordResult,
//   }
// }

// // export default connect(mapStateToProps, {
// //   updateReading,
// //   updateRecordDraft,
// //   updateRecordResult,
// //   deleteRecordDraft,
// // })()

const abc = ''
export default abc
