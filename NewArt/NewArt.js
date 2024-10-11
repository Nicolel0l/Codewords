let imgPieces = [];
let imgScissors;
let scissorsX, scissorsY;
let scissorsWidth, scissorsHeight;
let fallingImages = [];
let rotationSpeed = radians(10);
let showScissors = true;

function preload() {
    imgPieces.push(loadImage('data/piece1.png'));
    imgPieces.push(loadImage('data/piece2.png'));
    imgPieces.push(loadImage('data/piece3.png')); 
    imgPieces.push(loadImage('data/piece4.png')); 
    imgPieces.push(loadImage('data/piece5.png')); 
    imgPieces.push(loadImage('data/piece6.png')); 
    imgPieces.push(loadImage('data/piece7.png')); 
    imgPieces.push(loadImage('data/piece8.png')); 
    imgPieces.push(loadImage('data/piece9.png')); 
    imgPieces.push(loadImage('data/piece10.png')); 
    imgPieces.push(loadImage('data/piece11.png')); 
    imgPieces.push(loadImage('data/piece12.png')); 
    imgPieces.push(loadImage('data/piece13.png')); 
    imgPieces.push(loadImage('data/piece14.png')); 
    imgPieces.push(loadImage('data/piece15.png')); 
    imgPieces.push(loadImage('data/piece16.png')); 
    imgPieces.push(loadImage('data/piece17.png'));
    imgScissors = loadImage('data/scissorsGif.gif');
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    background(255, 255, 255);
    scissorsX = (width - 100) - 50; 
    scissorsY = height - 150;
}

function draw() {
    background(255);  

    displayImages();  
    displayText(); 

    updateFallingImages();  
}

function displayText() {
    textAlign(CENTER);
    fill(247,64,0);
    textFont('Helvetica');
    textStyle(BOLD);

    textSize(170);
    text('ART', width / 2, height / 2 - 130);

    textSize(60);
    text('MUST BE', width / 2, height / 2 - 60);

    textSize(170);
    text('DESTRUCTIVE', width / 2, height / 2 + 90);

    textSize(60);
    text('AND', width / 2, height / 2 + 160);

    textSize(170);
    text('CONSTRUCTIVE', width / 2, height / 2 + 310);
}

function displayImages() {
    for (let img of imgPieces) {
        let imageRatio = img.width / img.height;
        let imgWidth, imgHeight;

        if (width / height < imageRatio) {
            imgWidth = width;
            imgHeight = width / imageRatio;
        } else {
            imgHeight = height;
            imgWidth = height * imageRatio;
        }

        if (img.position) {
            push();
            translate(img.position.x, img.position.y);
            rotate(img.rotation);
            imageMode(CENTER);
            image(img, 0, 0, imgWidth, imgHeight);
            pop();
        } else {
            image(img, (width - imgWidth) / 2, (height - imgHeight) / 2, imgWidth, imgHeight);
        }
    }

    // Draw dashed line and scissors
    drawDashedLine(50, height - 800, width - 30, height - 100, 10, 10);

    scissorsWidth = 150; 
    scissorsHeight = (scissorsWidth / imgScissors.width) * imgScissors.height;
    image(imgScissors, scissorsX-10, scissorsY-20, scissorsWidth, scissorsHeight);
}

function drawDashedLine(x1, y1, x2, y2, dashLength, gapLength) {
    let totalLength = dist(x1, y1, x2, y2);
    let numDashes = floor(totalLength / (dashLength + gapLength));

    for (let i = 0; i < numDashes; i++) {
        let startX = lerp(x1, x2, (i * (dashLength + gapLength)) / totalLength);
        let startY = lerp(y1, y2, (i * (dashLength + gapLength)) / totalLength);
        
        let endX = startX + cos(atan2(y2 - y1, x2 - x1)) * dashLength;
        let endY = startY + sin(atan2(y2 - y1, x2 - x1)) * dashLength;
        
        line(startX, startY, endX, endY);
    }
}

function randomizeImages() {
    for (let img of imgPieces) {
        let randomX = random(width);
        let randomY = random(height);
        let randomRotation = random(TWO_PI); 
        
        img.position = createVector(randomX, randomY);
        img.rotation = randomRotation;
        fallingImages.push({ image: img, speed: random(7, 9) });
    }
    setTimeout(displayBlankPage, 3000); 
}

function updateFallingImages() {
    for (let i = fallingImages.length - 1; i >= 0; i--) {
        let fallingImage = fallingImages[i];
        fallingImage.image.position.y += fallingImage.speed;
        if (fallingImage.image.position.y > height+800) {
            fallingImages.splice(i,1); 
        }
    }
}

function displayBlankPage() {
    background(255);
    noLoop();
}

function mousePressed() {
    if (mouseX >= scissorsX && mouseX <= scissorsX + scissorsWidth &&
        mouseY >= scissorsY && mouseY <= scissorsY + scissorsHeight) {
        randomizeImages();  // Start breaking the images when the scissors are clicked
    showScissors = false;  // Hide the scissors and dashed line
    
    }
}
