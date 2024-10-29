let imgHammer;
let imgShards = [];
let shardID = 0;
let imagePathHammer = 'data/hammer.png';
let imagePathShards = [
  'data/head.png',
  'data/arm_left.png',
  'data/arm_right.png',
  'data/foot_right.png',
  'data/leg_left.png',
  'data/leg_right.png',
  'data/torso.png',
];

let hammerPosition;
let hammerFollowing = false; 
let hammerDoubleClicked = false; 
let hammerSize; 
let hammerAngle = 0; 
let hammerRotateBack = false; 
let pulsing = true; 

let shards = []; 
let doubleClickCount = 0; 
const fallSpeed = 4; 

function preload() {
  imgHammer = loadImage(imagePathHammer);
  for (let path of imagePathShards) {
    imgShards.push(loadImage(path));
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);
  textFont('Helvetica');
  textSize(120);
  textStyle(BOLD);
  hammerPosition = { x: width / 2 + 250, y: (height - 200) / 2 };
  hammerSize = 120; 
  for (let shardImage of imgShards) {
    shards.push(new Shard(shardImage, width / 7, height / 10, 380, 760));
  }
}

class Shard {
  constructor(img, x, y, w, h) {
    this.ID = shardID;
    this.img = img;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.falling = false; // Flag to check if shard should fall
    this.rotation = random(TWO_PI); // Rotation angle
    shardID += 1;    
  }

  flyAway() {
    this.x += random(-80, 80);
    this.y += random(-10, 10);
    this.rotation += random(-0.1, 0.1);
  }

  fall() {
    if (this.falling) {
        this.y += fallSpeed; // Move the shard downwards

        // Change this condition to make it fall further down
        if (this.y > height - this.h + 200) { // Adjust the +200 as needed
            this.y = height - this.h + 200; // Set the position
            this.falling = false; // Stop falling
        }
    }
}


  display() {
    push(); // Save current drawing state
    translate(this.x + this.w / 2, this.y + this.h / 2); // Move to shard's position
    image(this.img, -this.w / 2, -this.h / 2, this.w, this.h); // Draw shard
    pop(); // Restore to previous drawing state
  }
}


function draw() {
  background(245, 245, 220);
  fill(0);

  let timeframe = frameCount;

  if (timeframe < 60) {
    text("ART", width / 2, height / 2);
  } else if (timeframe < 120) {
    text("MUST BE", width / 2, height / 2);
  } else if (timeframe < 180) {
    text("DESTRUCTIVE", width / 2, height / 2);
  } else {
    // Shards
    for (let i = 0; i < shards.length; i++) {
      if (hammerDoubleClicked) {
        // If double clicks reach 3, let shards fall
        if (doubleClickCount < 3) {
          shards[i].flyAway(); 
        } else {
          shards[i].fall(); 
          shards[i].falling = true; // Enable falling after three double clicks
          // Stop falling when they reach the bottom
          if (shards[i].y > height - shards[i].h) {
            shards[i].y = height - shards[i].h; // Keep it at the bottom
          }
        }
      }
            shards[i].fall();

      shards[i].display();
    }

    // Hammer following
    if (hammerFollowing) {
      hammerPosition.x = mouseX - hammerSize / 2; 
      hammerPosition.y = mouseY - hammerSize / 2; 
    }

    // Pulsing hammer
    if (pulsing) {
      hammerSize = map(sin(frameCount * 0.05), -1, 1, 100, 150);
    } else {
      hammerSize = 120; 
    }

    // Hammering movement
    if (hammerDoubleClicked) {
      hammerAngle += 12; 
      if (hammerAngle >= 120) {
        hammerRotateBack = true; 
        hammerDoubleClicked = false; 
      }
    }

    // Rotate back 
    if (hammerRotateBack) {
      hammerAngle -= 12; 
      if (hammerAngle <= 0) {
        hammerAngle = 0;
        hammerRotateBack = false; 
      }
    }

    push();
    translate(hammerPosition.x + hammerSize / 2, hammerPosition.y + hammerSize / 2); 
    rotate(radians(hammerAngle)); 
    image(imgHammer, -hammerSize / 2, -hammerSize / 2, hammerSize, hammerSize); 
    pop(); 

    // Instruction
    let rectX = width / 2 + 80;
    let rectY = height / 7;
    let rectWidth = 500;
    let rectHeight = 150;

    fill(255, 182, 193);
    rect(rectX, rectY, rectWidth, rectHeight, 20);
    fill(0);
    textSize(30);
    let textX = rectX + rectWidth / 2;
    let textY = rectY + rectHeight / 2;
    text("Break the pieces with the hammer!", textX, textY);
  }
}

function mousePressed() {
  hammerFollowing = true; 
  pulsing = false; 
}

function doubleClicked() {
  hammerDoubleClicked = true; 
  doubleClickCount += 1; // Increment double click count
}

function mouseReleased() {
  hammerFollowing = false; 
}
