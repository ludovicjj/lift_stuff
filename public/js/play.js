let things = ['pizza', 'gelato', 'sushi'];
let greatThings = ['swimming', 'sunset', ...things, 'new orleans'];
let copyGreatThings = [...greatThings];
copyGreatThings.push('summer');

const favoriteFood = 'gelato';
const iLoveFood = `The year is ${new Date().getFullYear()} and my favorite food is ${favoriteFood}`;
console.log(iLoveFood);