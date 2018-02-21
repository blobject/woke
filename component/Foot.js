import React from "react"
import {prefix} from "../util"

const Foot = () => (
  <div className="foot">
    <a href="https://github.com/agarick/woke">
      <img src={prefix("/pub/img/github.png")} />
    </a>
    {" "}brought to you by
    {" "}<a href="https://alocy.be">agaric</a>
  </div>
)

export default Foot
