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

- keyboard control
- sound selection
- sound preview
- theme selection

### includes

- [moment](http://momentjs.com/)
- [react](https://reactjs.org/) et al.
- [react-howler](https://github.com/thangngoc89/react-howler)
- [react-keydown](https://github.com/glortho/react-keydown)
