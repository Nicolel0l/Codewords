let imgPieces = [];
let imgScissors;
let scissorsX, scissorsY;
let scissorsWidth, scissorsHeight;
let fallingImages = [];
let showScissors = true;
let textPositions = [];
let displayedText = '';
let imagePathPieces = [
    'data/piece1.png',
    'data/piece2.png',
    'data/piece3.png',
    'data/piece4.png',
    'data/piece5.png',
    'data/piece6.png',
    'data/piece7.png',
    'data/piece8.png',
    'data/piece9.png',
    'data/piece10.png',
    'data/piece11.png',
    'data/piece12.png',
    'data/piece13.png',
    'data/piece14.png',
    'data/piece15.png',
    'data/piece16.png',
    'data/piece17.png'
];
let cuttingSound;
let placeSound;
let constructiveLetters = [];
let size = 32;
let speed = 1;
let wordIndex = 0;
let customWords = ["WE LOVE", "INSTABILITY AND", "CHAOS", "BECAUSE", 
"THEY", "STAND FOR", "PROGRESS","ART", "MUST BE", "DESTRUCTIVE",
"AND", "CONSTRUCTIVE"];

function preload() {
    for (let i = 0; i < imagePathPieces.length; i++) {
        imgPieces[i] = loadImage(imagePathPieces[i]);
    }
    imgScissors = loadImage('data/scissorsGif.gif');
    cuttingSound = loadSound("data/cutting-paper.mp3");
    placeSound = loadSound("data/place.mp3"); 
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    background(255);
    scissorsX = (width - 100) - 50;
    scissorsY = height - 150;

    // Initialize text positions
    textPositions.push(createVector(width / 2, height / 2 - 130));
    textPositions.push(createVector(width / 2, height / 2 - 60));
    textPositions.push(createVector(width / 2, height / 2 + 90));
    textPositions.push(createVector(width / 2, height / 2 + 160));
    textPositions.push(createVector(width / 2, height / 2 + 310));
}

class Constructive {
    constructor(x, y, size, word, speed) {
        this.x = x;
        this.y = y;
        this.textSize = size;
        this.speed = speed;
        this.word = word;
        this.color = color(0,200); 
    }

   randomizeSize() {
        this.textSize = random(20, 200); 
    }


    display() {
        fill(this.color);
        textSize(this.textSize);
        text(this.word, this.x, this.y);
    }
}

function draw() {
    background(255);
    displayImages();
    displayText();
    updateFallingImages();

   for (let letter of constructiveLetters) {
        letter.display();
    }
}

function displayText() {
    textAlign(CENTER);
    fill(247, 64, 0);
    textFont('Helvetica');
    textStyle(BOLD);

    textSize(170);
    text('ART', textPositions[0].x, textPositions[0].y);

    textSize(60);
    text('MUST BE', textPositions[1].x, textPositions[1].y);

    textSize(170);
    text('DESTRUCTIVE', textPositions[2].x, textPositions[2].y);

    textSize(60);
    text('AND', textPositions[3].x, textPositions[3].y);

    textSize(170);
    text('CONSTRUCTIVE', textPositions[4].x, textPositions[4].y);
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

    if (showScissors) {
        drawDashedLine(50, height - 800, width - 30, height - 100, 10, 10);
        scissorsWidth = 150;
        scissorsHeight = (scissorsWidth / imgScissors.width) * imgScissors.height;
        image(imgScissors, scissorsX - 10, scissorsY - 20, scissorsWidth, scissorsHeight);
    }
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
        fallingImages.push({ image: img, speed: random(2, 4) });
    }

    for (let pos of textPositions) {
        pos.x = random(width);
        pos.y = random(height);
    }
}

function updateFallingImages() {
    for (let i = fallingImages.length - 1; i >= 0; i--) {
        let fallingImage = fallingImages[i];
        fallingImage.image.position.y += fallingImage.speed;
        if (fallingImage.image.position.y > height + 60) {
            fallingImages.splice(i, 1);
        }
    }
}

function displayBlankPage() {
    background(255);
    noLoop();
}

function mousePressed() {
    if (getAudioContext().state !== 'running') {
        getAudioContext().resume();
    }

    // Check if scissors are clicked
    if (mouseX >= scissorsX && mouseX <= scissorsX + scissorsWidth &&
        mouseY >= scissorsY && mouseY <= scissorsY + scissorsHeight) {

        randomizeImages();
        showScissors = false; 
        if (cuttingSound.isLoaded()) {
            cuttingSound.play();  
        }

    } 

    else if (!showScissors) {
        let word = customWords[wordIndex % customWords.length];
        let newConstructive = new Constructive(mouseX, mouseY, size, word, speed);
        newConstructive.randomizeSize();
        constructiveLetters.push(newConstructive);
        wordIndex++;

        if (placeSound.isLoaded()) {
            placeSound.play(); 
        }
    }
}
