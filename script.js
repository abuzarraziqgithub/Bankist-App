'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90, 211, 2, 12],
  interestRate: 1,
  pin: 4444,
};

const account5 = {
  owner: 'Abuzar RaziQ',
  movements: [44322, 5000, 7020, 5000, 9000000, 3444, 3222, 422],
  interestRate: 2,
  pin: 5555,
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
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2, account3, account4, account5];

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

// Lecture 5 :
const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  // CREATE A VARIABLE FOR SORTING THE MOVEMENTS:
  //  WE TAKE THE SLICE METHOD HERE BEACUSE WE DON'T WANT TO MUTATE THE ORIGINAL ARRAY.WE WANT TO MAKE A COPY OF IT.
  const movs = acc.movements
    .slice()
    .sort((a, b) => (sort ? a - b : acc.movements)); // SORTING FROM ASCENDING , BUT WE STARTED FROM THE BOTTOM , FOR US IT WILL BE DESCENDING.
  // LET'S CREATE AN EVENT LISTENER FOR OUR SORT BUTTON.

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(acc.movementsDates[i]);
    const day = `${date.getDate()}`.padStart(2, 0);
    const month = `${date.getMonth() + 1}`.padStart(2, 0);

    const year = date.getFullYear();
    const displayDate = `${day}/${month}/${year}`;
    const html = `
    <div class="movements__row">
        <div class="movements__type movements__type--${type}">
            ${i + 1} ${type}
        </div>
        <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${mov.toFixed(2)} PKR</div>
   </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};
// BUTTON SORT:
// LET'S CREATE A SORTED VARIABLE OUTSIDE THIS FUNCTION , FOR FLIPPING THE TRUE OR FALSE FOR EVERY CLICK, OTHERWISE WE WILL NOT ABLE TO SWITCH AFTER ANOTHER CLICK.
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();

  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});
// displayMovements(account1.movements);

// Lecture 10 : Reduce Method (Manipulating current balance)
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance.toFixed(2)} PKR`;
};
// calcDisplayBalance(account1.movements);

// Lecture 11 : Manipulating the summary by using filter and reduce method, as we did practice in lecture 11 file:
// create a function
const calcDisplaySummary = function (acc) {
  // For Income:
  const income = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);

  labelSumIn.textContent = `${income.toFixed(2)} PKR `;

  // For Withdrawal (out)
  const withdrawal = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov);
  labelSumOut.textContent = `${Math.abs(withdrawal).toFixed(2)} PKR`;

  // Interest
  // we used map method , to do some operation.
  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposite => (deposite * acc.interestRate) / 100)
    .reduce((acc, map) => acc + map, 0);
  labelSumInterest.textContent = `${interest.toFixed(2)} PKR`;
};
// calcDisplaySummary(account1.movements);
// calcDisplaySummary(account2.mosvements);

// Lecture 8 : Computing usernames for each account owner by using map and forEach method:
const createUserNames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUserNames(accounts);
//  In this lecture , it is very important to understand the usecase for the map method and the forEach method:
//The  map() method allows us to create new simple array which only contains the initials of whatever name it is used on.
// The forEach() method was a great usecase to produce some so called side effects ,in other words , to do some work without returning anything.
//  we simply looped over the accounts array , and in each iteration we manipulated the current account object and added a username to it based on the account owner plus all the transformations

// Lecture - 13 : Implementing Login:
let currentAccount;

const updateUi = function (acc) {
  // Display movements
  displayMovements(acc.movements);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};

// THI S PART IS FAKE LOGIN
currentAccount = account1;
updateUi(currentAccount);
containerApp.style.opacity = 100;

// UPDATING DATE BELOW THE CURRENT BALANCE
const now = new Date();
const day = `${now.getDate()}`.padStart(2, 0);
const month = `${now.getMonth()}`.padStart(2, 0);
const year = now.getFullYear();
const hour = now.getHours();
const min = now.getMinutes();
// UPDATING THE TEXT CONTENT OF THE LABEL DATE:
labelDate.textContent = `${day}/${month}/${year} . ${hour}:${min}`;

btnLogin.addEventListener('click', function (e) {
  e.preventDefault(); // It will prevent the default refresh of the form.

  // It will find the account where username of that account is equal to the username that is given in the input field.
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  // If the pin of the given account is equal to the pin of the user input:
  if (currentAccount?.pin === +inputLoginPin.value) {
    // Display UI and message
    // The text content of the given account which includes the first word and welcome text.
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;

    // The opacity will be changed to 1;
    containerApp.style.opacity = '1';

    // Clear Input Fields:
    inputLoginUsername.value = inputLoginPin.value = '';

    // Remove focus from pin input field using blur method:
    inputLoginPin.blur();

    // Update UI:
    updateUi(currentAccount);
  }
});

// Lecture - 14 : Implementing Transfers:
// Click on transfer button.
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = +inputTransferAmount.value;

  // Find the username of the given account , where the username is equal to the tranfer input username.
  const receiveAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );

  inputTransferAmount.value = inputTransferTo.value = '';
  inputTransferTo.blur();

  if (
    amount > 0 &&
    receiveAcc &&
    currentAccount.balance >= amount &&
    receiveAcc?.username !== currentAccount.username
  ) {
    // Doing  the Transfer:
    currentAccount.movements.push(-amount);
    receiveAcc.movements.push(amount);

    // Update UI:
    updateUi(currentAccount);
  }
});

// Lecture -16 : Request a Loan.

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  // Any deposite should be greater than 10% of their request.
  // If at least one element in the movement array has the condition applied , than it will be true.
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // If it's true:
    currentAccount.movements.push(amount);

    // Update UI
    updateUi(currentAccount);
  }

  // Clear the input:
  inputLoanAmount.value = '';
});

// Lecture - 15:
// Closing Account:
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

    // Delete Account:
    accounts.splice(index, 1);

    // Hide UI:
    containerApp.style.opacity = 0;
  }
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

// LECTURE - 17 FLAT FLATMAP METHODS:

// LET'S GET ARRAYS OF ALL THE ACCOUNT MOVEMENTS USING MAP METHOD:
const accountMovements = accounts.map(acc => acc.movements);
console.log(accountMovements);

// NOW LET'S MAKE ONE ARRAY OF ALL THE MOVEMENTS ELEMENTS
const movementsArray = accountMovements.flat();
console.log(movementsArray);

// LET'S ADD IT TOGETHER:
const overalBalance = movementsArray.reduce((acc, mov) => acc + mov, 0);
console.log(overalBalance);

// WE CAN CHAIN IT AS WELL:
const chainAllMovs = accounts
  .map(acc => acc.movements)
  .flat()
  .reduce((acc, mov) => acc + mov);
console.log(chainAllMovs);

// WE CAN USE FLATMAP , IT WORKS THE SAME AS WE CHAIN THE FLAT WITH MAP:
// WE USE IT FOR BETTER PERFORMANCE AND ONLY IF THERE IS 1 DEPTH OF ARRAY.
const flatMapMethod = accounts
  .flatMap(acc => acc.movements)
  .reduce((acc, mov) => acc + mov);
console.log(flatMapMethod);

// SECTION 12 CODE:

// USING REMAINDER OPERATOR TO CHANGE THE BACKGROUND COLOR OF EACH EVEN OR %3 ROW.
// labelBalance.addEventListener('click', () => {
//   [...document.querySelectorAll('.movements__row')].forEach((row, i) => {
//     if (i % 2 === 0) {
//       row.style.backgroundColor = 'green';
//     }
//     if (i % 3 === 0) {
//       row.style.backgroundColor = 'yellow';
//     }
//   });
// });
