let img;  
let circleX, circleY, circleDiameter;
let broken = false;
let slices = [];
let numSlices = 10;  


function preload() {
  img = loadImage('images/head1.png');
}

function setup() {
  createCanvas(300, 300);
  circleX = width / 2;
  circleY = height / 2;
  circleDiameter = 200;  
}

function draw() {
  clear();  
  
  if (broken) {
    for (let slice of slices) {
      slice.update();
      slice.display();
    }
  } else {
    imageMode(CENTER);
    image(img, circleX, circleY, circleDiameter, circleDiameter);
  }
}

function mousePressed() {
  let d = dist(mouseX, mouseY, circleX, circleY);
  if (d < circleDiameter / 2 && !broken) {
    breakIcon();
    broken = true;
  }
}

function breakIcon() {
  let angleStep = TWO_PI / numSlices;
  
  for (let i = 0; i < numSlices; i++) {
    let startAngle = i * angleStep;
    let speed = random(1, 15);
  
    let sliceWidth = circleDiameter / numSlices;
    let sliceHeight = circleDiameter;
    let sliceX = circleX + cos(startAngle) * (circleDiameter / 4);
    let sliceY = circleY + sin(startAngle) * (circleDiameter / 4);
    
    let slice = new IconSlice(sliceX, sliceY, sliceWidth, sliceHeight, startAngle, speed);
    slices.push(slice);
  }
}

class IconSlice {
  constructor(x, y, width, height, angle, speed) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.angle = angle;
    this.speed = speed;
    this.xSpeed = cos(angle) * speed;
    this.ySpeed = sin(angle) * speed;
  }
  
  update() {
    this.x += this.xSpeed;
    this.y += this.ySpeed;
  }
  
  display() {
    push();
    translate(this.x, this.y);
    rotate(this.angle);
    imageMode(CENTER);
    // Display the slice of the image
    let sliceX = (this.angle / TWO_PI) * img.width;
    let sliceWidth = img.width / slices.length; 
    image(img, 0, 0, sliceWidth, this.height, sliceX, 0, sliceWidth, img.height);
    pop();
  }
}
