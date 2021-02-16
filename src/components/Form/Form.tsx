import {
  IonButton,
  IonCard,
  IonCardTitle,
  IonCardContent,
  IonCol,
  IonGrid,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonSelect,
  IonSelectOption,
  IonText,
  IonTabs,
  IonTab,
  IonTabBar,
  IonTabButton,
  IonRouterOutlet,
  IonCardHeader,
} from '@ionic/react'
import { connect } from 'react-redux'
import './Form.scss'
import { updateReading } from '../../state/actions/scoreboard.action'
import {
  updateRecordDraft,
  deleteRecordDraft,
} from '../../state/actions/record.action'
import {
  addOutline,
  checkmark,
  closeCircleOutline,
  home,
  homeOutline,
  listOutline,
  searchOutline,
  speedometerOutline,
} from 'ionicons/icons'
import { PLATE_CODES, PLATE_REGIONS } from '../../model/vehicle.model'
import { useMutation } from '@apollo/client'
import { CREATE_RECORD } from '../../gql/Queries'
import RecordList from '../Record/RecordList'

const Form = (props: any) => {
  const [runCreateRecord, { data }] = useMutation(CREATE_RECORD)

  const onPlateNumberChange = (ev: any) => {
    const plate = ev.detail?.value
      .split(/[^a-zA-Z0-9]/)
      .join('')
      .trim()
      .toUpperCase()

    ev.target.value = plate

    props.updateRecordDraft({
      ...props.draft,
      licensePlate: {
        ...props.draft?.licensePlate,
        plate,
      },
    })
  }

  const onPlateCodeChange = (ev: any) => {
    const code = ev.detail?.value
    props.updateRecordDraft({
      ...props.draft,
      licensePlate: {
        ...props.draft?.licensePlate,
        code,
      },
    })
  }

  const onPlateRegionChange = (ev: any) => {
    const region = ev.detail?.value
    props.updateRecordDraft({
      ...props.draft,
      licensePlate: {
        ...props.draft?.licensePlate,
        region,
      },
    })
  }

  const capture = () => {
    props.updateRecordDraft({
      ...props.draft,
      reading: props.reading,
      licensePlate: {
        plate: props.draft?.licensePlate?.plate || '',
        code: props.draft?.licensePlate?.code || 3,
        region: props.draft?.licensePlate?.region || 'AA',
      },
    })
  }

  const createRecord = () => {
    const draft = props.draft
    if (draft && draft.reading?.weight && draft.licensePlate?.plate) {
      console.log(draft)

      runCreateRecord({
        variables: {
          weight: draft.reading.weight,
          createdAt: draft.reading.receivedAt.toString(),
          plateNumber: draft.licensePlate.plate,
          plateCode: draft.licensePlate.code,
          plateRegion: draft.licensePlate.region,
        },
      })
    } else {
      console.error('whoopsie')
    }
  }

  const deleteDraft = () => {
    props.deleteRecordDraft()
  }

  return (
    <>
      <IonCard>
        {props.draft ? (
          <>
            <IonList>
              <IonItem>
                <IonButton
                  onClick={capture}
                  shape="round"
                  fill="clear"
                  size="small"
                >
                  <IonIcon slot="start" icon={speedometerOutline}></IonIcon>
                  Capture Again
                </IonButton>

                <IonButton
                  onClick={deleteDraft}
                  shape="round"
                  fill="clear"
                  color="danger"
                  size="small"
                >
                  <IonIcon slot="start" icon={closeCircleOutline}></IonIcon>
                  Delete
                </IonButton>
              </IonItem>

              <IonCard className="current-weight-card">
                <IonCardTitle>Current Weight:&nbsp;</IonCardTitle>
                <IonCardContent>
                  <h1>{props.draft.reading.weight} KG</h1>
                </IonCardContent>
              </IonCard>
            </IonList>
          </>
        ) : (
          /* IF NO CAPTURED WEIGHT */

          <IonList>
            <IonItem>
              <IonButton
                className="full-button"
                color="primary"
                size="large"
                shape="round"
                fill="solid"
                expand="block"
                onClick={capture}
              >
                <IonIcon slot="start" icon={speedometerOutline}></IonIcon>
                Capture Weight
              </IonButton>
            </IonItem>
          </IonList>
        )}
      </IonCard>
      {props.draft ? (
        <IonCard>
          <IonList lines="inset">
            {false ? (
              <IonItem>
                <IonLabel>
                  Record ID: &nbsp;
                  <IonText>00001</IonText>
                  &nbsp;
                </IonLabel>
              </IonItem>
            ) : (
              ''
            )}
            <IonItem>
              <IonLabel>Licence Plate:</IonLabel>

              <IonInput
                onIonChange={onPlateNumberChange}
                maxlength={6}
                size={6}
                required
                autofocus
                pattern="/[a-zA-Z0-9]/"
                placeholder="Enter Licence Plate"
                clearInput
                className="uppercase align-right"
              />

              <IonSelect
                onIonChange={onPlateCodeChange}
                value={
                  typeof props.draft?.licensePlate?.code === 'number'
                    ? props.draft.licensePlate.code
                    : 3
                }
                interface="popover"
              >
                {PLATE_CODES.map((code, index) => (
                  <IonSelectOption value={index}>
                    {typeof code === 'number' ? `CODE 0${code}` : code}
                  </IonSelectOption>
                ))}
              </IonSelect>

              <IonSelect
                id="plate-region-select"
                onIonChange={onPlateRegionChange}
                value={props.draft?.licensePlate?.region || 'AA'}
                interface="action-sheet"
              >
                {PLATE_REGIONS.map((region) => (
                  <IonSelectOption value={region.code}>
                    {region.code !== 'OTHER' ? `[${region.code}] ` : ''}
                    {region.name}
                  </IonSelectOption>
                ))}
              </IonSelect>
            </IonItem>

            {false ? (
              <IonItem>
                <IonLabel>Driver:</IonLabel>
                <IonInput
                  className="uppercase"
                  placeholder="Enter Driver's Name"
                />
              </IonItem>
            ) : (
              ''
            )}

            <IonItem>
              <IonGrid className="align-right">
                <IonCol>
                  <IonButton
                    color="success"
                    shape="round"
                    onClick={createRecord}
                    disabled={!(props.draft?.licensePlate?.plate?.length >= 5)}
                  >
                    <IonIcon icon={checkmark} />
                    Save Record
                  </IonButton>
                </IonCol>
              </IonGrid>
            </IonItem>
          </IonList>
        </IonCard>
      ) : (
        ''
      )}

      <RecordList></RecordList>
    </>
  )
}

const mapStateToProps = (state: any) => {
  return {
    reading: state.scoreboard.reading,
    draft: state.record.recordDraft,
  }
}

export default connect(mapStateToProps, {
  updateReading,
  updateRecordDraft,
  deleteRecordDraft,
})(Form)
