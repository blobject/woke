import Moment from "moment"
import React, {Component} from "react"
import Howl from "react-howler"
import Keydown from "react-keydown"
import {prefix} from "../util"

// global constants
const S = Object.freeze({beeping: {}, paused: {}, running: {}})
const V = Object.freeze({bip: {}, bop: {}})
const SOUND = prefix("/pub/sound/alarm.mp3")
const TICK = 1000 // msec

// helpers
const basename = (s) => new String(s).substring(s.lastIndexOf("/") + 1)
const clone = (h) => JSON.parse(JSON.stringify(h))
const pad = (n) => ("00" + n).slice(-2)
const parts = (n) => {
  const t = Moment.duration(n)
  return {
    hour:   pad(t.hours()),
    minute: pad(t.minutes()),
    second: pad(t.seconds())
  }
}

@Keydown
class Timer extends Component {
  constructor(props) {
    super(props)
    this.defaultState = {
      status: null,
      timer: null,
      visual: null,
      count: 0,
      hour: "00",
      minute: "00",
      second: "00"
    }
    this.state = clone(this.defaultState)
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

  _onInputChange = (e) => {
    const t = e.target
    const c = t.className.split(" ")[1] // index presumed
    const v = pad(t.value)
    this.setState({[c]: v})
    this._updateCount(c, v)
  }

  _onKeydown(event, isInput) {
    if (!(event.type === "keydown")) return
    const key = event.key;
    const {status, count} = this.state
    const stopped = !status
    const beeping = status === S.beeping
    const paused  = status === S.paused
    const running = status === S.running
    const ready   = stopped && count > 0
    // pressing "Enter" or "space" on a button overlaps with _onButtonClick,
    // and latter should take precedence
    const isButton = event.srcElement
                  && event.srcElement.nodeName === "BUTTON"

    // concerns <body>, <button>, <input>
    if (key === "Enter" || key === " ") {
      if (isButton) return
      if      (running) this._pause()
      else if (paused)  this._start()
      else if (ready && key === "Enter") this._start()

    } else if (key === "Escape") {
      if (paused || beeping || ready) this._stop()
    }

    // concerns <input> only
    const inputAllowed = ["Alt", "Control", "Shift", "Meta",
                          "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight",
                          "Tab", "Backspace", "Delete"]
    if (isInput) {
      if (inputAllowed.includes(key)) {
        return

      } else if (isNaN(key)) { // now only accept digits
        event.preventDefault()
      }
    }
  }

  _updateCount = (c, v) => {
    const {hour, minute, second} = this.state
    const t = {hour, minute, second}
    t[c] = v
    this.setState({count: ((Number(t.hour) * 60 * 60)
                         + (Number(t.minute) * 60)
                         + Number(t.second)) * 1000})
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
      const t = parts(next)
      this.setState({
        count: next,
        hour: t.hour,
        minute: t.minute,
        second: t.second
      })
    }
  }

  _start = () => {
    this.setState({
      status: S.running,
      timer: setInterval(this._tick, TICK)
    })
  }

  _beep = () => {
    this.setState({
      status: S.beeping,
      count: 0
    })
  }

  _pause = () => {
    clearInterval(this.state.timer)
    this.setState({
      status: S.paused
    })
  }

  // for both cancelling and shutting-up
  _stop = () => {
    clearInterval(this.state.timer)
    this.setState(clone(this.defaultState))
  }

  render() {
    const {count, status, visual, timer, hour, minute, second} = this.state
    const stopped = !status
    const beeping = status === S.beeping
    const paused  = status === S.paused
    const running = status === S.running
    const unready = stopped && count <= 0 // for disabling button
    const blocked = beeping || running // for disabling input
    const bip = visual === V.bip
    const bop = visual === V.bop
    const play = beeping ? true : false
    const text = beeping ? "shut up"
               : paused  ? "resume"
               : running ? "pause"
               : "start"
    const time = parts(count)

    return (
      <div className={"timer" + (bip ? " beep bip" : bop ? " beep bop" : "")}>
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
          <input className={"part hour"}
                 type="text"
                 value={pad(time.hour)}
                 onChange={this._onInputChange}
                 onKeyDown={e => this._onKeydown(e, true)}
                 disabled={blocked}
          />:
          <input className={"part minute"}
                 type="text"
                 value={pad(time.minute)}
                 onChange={this._onInputChange}
                 onKeyDown={e => this._onKeydown(e, true)}
                 disabled={blocked}
          />:
          <input className={"part second"}
                 type="text"
                 value={pad(time.second)}
                 onChange={this._onInputChange}
                 onKeyDown={e => this._onKeydown(e, true)}
                 disabled={blocked}
          />
        </div>
        <div className="count">{count < 0 ? 0 : count / 1000}</div>
        <button className={"button" + (unready ? " disabled" : "")}
             onClick={unready ? null : this._onButtonClick}>
          {text}
        </button>
        {paused && (
          <button className="stop-button"
               onClick={e => { this._stop() }}>
            stop
          </button>
        )}
      </div>
    )
  }
}

export default Timer
