import './styles/app.scss'

import { useState, useEffect } from 'react'
import { BsPhoneVibrate } from 'react-icons/bs'

import PeerConnection from './utils/PeerConnection'
import socket from './utils/socket'

import { MainWindow, CallWindow, CallModal } from './components'

export default function App() {
  const [callFrom, setCallFrom] = useState('')
  const [calling, setCalling] = useState(false)
  
  const [showModal, setShowModal] = useState(false)
  
  const [localSrc, setLocalSrc] = useState(null)
  const [remoteSrc, setRemoteSrc] = useState(null)
  
  const [pc, setPc] = useState(null)
  const [config, setConfig] = useState(null)

  useEffect(() => {
    socket.on('request', ({ from }) => {
      // записываем `id` звонящего
      setCallFrom(from)
      // показываем модальное окно
      setShowModal(true)
    })
   }, [])

   // регистрация обработчиков осуществляется только после создания
// экземпляра `PeerConnection` - это является критически важным
useEffect(() => {
  if (!pc) return
 
  socket
    // обработка подготовки к подключению
    // данные могут содержать предложение, ответ и кандидата ICE (в том числе, в виде пустой строки - нулевой кандидат)
    .on('call', (data) => {
      // если данные содержат описание
      if (data.sdp) {
        pc.setRemoteDescription(data.sdp)
 
        // если данные содержат предложение
        if (data.sdp.type === 'offer') {
          // генерируем ответ
          pc.createAnswer()
        }
      } else {
        // добавляем кандидата
        pc.addIceCandidate(data.candidate)
      }
    })
    // обработка завершения звонка
    .on('end', () => finishCall(false))
 }, [pc])

 /*
 функция принимает 3 параметра:
 - является ли пользователь инициатором звонка
 - `id` адресата
 - настройки для медиа
*/
const startCall = (isCaller, remoteId, config) => {
  // скрываем модельное окно - для случая, когда мы принимаем звонок
  setShowModal(false)
  // отображаем индикатор подключения
  setCalling(true)
  // сохраняем настройки
  setConfig(config)
 
  // создаем экземпляр `PeerConnection`,
  // передавая ему `id` адресата
  const _pc = new PeerConnection(remoteId)
    // обработка получения локального потока
    .on('localStream', (stream) => {
      setLocalSrc(stream)
    })
    // обработка получения удаленного потока
    .on('remoteStream', (stream) => {
      setRemoteSrc(stream)
      // скрываем индикатор установки соединения
      setCalling(false)
    })
    // запускаем `PeerConnection`
    .start(isCaller, config)
 
  // записываем экземпляр `PeerConnection`
  // это приводит к регистрации обработчиков
  // подготовки к звонку и его завершения
  setPc(_pc)
 }
 const rejectCall = () => {
  socket.emit('end', { to: callFrom })
 
  setShowModal(false)
 }

 const finishCall = (isCaller) => {
  // выполняем перезагрузку `WebRTC`
  pc.stop(isCaller)
 
  // обнуляем состояния
  setPc(null)
  setConfig(null)
 
  setCalling(false)
  setShowModal(false)
 
  setLocalSrc(null)
  setRemoteSrc(null)
 }

 return (
  <div className='app'>
    <h1>React WebRTC</h1>
    {/* начальный экран */}
    <MainWindow startCall={startCall} />
    {/* индикатор подключения */}
    {calling && (
      <div className='calling'>
        <button disabled>
          <BsPhoneVibrate />
        </button>
      </div>
    )}
    {/* модальное окно */}
    {showModal && (
      <CallModal
        callFrom={callFrom}
        startCall={startCall}
        rejectCall={rejectCall}
      />
    )}
    {/* экран коммуникации */}
    {remoteSrc && (
      <CallWindow
        localSrc={localSrc}
        remoteSrc={remoteSrc}
        config={config}
        mediaDevice={pc?.mediaDevice}
        finishCall={finishCall}
      />
    )}
  </div>
 )
 
}