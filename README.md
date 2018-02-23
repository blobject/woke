# woke

[page]: https://agaric.net/dev/woke/

**woke** is a countdown alarm clock for the browser. For those (rare) occasions where the phone is less handy, or you want to see the timer on a bigger screen, or you need the functionality with just a browser and an internet connection.

Status: beta

Backstory: Lost my phone and gotta wake up tomorrow.

### use it!

[agaric.net/dev/woke][page]

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

- h, m, s configuration
- see countdown
- audio + visual beep
- keyboard control

#### todo

- sound selection
- sound preview
- theme selection

### includes

- [moment](http://momentjs.com/)
- [react](https://reactjs.org/), [babel](https://babeljs.io/), [webpack](https://webpack.github.io/)
- [react-howler](https://github.com/thangngoc89/react-howler)
- [react-keydown](https://github.com/glortho/react-keydown)
