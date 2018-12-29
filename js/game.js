//Create the Canvas
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);

//Background Image
let bgReady = false;
const bgImage = new Image();
bgImage.onload = () => {
	bgReady = true;
};
bgImage.src = 'images/background.png';

//Hero Image
let heroReady = false;
const heroImage = new Image();
heroImage.onload = () => {
	heroReady = true;
};
heroImage.src = 'images/hero.png';

//Monster Image
let monsterReady = false;
const monsterImage = new Image();
monsterImage.onload = () => {
	monsterReady = true;
};
monsterImage.src = 'images/monster.png';

//Game Objects
const hero = {
	speed: 256, //movement in pixels/sec
	x: 0,
	y: 0
};

const monster = {
	x: 0,
	y: 0
};

//var that keeps track of number of monsters caught by the hero
let monstersCaught = 0;

//Player Input Logic (handling keyboard controls)
const keysDown = {};

addEventListener("keydown", (e) => {
	keysDown[e.keyCode] = true;
}, false); //why do we need to false here?

addEventListener('keyup', (e) => {
	delete keysDown[e.keyCode];
}, false);

//New Game Logic (reset the game when player catches a monster)
const reset = () => {
	hero.x = canvas.width / 2;
	hero.y = canvas.height / 2;

	//puts monster at random position on screen
	monster.x = 32 + (Math.random() * (canvas.width - 64));
	monster.y = 32 + (Math.random() * (canvas.height - 64));
};

//Update Objects (Game Loop)
//  modifier => time-based number based on 1 (if 0.5 second has passed, modifier will be 0.5)
//           => necessary to ensure hero moves at same speed regardless of script runtime
const update = (modifier) => {
	if (38 in keysDown) { //player holding up
		hero.y -= hero.speed * modifier;
	}

	if (40 in keysDown) { //player holding down
		hero.y += hero.speed * modifier;
	}

	if (37 in keysDown) { //player holding left
		hero.x -= hero.speed * modifier;
	}

	if (39 in keysDown) { //player holding right
		hero.x += hero.speed * modifier;
	}

	//are they touching?
	if (
		hero.x <= (monster.x + 32) &&
		monster.x <= (hero.x + 32) &&
		hero.y <= (monster.y + 32) &&
		monster.y <= (hero.y + 32)
	) {
		monstersCaught += 1;
		reset();
	}
};


//Render Objects (draw everything)
const render = () => {
	if (bgReady) {
		ctx.drawImage(bgImage, 0, 0);
	}

	if (heroReady) {
		ctx.drawImage(heroImage, hero.x, hero.y);
	}

	if (monsterReady) {
		ctx.drawImage(monsterImage, monster.x, monster.y);
	}

	//Score
	ctx.fillStyle = 'rgb(250, 250, 250)';
	ctx.font = '24px Helvetica';
	ctx.textAlign = 'left';
	ctx.textBaseline = 'top';
	ctx.fillText('Monsters Caught: ' + monstersCaught, 32, 32);
};

//Main Game Loop
const main = () => {
	let now = Date.now();
	let delta = now - then;

	update(delta / 1000);
	render();

	then = now;

	//request to do this again ASAP
	requestAnimationFrame(main);
};

// Cross-browser Support for requestAnimationFrame
const w = window;
requestAnimationFrame = w / requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

//Game Play
let then = Date.now();
reset();
main();
