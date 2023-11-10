import { BsCameraVideo, BsPhone } from 'react-icons/bs'
import { FiPhoneOff } from 'react-icons/fi'

// функция принимает `id` звонящего и методы для принятия звонка и его отклонения
export const CallModal = ({ callFrom, startCall, rejectCall }) => {
// звонок может приниматься с видео и без
const acceptWithVideo = (video) => {
    const config = { audio: true, video }
    // инициализация `PeerConnection`
    startCall(false, callFrom, config)
   }

   return (
    <div className='call-modal'>
      <div className='inner'>
        <p>{`${callFrom} is calling`}</p>
        <div className='control'>
          {/* принимаем звонок с видео */}
          <button onClick={() => acceptWithVideo(true)}>
            <BsCameraVideo />
          </button>
          {/* принимаем звонок без видео */}
          <button onClick={() => acceptWithVideo(false)}>
            <BsPhone />
          </button>
          {/* отклоняем звонок */}
          <button onClick={rejectCall} className='reject'>
            <FiPhoneOff />
          </button>
        </div>
      </div>
    </div>
   )
}