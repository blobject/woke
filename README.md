# woke

[page]: https://alocy.be/dev/woke/

**woke** is an alarmer/timer/stopper/clock for the browser. For those (rare) occasions where the phone is less handy, or you want to see the time on a bigger screen, or you need the functionality with just a browser and an internet connection.

Status: pre-alpha.

Backstory: Lost my phone and gotta wake up tomorrow.

### use it!

[alocy.be/dev/woke][page]

*IMPORTANT: Use at your own risk, see note on reliability below*

### run it locally

```sh
cd woke
cp /AN/ALARM/SOUND.mp3 pub/sound/alarm.mp3
cp index.dev.html index.html
npm install
npm run dev
npm run serve  # in another shell
# visit localhost:8002 in a js-enabled browser
```

### functionality

#### parts

- alarmer *TODO: basic, snoozing*
- timer
- stopper *TODO: basic*
- clock *TODO: basic, timezone detection, time configuration*

#### common todo

- keyboard control
- input error handling
- sound selection
- sound preview
- theme selection

#### notes on reliability

- Commonsensically, the proper functioning of **woke** is totally contingent upon a persistent ...
  - browser *(don't close or refresh the tab while the timer's running!)*
  - power source *(plug in your alarm-armed laptop before going to sleep!)*
  - audio source *(sound file good? volume good? browser's channel free?\*)*  
    \*: some sound systems (eg. on linux) might have trouble getting multiple applications to produce sound simultaneously.
- Once the page (the js) has loaded, an internet connection will not be a necessity. When run locally, not a necessity at all.
- The [service][page] hosted at alocy.be neither is bug-free nor guarantees 100% uptime. Please use it at your own risk.

### includes

- [react](https://reactjs.org/) et al.
- [react-howler](https://github.com/thangngoc89/react-howler)
- [moment](http://momentjs.com/)
