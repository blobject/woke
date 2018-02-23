import React from "react"
import {prefix} from "../util"

const Foot = () => (
  <div className="foot">
    <div className="left">
      <span className="bold">for effective use:</span> confirm power supply (if mobile) & browser audio volume
      <br />
      <span className="bold">keys:</span> (<span className="bolder">Shift</span>)<span className="bolder">Tab</span> cycle focus, <span className="bolder">Up</span>/<span className="bolder">Down</span> +1/-1, <span className="bolder">Enter</span> start/pause, <span className="bolder">Space</span> pause, <span className="bolder">Escape</span> stop
    </div>
    <div className="right">
      <a href="https://github.com/agarick/woke">
        <img src={prefix("/pub/img/github.png")} />
      </a>
      {" "}brought to you by
      {" "}<a href="https://alocy.be">agaric</a>
    </div>
  </div>
)

export default Foot
