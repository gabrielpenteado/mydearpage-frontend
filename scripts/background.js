// SELECT ELEMENTS
const manuallyButton = document.querySelector('.manually');
const backgroundImage = document.querySelectorAll('.grid-item');
const dailySlide = document.getElementById('daily');
const weeklySlide = document.getElementById('weekly');

// FUNCTION TO PREVENT TEXT SELECTION ON DOUBLE CLICK
window.onload = function () {
  document.onselectstart = function () {
    return false;
  }
};

let count = 1;
const time = new Date();
const today = time.getDay();

// CHECK IF DAILY AND WEEKLY ARE ON OR OFF AND RULES ABOUT BACKGROUND CHANGE
const dailyStatus = localStorage.getItem('dailystatus');
if (dailyStatus === 'true') {
  dailySlide.checked = true;
  const dayInLocalStorage = localStorage.getItem('daySaved');
  let countInLocalStorage = localStorage.getItem('count');

  if (dayInLocalStorage !== today.toString()) {
    countInLocalStorage < 11 ? countInLocalStorage++ : countInLocalStorage = 1;
    backgroundImage.forEach(item => {
      item.style.backgroundImage = `url(/assets/background/background${countInLocalStorage}.jpg)`;
    });
    localStorage.setItem('count', countInLocalStorage);
  }
  localStorage.setItem('daySaved', today);
     
} else {
  dailySlide.checked = false;
}

const weeklyStatus = localStorage.getItem('weeklystatus');
if (weeklyStatus === 'true') {
  weeklySlide.checked = true;
  const weekInLocalStorage = localStorage.getItem('weekSaved');
  let countInLocalStorage = localStorage.getItem('count');

  if (weekInLocalStorage !== '1' && today == 0) {
    countInLocalStorage < 11 ? countInLocalStorage++ : countInLocalStorage = 1;
    backgroundImage.forEach(item => {
      item.style.backgroundImage = `url(/assets/background/background${countInLocalStorage}.jpg)`;
    });
    localStorage.setItem('count', countInLocalStorage);
    localStorage.setItem('weekSaved', 1);
  } else if (today) {
    localStorage.setItem('weekSaved', today);
  }

} else {
  weeklySlide.checked = false;
}

// FUNCTION TO CHANGE BACKGROUND MANUALLY
const changeBackground = () => {
  manuallyButton.classList.add('clickClass');
  setTimeout(() => {
    manuallyButton.classList.remove('clickClass');
  }, 200);
  
  if (count) {
    localStorage.setItem('count', count);
  } else {
    count = 1;
    localStorage.setItem('count', count);
  }

  count < 11 ? count++ : count = 1;
  backgroundImage.forEach(item => {
    item.style.backgroundImage = `url(/assets/background/background${count}.jpg)`;
  });

  localStorage.setItem('count', count);
}

// CHECK WHICH BACKGROUND ITEM(COUNT) IS SAVED AND ASSIGN IT
count = localStorage.getItem('count');
if (count) {
  backgroundImage.forEach(item => {
    item.style.backgroundImage = `url(/assets/background/background${count}.jpg)`;
  });
}

// FUNCTION TO CHANGE BACKGROUND DAILY
const changeDaily = () => {
  localStorage.setItem('dailystatus', dailySlide.checked);
  if (dailySlide.checked) {
    localStorage.setItem('daySaved', today);
    weeklySlide.checked = false;
    localStorage.removeItem('weekSaved');
    localStorage.removeItem('weeklystatus');

    if (count) {
      localStorage.setItem('count', count);
    } else {
      count = 1;
      localStorage.setItem('count', count);
    }
    
  } else {
    localStorage.removeItem('daySaved');
  }
}
// FUNCTION TO CHANGE BACKGROUND WEEKLY
const changeWeekly = () => {
  localStorage.setItem('weeklystatus', weeklySlide.checked);
  if(weeklySlide.checked) {
    dailySlide.checked = false;
    localStorage.removeItem('daySaved');
    localStorage.removeItem('dailystatus');

    if (today) {
      localStorage.setItem('weekSaved', today);     
    } else {
      localStorage.setItem('weekSaved', 1);
    }
    
    if (count) {
      localStorage.setItem('count', count);
    } else {
      count = 1;
      localStorage.setItem('count', count);
    }
    
  } else {
    localStorage.removeItem('weekSaved');
  }
};

// HANDLE EVENTS
manuallyButton.addEventListener('click', changeBackground);
dailySlide.addEventListener('click', changeDaily);
weeklySlide.addEventListener('click', changeWeekly);
