document.addEventListener("DOMContentLoaded", () => {
  const generateBtn = document.getElementById("generate-btn");
  const quantityInput = document.getElementById("quantity");
  const resultsContainer = document.getElementById("results-container");
  const PI_DIGITS =
    "314159265358979323846264338327950288419716939937510582097494459230781640628620899862803482534211706798214808651328230664709384460955058223172535940812848111745028410270193852110555964462294895493038196442881097566593344612847564823378678316527120190914564856692346034861045432664821339360726024914127372458700660631558817488152092096282925409171536436789259036001133053054882046652138414695194151160943305727036575959195309218611738193261179310511854807446237996274956735188575272489122793818301194912";
  const generateFibonacci = (n) => {
    if (n <= 0) return [];
    if (n === 1) return [0];
    const sequence = [0, 1];
    for (let i = 2; i < n; i++) {
      sequence.push(sequence[i - 1] + sequence[i - 2]);
    }
    return sequence;
  };
  const generatePrimes = (n) => {
    if (n <= 0) return [];
    const primes = [];
    let num = 2;
    const isPrime = (p) => {
      for (let i = 2, s = Math.sqrt(p); i <= s; i++) {
        if (p % i === 0) return false;
      }
      return p > 1;
    };
    while (primes.length < n) {
      if (isPrime(num)) {
        primes.push(num);
      }
      num++;
    }
    return primes;
  };
  const generatePi = (n) => {
    if (n <= 0) return [];
    return PI_DIGITS.substring(0, n).split("");
  };
  const displayResults = (data) => {
    resultsContainer.innerHTML = "";
    data.forEach((item) => {
      const div = document.createElement("div");
      div.className = "result-item";
      div.textContent = item;
      resultsContainer.appendChild(div);
    });
  };
  const handleGeneration = () => {
    const selectedType = document.querySelector(
      'input[name="sequence"]:checked'
    ).value;
    const quantity = parseInt(quantityInput.value, 10);
    let results = [];
    switch (selectedType) {
      case "fibonacci":
        results = generateFibonacci(quantity);
        break;
      case "primes":
        results = generatePrimes(quantity);
        break;
      case "pi":
        results = generatePi(quantity);
        break;
    }
    displayResults(results);
  };
  generateBtn.addEventListener("click", handleGeneration);
  handleGeneration();
});
