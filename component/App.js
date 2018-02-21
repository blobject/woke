// TODO
// - fix input
// - visual beep
// - sound selection
// - sound preview
// - snooze
// - consider connection to clock

import moment from 'moment'
import React, {Component} from 'react'
import Sound from 'react-sound'

// global constants
const S = Object.freeze({beeping: {}, running: {}, stopped: {}})
const TICK = 1000  // msec

// helpers
const pad = (x) => ("00" + x).slice(-2)
const parts = (x) => {
  const t = moment.duration(x)
  return {
    hour: pad(t.hours()),
    minute: pad(t.minutes()),
    second: pad(t.seconds())
  }
}

// subcomponents
const Part = (c, v, h) => {
  return (
    <input className={"part " + c}
           type="text"
           value={pad(v)}
           onChange={h} />
  )
}

class App extends Component {
  state = {
    status: S.stopped,
    timer: null,
    count: -1,
    hour: 0,
    minute: 0,
    second: 0
  }

  constructor(props) {
    super(props)
    this._onButtonClick = this._onButtonClick.bind(this)
    this._onInputChange = this._onInputChange.bind(this)
  }

  componentWillUnmount() {
    this._stop()  // probably unused
  }

  _onButtonClick = () => {
    const {status} = this.state
    if      (status === S.stopped)  this._start()
    else if (status === S.running) this._stop()
    else if (status === S.beeping)  this._stop()
    else console.log('unknown status')
  }

  _onInputChange = (e) => {
    const t = e.target
    // presumes the relevant className to be @ index 1
    this.setState({[t.className.split(" ")[1]]: pad(t.value)})
    this._updateCount() // must come after setState
  }

  _updateCount = () => {
    const {hour, minute, second} = this.state
    this.setState({count: ((Number(hour) * 60 * 60)
                         + (Number(minute) * 60)
                         + Number(second)) * 1000})
  }

  _start = () => {
    console.log(this.state.count)
    let timer = setInterval(this._tick, TICK)
    this.setState({status: S.running, timer})
  }

  _beep = () => {
    clearInterval(this.state.timer)
    this.setState({status: S.beeping, count: 0})
  }

  // for both cancelling and shutting-up
  _stop = () => {
    clearInterval(this.state.timer)
    this.setState({status: S.stopped, timer: null, count: -1})
  }

  _tick = () => {
    const {count} = this.state
    const next = count - TICK
    if (next <= 0) { this._beep(); return }
    this.setState({count: next})
  }

  render() {
    const {count, status, timer,
           hour, minute, second} = this.state
    const beeping = status === S.beeping
    const running = status === S.running
    const stopped = status === S.stopped
    const flag = beeping ? Sound.status.PLAYING : Sound.status.STOPPED
    const text = beeping ? "shut up" : running ? "cancel" : "start"
    const time = parts(count)

    return (
      <div className="app">
        <Sound
          url="/pub/sound/alarm.mp3"
          loop={true}
          playStatus={flag}
        />
        <div className="sound">
          <span className="label">sound:</span> alarm.mp3
        </div>
        <div className={"time" + (running ? " running" : "")}>
          {Part("hour", time.hour, this._onInputChange)}
          :{Part("minute", time.minute, this._onInputChange)}
          :{Part("second", time.second, this._onInputChange)}
        </div>
        <div className="count">{count < 0 ? 0 : count / 1000}</div>
        <div className="button"
             onClick={this._onButtonClick}>
          {text}
        </div>
      </div>
    )
  }
}

export default App
