import Moment from "moment"
import React, {Component} from "react"
import Howl from "react-howler"
import Keydown from "react-keydown"
import {prefix} from "../util"

// global enums + constants
const D = Object.freeze({up: {}, down: {}})
const S = Object.freeze({beeping: {}, paused: {}, running: {}})
const V = Object.freeze({bip: {}, bop: {}})
const SOUND = prefix("/pub/sound/alarm.mp3")
const TICK = 1000 // msec

// helpers
const basename = (s) => new String(s).substring(s.lastIndexOf("/") + 1)
const partname = (e) => e.parentNode.className
const bottom = (n, s) => {
  const d = s === "hour" ? 3600 : s === "minute" ? 60 : 1
  return Math.floor(n / 1000 / d) === 0
}
const clone = (o) => JSON.parse(JSON.stringify(o))
const pad = (n) => ("00" + n).slice(-2)
const pads = (o) => ({
  hour: pad(o.hour),
  minute: pad(o.minute),
  second: pad(o.second)
})
const parts = (n) => {
  const m = Moment.duration(n)
  return {hour: m.hours(), minute: m.minutes(), second: m.seconds()}
}
// o.* types are ambiguous, can be "01" or 1
const whole = (o) => ((Number(o.hour) * 60 * 60)
                    + (Number(o.minute) * 60)
                    + Number(o.second)) * 1000

// subcomponents

const Part = (v, c, k, d) => (
  <input type="text" value={v} onChange={c} onKeyDown={k} disabled={d} />
)

// show can be null, so explicitly check for false
const Arrow = (dir, click, hid, show) => (
  <div className={dir + (hid ? " hid" : show === false ? " dim" : "")}
       onClick={hid || show === false ? null : click}>
  </div>
)

@Keydown
class Timer extends Component {
  constructor(props) {
    super(props)
    this.defaultState = {
      status: null,
      timer: null,
      visual: null,
      count: 0, // the view-determining central value, in ms
      hour: "00",
      minute: "00",
      second: "00"
    }
    this.state = clone(this.defaultState)
    this._onArrowClick = this._onArrowClick.bind(this)
    this._onButtonClick = this._onButtonClick.bind(this)
    this._onInputChange = this._onInputChange.bind(this)
    this._onKeydown = this._onKeydown.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    const {keydown: {event}} = nextProps;
    if (event) this._onKeydown(event)
  }

  componentWillUnmount() {
    this._stop() // probably unused
  }

  _onButtonClick = () => {
    const {status} = this.state
    if      (!status)              this._start()
    else if (status === S.running) this._pause()
    else if (status === S.beeping) this._stop()
    else if (status === S.paused)  this._start()
    else console.log("unknown status")
  }

  _onInputChange = (event) => {
    const target = event.target
    const {hour, minute, second} = this.state
    const time = {hour, minute, second}
    time[partname(target)] = target.value
    this._updateTime(whole(time))
  }

  _onKeydown(event) {
    if (!(event.type === "keydown")) return
    const key = event.key;
    const target = event.target;
    const isButton = target.nodeName === "BUTTON"
    const isInput = target.nodeName === "INPUT"

    const {status, count} = this.state
    const stopped = !status
    const beeping = status === S.beeping
    const paused  = status === S.paused
    const running = status === S.running
    const ready   = stopped && count > 0

    // concerns <body>, <button>, <input>
    if (key === "Enter" || key === " ") {
      // pressing "Enter" or "space" on a button overlaps with _onButtonClick,
      // let latter take precedence
      if (isButton) return
      if      (running) this._pause()
      else if (paused)  this._start()
      else if (ready && key === "Enter") this._start()

    } else if (key === "Escape") {
      if (paused || beeping || ready) this._stop()
    }

    // concerns <input> only
    if (isInput) {
      const part = partname(target)
      const cls = target.className
      const val = Number(target.value)
      const inputAllowed = ["Shift", "ArrowLeft", "ArrowRight",
                            "Tab", "Backspace", "Delete"]

      if (key === "ArrowUp") {
        event.preventDefault()
        this._inc(D.up, part, val)
      } else if (key === "ArrowDown") {
        event.preventDefault()
        if (count > 0 && !bottom(count, part))
          this._inc(D.down, part, val)

      } else if (inputAllowed.includes(key)) {
        return

      } else if (isNaN(key)) { // now, only accept digits
        event.preventDefault()
      }
    }
  }

  _onArrowClick = (event) => {
    const target = event.target
    const dir = target.className === "up" ? D.up : D.down
    const part = partname(target)
    this._inc(dir, part, Number(this.state[part]))
  }

  _inc = (dir, part, val) => {
    const {hour, minute, second} = this.state
    const time = {hour, minute, second}
    time[part] = val + (dir === D.up ? 1 : -1)
    this._updateTime(whole(time))
  }

  _start = () => {
    this.setState({status: S.running, timer: setInterval(this._tick, TICK)})
  }

  _beep = () => {
    this.setState({status: S.beeping, count: 0})
  }

  _pause = () => {
    clearInterval(this.state.timer)
    this.setState({status: S.paused})
  }

  // for both cancelling and shutting-up
  _stop = () => {
    clearInterval(this.state.timer)
    this.setState(clone(this.defaultState))
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
      }
      this._updateTime(next)
    }
  }

  _updateTime = (count) => {
    const time = pads(parts(count))
    const {hour, minute, second} = time
    this.setState({count, hour, minute, second})
  }

  render() {
    const {status, visual, timer, count, hour, minute, second} = this.state
    const ac = this._onArrowClick
    const bc = this._onButtonClick
    const ic = this._onInputChange
    const kd = this._onKeydown
    const stopped = !status
    const beeping = status === S.beeping
    const paused  = status === S.paused
    const running = status === S.running
    const unready = stopped && count <= 0 // for disabling button
    const blocked = beeping || running    // for disabling inputs
    const bip = visual === V.bip
    const bop = visual === V.bop
    const play = beeping ? true : false
    const text = beeping ? "shut up"
               : paused  ? "resume"
               : running ? "pause"
               : "start"

    return (
      <div className={"timer" + (bip ? " beep bip" : bop ? " beep bop" : "")}>
        <Howl src={SOUND} loop={true} playing={play} preload={true} />
        <div className="info">
          <div className="sound">
            <span className="label">sound:</span> {basename(SOUND)}
          </div>
          <div className="count">{count <= 0 ? 0 : count / 1000}</div>
        </div>
        <div className={"time" + (running ? " running" : "")}>
          <div className="hour">
            {Arrow("up", ac, blocked)}
            {Part(hour, ic, kd, blocked)}
            {Arrow("down", ac, blocked, !bottom(count, "hour"))}
          </div>:
          <div className="minute">
            {Arrow("up", ac, blocked)}
            {Part(minute, ic, kd, blocked)}
            {Arrow("down", ac, blocked, !bottom(count, "minute"))}
          </div>:
          <div className="second">
            {Arrow("up", ac, blocked)}
            {Part(second, ic, kd, blocked)}
            {Arrow("down", ac, blocked, count > 0)}
          </div>
        </div>
        <button className={"button" + (unready ? " disabled" : "")}
                onClick={unready ? null : bc}>
          {text}
        </button>
        {paused && (
          <button className="stop-button" onClick={this._stop}>
            stop
          </button>
        )}
      </div>
    )
  }
}

export default Timer
