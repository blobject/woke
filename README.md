# woke

[page]: https://alocy.be/dev/woke/

**woke** is an alarmer/timer/stopper/clock for the browser. For those (rare) occasions where the phone is less handy, or you want to see the time on a bigger screen, or you need the functionality with just a browser and an internet connection.

Status: pre-alpha.

Backstory: Lost my phone and gotta wake up tomorrow.

### use it!

[alocy.be/dev/woke][page]

### run it locally

```sh
cd woke
mkdir -p pub/sound
cp /YOUR/ALARM/SOUND/FILE.mp3 pub/sound/alarm.mp3
cp index.dev.html index.html
npm install
npm run dev   # either background this: &
npm run serve # or run this in another shell
# visit localhost:8002 in a js-enabled browser
```

### functionality

#### parts

- alarmer *TODO: basic, snoozing*
- timer
- stopper *TODO: basic*
- clock *TODO: basic, timezone detection, time configuration*

#### common todo

- sound selection
- sound preview
- theme selection

#### notes on reliability

- Commonsensically, the proper functioning of **woke** is totally contingent upon a persistent ...
  - browser *(don't close or refresh the tab while the timer's running!)*
  - power source *(plug in your alarm-armed laptop before going to sleep!)*
  - audio source *(sound file good? volume good? browser's channel free?\*)*  
    \* some sound systems (eg. on linux) might have trouble getting multiple applications to produce sound simultaneously.
- Once the page (the js) has loaded, an internet connection will not be a necessity. When run locally, not a necessity at all.

### includes

- [react](https://reactjs.org/) et al.
- [react-howler](https://github.com/thangngoc89/react-howler)
- [react-keydown](https://github.com/glortho/react-keydown)
- [moment](http://momentjs.com/)
