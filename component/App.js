// TODO
// - sound selection
// - sound preview
// - keyboard control
// - consider connection to clock

import moment from "moment"
import React, {Component} from "react"
import Howl from "react-howler"

// global constants
const S = Object.freeze({beeping: {}, running: {}, stopped: {}, paused: {}})
const V = Object.freeze({bip: {}, bop: {}})
const SOUND = "/pub/sound/alarm.mp3"
const TICK = 1000 // msec

// helpers
const basename = (x) => new String(x).substring(x.lastIndexOf("/") + 1)
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
    visual: null,
    count: -1,
    hour: "00",
    minute: "00",
    second: "00"
  }

  constructor(props) {
    super(props)
    this._onButtonClick = this._onButtonClick.bind(this)
    this._onInputChange = this._onInputChange.bind(this)
  }

  componentWillUnmount() {
    this._restart() // probably unused
  }

  _onButtonClick = () => {
    const {status} = this.state
    if      (status === S.stopped) this._start()
    else if (status === S.running) this._pause()
    else if (status === S.beeping) this._restart()
    else if (status === S.paused)  this._start()
    else console.log("unknown status")
  }

  _onInputChange = (e) => {
    const t = e.target
    const c = t.className.split(" ")[1] // index presumed
    const v = pad(t.value)
    this.setState({[c]: v})
    this._updateCount(c, v) // must come after setState
  }

  _updateCount = (c, v) => {
    const {hour, minute, second} = this.state
    const t = {hour, minute, second}
    t[c] = v
    this.setState({count: ((Number(t.hour) * 60 * 60)
                         + (Number(t.minute) * 60)
                         + Number(t.second)) * 1000})
  }

  _start = () => {
    let timer = setInterval(this._tick, TICK)
    this.setState({status: S.running, timer})
  }

  _beep = () => {
    this.setState({status: S.beeping, count: 0})
  }

  _pause = () => {
    clearInterval(this.state.timer)
    this.setState({status: S.paused})
  }

  // for both cancelling and shutting-up
  _restart = () => {
    clearInterval(this.state.timer)
    this.setState({
      status: S.stopped, visual: null, timer: null,
      count: -1, hour: "00", minute: "00", second: "00"
    })
  }

  _tick = () => {
    const {count, visual} = this.state
    if      (visual === V.bip) this.setState({visual: V.bop})
    else if (visual === V.bop) this.setState({visual: V.bip})
    else {
      const next = count - TICK
      if (next <= 0) {
        this.setState({visual: V.bip})
        this._beep()
        return
      }
      this.setState({count: next})
    }
  }

  render() {
    const {count, status, visual, timer,
           hour, minute, second} = this.state
    const beeping = status === S.beeping
    const running = status === S.running
    const stopped = status === S.stopped
    const paused  = status === S.paused
    const bip = visual === V.bip
    const bop = visual === V.bop
    const waiting = stopped && count <= 0
    const play = beeping ? true : false
    const text = beeping ? "shut up"
               : running ? "pause"
               : paused ? "resume"
               : "start"
    const time = parts(count)

    return (
      <div className={"app" + (bip ? " beep bip" : bop ? " beep bop" : "")}>
        <Howl
          src={SOUND}
          playing={play}
          loop={true}
          preload={true}
        />
        <div className="sound">
          <span className="label">sound:</span> {basename(SOUND)}
        </div>
        <div className={"time" + (running ? " running" : "")}>
          {Part("hour", time.hour, this._onInputChange)}
          :{Part("minute", time.minute, this._onInputChange)}
          :{Part("second", time.second, this._onInputChange)}
        </div>
        <div className="count">{count < 0 ? 0 : count / 1000}</div>
        <div className={"button" + (waiting ? " disabled" : "")}
             onClick={waiting ? null : this._onButtonClick}>
          {text}
        </div>
      </div>
    )
  }
}

export default App
