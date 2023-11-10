import { useState, useEffect, useRef } from 'react'
import { BsCameraVideo, BsPhone } from 'react-icons/bs'
import { FiPhoneOff } from 'react-icons/fi'

/*
 функция принимает следующее:
 - удаленный медиа поток
 - локальный медиа поток
 - настройки для захвата медиапотока
 - интерфейс для работы с потоком
 - метод для завершения звонка
*/
export const CallWindow = ({
 remoteSrc,
 localSrc,
 config,
 mediaDevice,
 finishCall
}) => {
    const remoteVideo = useRef()
    const localVideo = useRef()
    const localVideoSize = useRef()
    // настройки могут иметь значение `null`,
    // поэтому мы используем здесь оператор опциональной последовательности `?.`
    const [video, setVideo] = useState(config?.video)
    const [audio, setAudio] = useState(config?.audio)

    const [dragging, setDragging] = useState(false)
const [coords, setCoords] = useState({
 x: 0,
 y: 0
})

useEffect(() => {
    const { width, height } = localVideo.current.getBoundingClientRect()
    localVideoSize.current = { width, height }
   }, [])

   useEffect(() => {
    dragging
      ? localVideo.current.classList.add('dragging')
      : localVideo.current.classList.remove('dragging')
   }, [dragging])

   const onMouseMove = (e) => {
    // если элемент находится в состоянии перетаскивания
    if (dragging) {
      // это позволяет добиться того,
      // что центр перетаскиваемого элемента всегда будет следовать за курсором
      setCoords({
        x: e.clientX - localVideoSize.current.width / 2,
        y: e.clientY - localVideoSize.current.height / 2
      })
    }
   }

   useEffect(() => {
    window.addEventListener('mousemove', onMouseMove)
   
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
    }
   })

   useEffect(() => {
    // удаленный поток
    if (remoteVideo.current && remoteSrc) {
      remoteVideo.current.srcObject = remoteSrc
    }
    // локальный поток
    if (localVideo.current && localSrc) {
      localVideo.current.srcObject = localSrc
    }
   }, [remoteSrc, localSrc])

   useEffect(() => {
    if (mediaDevice) {
      // переключаем видеотреки
      mediaDevice.toggle('Video', video)
      // переключаем аудиотреки
      mediaDevice.toggle('Audio', audio)
    }
   }, [mediaDevice])

   const toggleMediaDevice = (deviceType) => {
    // видео
    if (deviceType === 'video') {
      setVideo(!video)
      mediaDevice.toggle('Video')
    }
    // аудио
    if (deviceType === 'audio') {
      setAudio(!audio)
      mediaDevice.toggle('Audio')
    }
   }

   return (
    <div className='call-window'>
      <div className='inner'>
        <div className='video'>
          {/* элемент для удаленного видеопотока */}
          <video className='remote' ref={remoteVideo} autoPlay />
          {/*
            элемент для локального видеопотока
            обратите внимание на атрибут `muted`,
            без него мы будем слышать сами себя,
            что сделает коммуникацию затруднительной
          */}
          <video
            className='local'
            ref={localVideo}
            autoPlay
            muted
            onClick={() => setDragging(!dragging)}
            style={{
              top: `${coords.y}px`,
              left: `${coords.x}px`
            }}
          />
        </div>
        <div className='control'>
          {/* кнопка для переключения видео */}
          <button
            className={video ? '' : 'reject'}
            onClick={() => toggleMediaDevice('video')}
          >
            <BsCameraVideo />
          </button>
          {/* кнопка для переключения аудио */}
          <button
            className={audio ? '' : 'reject'}
            onClick={() => toggleMediaDevice('audio')}
          >
            <BsPhone />
          </button>
          {/* кнопка для завершения звонка */}
          <button className='reject' onClick={() => finishCall(true)}>
            <FiPhoneOff />
          </button>
        </div>
      </div>
    </div>
   )
}