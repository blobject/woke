# woke

**woke** is an alarmer/timer/stopper/clock for the browser. For those (rare) occasions where the phone is less handy, or you want to see the time on a bigger screen, or you need the functionality with just a browser and an internet connection.

Status: pre-alpha.

Backstory: Lost my phone and gotta wake up tomorrow.

### functionality

#### parts

*WIP*

- alarmer
  - user decides when
  - user decides sound
  - app plays sound
  - user snoozes
  - user arms, disarms alarm
  - *TODO*
  - somehow tied to clock
- timer
  - user decides duration
  - user decides sound
  - app counts duration down
  - app plays sound
  - user pauses, resumes, starts, stops countdown
- stopper
  - *TODO*
- clock
  - app shows time (based on your location-data?)
  - user configures time
  - *TODO*

#### service

The app may be hosted on my site. Check back later.

#### notes on reliability

Commonsensically, the proper functioning of **woke** is totally contingent upon a reliable/persistent ...

- browser *(don't close or refresh the tab while the timer's running!)*
- power source *(plug in your alarm-armed laptop before going to sleep!)*
- audio source *(sound file good? volume good? browser's channel free?\*)*

\* some sound systems (eg. on linux) might have trouble letting multiple applications simultaneously produce sound.

Do note, however, that once the page (the js) has loaded, an internet connection will not be a necessity. When run locally, not a necessity at all.

### includes

- [react](https://reactjs.org/) et al.
- [react-sound](https://github.com/leoasis/react-sound)
- [moment](http://momentjs.com/)
