let things = ['pizza', 'gelato', 'sushi'];
let greatThings = ['swimming', 'sunset', ...things, 'new orleans'];
let copyGreatThings = [...greatThings];
copyGreatThings.push('summer');

const favoriteFood = 'gelato';
const iLoveFood = `The year is ${new Date().getFullYear()} and my favorite food is ${favoriteFood}`;


// test for...of
const userInfos = {age:'42', nam:'john', job:'dev'}
for (let [key, value] of Object.entries(userInfos)) {
    //console.log(key, value)
}

// test for...in
for (let index in things) {
    //console.log(things[index]);
}

let foods = new WeakMap();
foods.set(['italian'], 'gelato');
foods.set(['mexican'], 'tortas');
foods.set(['canadian'], 'poutine');

let southernUsStates = ['Tennessee', 'Kentucky', 'Texas'];
foods.set(southernUsStates, 'hot chicken');
southernUsStates = null

console.log(
    foods.get(['italian']), // undefined
    foods.get(southernUsStates) // 'hot chicken'
)