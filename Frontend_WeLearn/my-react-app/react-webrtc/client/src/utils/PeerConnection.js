import Emitter from './Emitter'
import MediaDevice from './MediaDevice'
import socket from './socket'

// настройки
const CONFIG = { iceServers: [{ urls: ['stun:stun.l.google.com:19302'] }] }

class PeerConnection extends Emitter {
    constructor(remoteId) {
        super()
        this.remoteId = remoteId
       
        this.pc = new RTCPeerConnection(CONFIG)
        this.pc.onicecandidate = ({ candidate }) => {
          socket.emit('call', {
            to: this.remoteId,
            candidate
          })
        }
        this.pc.ontrack = ({ streams }) => {
          // унаследованный метод
          this.emit('remoteStream', streams[0])
        }
       
        this.mediaDevice = new MediaDevice()
        this.getDescription = this.getDescription.bind(this)
       }
    
       // метод принимает индикатор того, является ли пользователь инициатором звонка
    // и объект с настройками для `getUserMedia`
    start(isCaller, config) {
        this.mediaDevice
          // обрабатываем событие `stream`
          .on('stream', (stream) => {
            // добавляем захваченные треки и поток в `PeerConnection`
            stream.getTracks().forEach((t) => {
              this.pc.addTrack(t, stream)
            })
       
            // данный захваченный поток является локальным
            this.emit('localStream', stream)
       
            // если пользователь является инициатором звонка,
            // отправляем запрос на звонок другой стороне,
            // иначе генерируем предложение об установке соединения
            isCaller
              ? socket.emit('request', { to: this.remoteId })
              : this.createOffer()
          })
          // запускаем метод `start` интерфейса `MediaDevices`
          .start(config)
       
        return this
       }
       stop(isCaller) {
        // если пользователь является инициатором завершения звонка,
        // сообщаем о завершении другой стороне
        if (isCaller) {
          socket.emit('end', { to: this.remoteId })
        }
        // останавливаем захват медиапотока
        this.mediaDevice.stop()
        // перезагружаем систему для обеспечения возможности совершения нового звонка
        this.pc.restartIce()
        this.off()
       
        return this
       }
       // метод для генерации предложения
    createOffer() {
        this.pc.createOffer().then(this.getDescription).catch(console.error)
       
        return this
       }
       
       // метод для генерации ответа
       createAnswer() {
        this.pc.createAnswer().then(this.getDescription).catch(console.error)
       
        return this
       }
       
       // метод для добавления локального описания в `PeerConnection`
       // и отправки описания другой стороне
       getDescription(desc) {
        this.pc.setLocalDescription(desc)
       
        socket.emit('call', { to: this.remoteId, sdp: desc })
       
        return this
       }
       
       // метод для добавления удаленного (в значении "находящегося далеко") описания в `PeerConnection`
       setRemoteDescription(desc) {
        this.pc.setRemoteDescription(new RTCSessionDescription(desc))
       
        return this
       }
       
       // метод для добавления кандидата в `PeerConnection`
       addIceCandidate(candidate) {
        // кандидат может быть пустой строкой
        if (candidate) {
          this.pc.addIceCandidate(new RTCIceCandidate(candidate))
        }
       
        return this
      
    }
}

