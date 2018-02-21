import moment from 'moment'
import React, {Button, Component} from 'react'
import Sound from 'react-sound'

//const C = 2
const C = 6 * 60 * 60  // user-configured sec
const T = C * 1000     // total msec
const TICK = 1000      // tick msec
const S = Object.freeze({beeping: {}, counting: {}, stopped: {}})

class App extends Component {
  state = {
    status: S.stopped,
    timer: null,
    count: T
  }

  componentWillUnmount() {
    this._cancel()  // probably unused
  }

  _onClick = () => {
    const {status} = this.state
    if (status === S.stopped) {
      this._start()
    } else if (status === S.counting) {
      this._cancel()
    } else if (status === S.beeping) {
      this._cancel()
    } else {
      console.log('unknown status')
    }
  }

  _start = () => {
    let timer = setInterval(this._tick, TICK)
    this.setState({status: S.counting, timer})
  }

  _beep = () => {
    clearInterval(this.state.timer)
    this.setState({status: S.beeping, count: 0})
  }

  // for both cancelling and shutting-up
  _cancel = () => {
    clearInterval(this.state.timer)
    this.setState({status: S.stopped, timer: null, count: T})
  }

  _tick = () => {
    const {count} = this.state
    const next = count - TICK
    if (next <= 0) { this._beep(); return }
    this.setState({count: next})
  }

  render() {
    const {count, status, timer} = this.state
    const flag = status === S.beeping
               ? Sound.status.PLAYING
               : Sound.status.STOPPED
    const text = status === S.beeping ? "SHUT UP"
               : status === S.counting ? "STOP"
               : "START"
    const t = moment.duration(count)
    const h = t.hours()
    const m = t.minutes()
    const s = t.seconds()
    const pad = (x) => (x == 0 ? '00' : x >= 10 ? x : '0' + x)
    const time = pad(h) + ':' + pad(m) + ':' + pad(s)

    return (
      <div className="app">
        <Sound
          url="/pub/sound/alarm.mp3"
          loop={true}
          playStatus={flag}
        />
        <button onClick={this._onClick}>{text}</button>
        {" "}{time}
      </div>
    )
  }
}

export default App
