let canvas = document.getElementById('canvas1');
let ctx = canvas.getContext('2d');
canvas.width = 700;
canvas.height = 700;

let LoseScene = document.getElementById('anda-kalah');

lastTime = 0;

class Laser{
	static width = 113/15;
	static height = 478/15;
	constructor(x, y){
		this.image = new Image();
		this.image.src = 'img/laser.png';
		this.velocity = -10;
		this.x = x;
		this.y = y;
		this.width = Laser.width;
		this.height = Laser.height;
		this.markedDeletion = false;
	}
	update(){
		this.y += this.velocity;
		if(this.y < -this.height){
			this.markedDeletion = true;
		}
	}
	draw(){
		ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
	}
}

class Meteorid{
	static meteoridType = ['img/meteorid1.png', 'img/meteorid2.png', 'img/meteorid3.png'];
	static width = 500/4;
	static height = 500/4;
	constructor(){
		this.image = new Image();
		this.image.src = Meteorid.meteoridType[ Math.floor(Math.random() * 2) ];
		this.width = Meteorid.width;
		this.height = Meteorid.height;
		this.velocity = 3;
		this.x = Math.random() * (canvas.width - this.width);
		this.y = -this.height;
		this.markedDeletion = false;
	}
	update(){
		this.y += this.velocity;
		if(this.y > canvas.height){
			this.markedDeletion = true;
		}
	}
	draw(){
		ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
	}
}

class Jet{
	constructor(){
		this.image = new Image();
		this.image.src = 'img/jet.png';
		this.width = 456/3;
		this.height = 456/3;
		this.velocity = 5;
		this.velX = 0; 
		this.x = canvas.width/2 - this.width /2;
		this.y = 400;
	}
	update(){
		this.x += this.velX;
	}
	draw(){
		ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
	}
	Shoot(){
		let laserX = this.x + this.width/2 - Laser.width/2;
		let laserY = this.y + Laser.height/2;
		laser.push(new Laser(laserX, laserY));
	}
}

let laser = [];
let meteorids = [];
let player = new Jet();

timeToNextMeteorid = 0;
meteoridInterval = Math.random() * (2000) + 1000;

window.addEventListener('click', function(){
	player.Shoot();
});
window.addEventListener('keydown', function(e){
	if (e.key == 'ArrowRight' || e.key == 'd') {
		player.velX = player.velocity;
	}
	if (e.key == 'ArrowLeft' || e.key == 'a') {
		player.velX = -player.velocity;
	}
});
window.addEventListener('keyup', function(e){
	if (e.key == 'ArrowRight' || e.key == 'd') {
		player.velX = 0;
	}
	if (e.key == 'ArrowLeft' || e.key == 'a') {
		player.velX = 0;
	}
});

function animate(timestamp){
	ctx.clearRect(0,0,canvas.width, canvas.height);
	ctx.fillStyle = '#0d1654';
	ctx.fillRect(0,0,canvas.width,canvas.height);

	let deltaTime = timestamp - lastTime;
	timeToNextMeteorid += deltaTime;

	// spawning meteorid
	if(timeToNextMeteorid > meteoridInterval){
		timeToNextMeteorid = 0;
		meteoridInterval = meteoridInterval = Math.random() * (500) + 100;
		meteorids.push(new Meteorid());
	}

	// check collision beetwen meteorid and laser
	for(let i = 0; i < laser.length; i++){
		for(let j = 0; j < meteorids.length; j++){
			if(checkCollision(laser[i], meteorids[j])){
				meteorids[j].markedDeletion = true;
				laser[i].markedDeletion = true;
			}
		}
	}

	// check collision beetwen meteorid and player
	for(let i = 0; i < meteorids.length; i++){
		if(checkCollision(player, meteorids[i])){
			LoseScene.hidden = false;
		}
	}

	// laser from player
	[...laser].forEach(object => object.update());
	[...laser].forEach(object => object.draw());
	laser = laser.filter(object => !object.markedDeletion);

	// meteorid
	[...meteorids].forEach(object => object.update());
	[...meteorids].forEach(object => object.draw());
	meteorids = meteorids.filter(object => !object.markedDeletion);

	player.update();
	player.draw();
	
	lastTime = timestamp;
	requestAnimationFrame(animate);
}

function checkCollision(obj1, obj2){
	if(	obj1.x + obj1.width > obj2.x &&
		obj1.x < obj2.x + obj2.width &&
		obj1.y + obj1.height > obj2.y &&
		obj1.y < obj2.y + obj2.height
	){
		return true;
	} else{
		return false;
	}
}

