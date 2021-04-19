const array = [1, 2, 3, 4, 5, 6];

console.log(array.map(m => m * 10).filter(f => f).sort(function (a, b) { return a - b;}));