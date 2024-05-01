'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2024-03-18T21:31:17.178Z',
    '2023-01-23T07:42:02.383Z',
    '2024-05-28T09:15:04.904Z',
    '2024-05-01T10:17:24.185Z',
    '2024-05-08T14:11:59.604Z',
    '2024-05-26T17:01:17.194Z',
    '2024-05-28T23:36:17.929Z',
    '2024-05-01T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2024-04-01T13:15:33.035Z',
    '2024-04-30T09:48:16.867Z',
    '2024-04-25T06:04:23.907Z',
    '2024-04-25T14:18:46.235Z',
    '2024-05-01T16:33:06.386Z',
    '2024-04-10T14:43:26.374Z',
    '2024-03-25T18:49:59.371Z',
    '2024-04-30T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account3 = {
  owner: 'Abuzar RaziQ',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 3333,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'GBP',
  locale: 'en-GB',
};
const accounts = [account1, account2, account3];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
// Functions

const fomatMovementDate = function (date, locale) {
  // FUNCTION THAT CALCULATES THE DAY PASSED BETWEEN TWO GIVEN DATES
  const calcDayPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDayPassed(new Date(), date);

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;

  // const day = `${date.getDay()}`.padStart(2, 0);
  // const month = `${date.getMonth() + 1}`.padStart(2, 0);
  // const year = date.getFullYear();

  // return `${day}/${month}/${year}`;

  return new Intl.DateTimeFormat(locale).format(date);
};

// CREATED A FUNCTION FOR INTERNATIONALIZING CURRENCY:
const formatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  let movs = sort ? acc.movements.slice().sort((a, b) => a - b) : acc.movements;
  // SO WE ADDED THE ENTIRE ACCOUNT , AND ALSO CALLED THE MOVEMENTS OF EACH ACCOUNT AND STORED IT IN THE MOVS.
  // WE ALSO NEED TO PASS IN THE ENTIRE ACCOUNT WHERE WE CALL THIS FUNCTION , WHICH IS THE DISPLAYUI FUNCTION
  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(acc.movementsDates[i]);
    const displayDate = fomatMovementDate(date, acc.locale);

    // INTERNATIONALIZING NUMBERS : formatCur() FUNCTION:
    const formattedMov = formatCur(mov, acc.locale, acc.currency);
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
    <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${formattedMov}</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = formatCur(acc.balance, acc.locale, acc.currency);
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formatCur(incomes, acc.locale, acc.currency);

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formatCur(Math.abs(out), acc.locale, acc.currency);

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = formatCur(interest, acc.locale, acc.currency);
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};

// CREATED A FUNCTION FOR TIMER:
const startLogOutTimer = function () {
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);

    // IN EACH CALL , PRINT THE REMAINING TIME TO UI
    labelTimer.textContent = `${min}:${sec}`;

    // WHEN 0 SECONDS , STOP TIMER AND LOG OUT USER
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = `Log in to get started`;
      containerApp.style.opacity = 0;
    }
    // DECREASE 1S
    time--;
  };
  // SET TIME TO 120 SECS
  let time = 120;
  tick();
  // CALL THE TIMER EVERY SECOND
  const timer = setInterval(tick, 1000);
  return timer;
};

///////////////////////////////////////
// Event handlers
let currentAccount, timer;

// EXPERIMENTING API : INTERNATIONALIZATION OF DATES:
// const nowDate = new Date();
// // const options = {
// //   hour: 'numeric',
// //   minute: 'numeric',
// //   second: 'numeric',
// //   day: 'numeric',
// //   month: 'long',
// // };

// // const locale = navigator.language;

// // labelDate.textContent = new Intl.DateTimeFormat(locale, options).format(
// //   nowDate
// // );

btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === +inputLoginPin.value) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    // CREATE CURRENT DATE
    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    };

    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    // LOGIN OUT TIMER FUNCTION:
    // IF THERE IS CURRENT LOGIN START , AND YOU LOG INTO NEW ACCOUNT , THEN RESTART THE TIMER.
    if (timer) clearInterval(timer);
    timer = startLogOutTimer();

    // Update UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // ADDING TRANSFER DATE
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    // Update UI
    updateUI(currentAccount);

    // RESET TIMER : WHEN THE USER TRANSFER , IT SHOULD RESET THE TIMER:
    // FIRST , CLEAR THE TIMER
    clearInterval(timer);
    // THEN START AGAIN:
    timer = startLogOutTimer();
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = +inputLoanAmount.value;

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // ADDED FOR THE APPROVAL OF REQUESTING LOAN
    // IT WILL RELAOD AFTER GIVEN SE TIME.
    setTimeout(function () {
      // Add movement
      currentAccount.movements.push(amount);

      // ADDING TRANSFER DATE
      currentAccount.movementsDates.push(new Date().toISOString());

      // Update UI
      updateUI(currentAccount);

      // RESET TIMER : WHEN THE USER GET LOAN , IT SHOULD RESET THE TIMER:
      // FIRST , CLEAR THE TIMER
      clearInterval(timer);
      // THEN START AGAIN:
      timer = startLogOutTimer();
    }, 2500);
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    // .indexOf(23)

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// LECTURE : ADDING DATES TO BANKIST APP:

// CREATE A FAKE LOGIN TO IGNORE THE LOGIN PAGE WHENEVER REFRESH THE PAGE.

// // FAKE LOGIN UI
// currentAccount = account1;
// updateUI(account1);
// containerApp.style.opacity = 100;

// LET'S ALSO DISPLAY A DATE , BY CALLING DATE CONSTRUCTOR FUNCTION AND SET IT TO THE LABELDATE VARIABLE TEXT CONTENT.

// const now = new Date();

// MONTH IS ZERO BASED , ALSO WE NEED TO ADD 0 AT THE START OF THE MONTH AND DAY , IF THERE IS ONLY ONE INTEGER.
// const day = `${now.getDay()}`.padStart(2, 0);
// const month = `${now.getMonth() + 1}`.padStart(2, 0);
// const year = now.getFullYear();
// const hour = now.getHours();
// const min = now.getMinutes();

// labelDate.textContent = `${day}/${month}/${year},${hour}:${min}`;

// LET'S ALSO IMPLEMENT DATES FOR MOVEMENTS.
// WE PASSED IN THE ENTIRE ACCOUNT TO THE DISPLAYMOVEMENTS FUNCTION , IN ORDER TO ADD THE DATE MOVEMENTS AS WELL.

// WE ADDED DATES TO MOVEMENTS , TO TRANSFERS AND LOGINS. ALSO ADDED AN HTML OF DATES IN MOVEMENTS FUNCTION.
