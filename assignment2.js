
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let numbers = [];

// Ask the user for input
function ask() {
  rl.question("Enter an integer (or 'q' to quit): ", (answer) => {
    const input = answer.trim();

    // Quit condition
    if (input.toLowerCase() === "q") {
      finish();
      return;
    }

    // Error handling must be an integer
    if (!/^[-+]?\d+$/.test(input)) {
      console.log("Error: Please enter a valid integer or 'q' to quit.");
      ask();
      return;
    }

    // Convert to number and echo back
    const num = parseInt(input, 10);
    numbers.push(num);
    console.log(`You entered: ${num}`);

    ask();
  });
}

// Check if two numbers equals a third
function checkCondition(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length; j++) {
      if (i === j) continue;
      const product = arr[i] * arr[j];
      for (let k = 0; k < arr.length; k++) {
        if (k !== i && k !== j && arr[k] === product) {
          return { a: arr[i], b: arr[j], c: arr[k] };
        }
      }
    }
  }
  return null;
}

// Show results and exit
function finish() {
  console.log("\nAll integers entered:", numbers.length ? numbers.join(", ") : "(none)");

  if (numbers.length < 3) {
    console.log("Condition was not met (need at least 3 integers).");
    rl.close();
    return;
  }

  const result = checkCondition(numbers);
  if (result) {
    console.log(`Condition is met: ${result.a} x ${result.b} = ${result.c}`);
  } else {
    console.log("Condition was not met");
  }
  rl.close();
}

console.log("Welcome! Enter integers one by one. Type 'q' to quit.");
ask();
