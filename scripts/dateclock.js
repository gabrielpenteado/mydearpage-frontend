// CLOCK FUNCTION

const dateClock = () => {
  const time = new Date();

  // DATE
  let dayWeek = time.getDay();
  let month = time.getMonth();
  let dayNum = time.getDate();
  let year = time.getFullYear();

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
    'Agost', 'September', 'October', 'November', 'December'];
  const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday',
    'Friday', 'Saturday'];
  const displayDate = `${weekDays[dayWeek]}, ${months[month]} ${dayNum}, ${year}`;

  // CLOCK
  let hrs = time.getHours();
  let min = time.getMinutes();
  let sec = time.getSeconds();
  let ampm = 'AM';

  if (hrs === 0) {
    hrs = 12;
  } else if (hrs > 12) {
    hrs = hrs - 12;
    ampm = 'PM';
  }

  hrs = (hrs < 10) ? '0' + hrs : hrs;
  min = (min < 10) ? '0' + min : min;
  sec = (sec < 10) ? '0' + sec : sec;

  let currentTime = `${hrs}:${min}:${sec} ${ampm}`;

  const objDateClock = {
    clock: currentTime,
    date: displayDate
  };

  return objDateClock;
};


// INIT AND DISPLAY CLOCK AND DATE
let initClock = document.querySelector('.clock');
let initDate = document.querySelector('.date');
setInterval(() => {
  initClock.textContent = dateClock().clock;
  initDate.textContent = dateClock().date;
}, 1000);
