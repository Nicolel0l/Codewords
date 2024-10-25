let imgPieces = [];
let imgScissors;
let scissorsX, scissorsY;
let scissorsWidth, scissorsHeight;
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
"THEY", "STAND FOR", "PROGRESS", "ART", "MUST BE", "DESTRUCTIVE", 
"AND", "CONSTRUCTIVE"];

let pieces = []; 

function preload() {
    for (let i = 0; i < imagePathPieces.length; i++) {
        imgPieces.push(loadImage(imagePathPieces[i]));
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

    textPositions.push(createVector(width / 2, height / 2 - 160));
    textPositions.push(createVector(width / 2, height / 2 - 90));
    textPositions.push(createVector(width / 2, height / 2 + 60));
    textPositions.push(createVector(width / 2, height / 2 + 130));
    textPositions.push(createVector(width / 2, height / 2 + 280));
}



class Piece {
    constructor(x, y, xSpeed, ySpeed, img) {
        this.x = x;
        this.y = y;
        this.xSpeed = xSpeed;
        this.ySpeed = ySpeed;
        this.img = img;
    }

    move() {
        this.x += this.xSpeed;
        if (this.x < 0 || this.x > width) {
            this.xSpeed *= -1;
        }

        this.y += this.ySpeed;
        if (this.y < 0 || this.y > height) {
            this.ySpeed *= -1;
        }
    }

    display() {
        image(this.img, this.x, this.y);
    }
}

class Constructive {
    constructor(x, y, size, word, speed) {
        this.x = x;
        this.y = y;
        this.textSize = size;
        this.speed = speed;
        this.word = word;

        this.colors = [
            color(254, 255,194),
            color(247, 64, 0)  
        ];
        this.color = random(this.colors);

        this.shadowColor = color(0, 0, 0, 200); 
        this.shadowOffsetX = 5; 
        this.shadowOffsetY = 5; 
    }

    randomizeSize() {
        this.textSize = random(20, 200); 
    }

    display() {
        fill(this.shadowColor);
        textSize(this.textSize);
        text(this.word, this.x + this.shadowOffsetX, this.y + this.shadowOffsetY);

        fill(this.color);
        text(this.word, this.x, this.y);
    }
}


function draw() {
    background(0);

    if (showScissors) {
        displayImages();
        displayText(); 
    } 

    if (!showScissors) {
        for (let i = 0; i < pieces.length; i++) {
            pieces[i].move();
            pieces[i].display();
        }
        displayText(); 
    }

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
            imageMode(CENTER);
            image(img, 0, 0, imgWidth, imgHeight);
            pop();
        } else {
            image(img, (width - imgWidth) / 2, (height - imgHeight) / 2, imgWidth, imgHeight);
        }
    }

    if (showScissors) {
        drawDashedLine(50, height - 800, width - 30, height - 100, 10, 10);
        scissorsWidth = 170;
        scissorsHeight = (scissorsWidth / imgScissors.width) * imgScissors.height;
        image(imgScissors, scissorsX - 30, scissorsY - 20, scissorsWidth, scissorsHeight);
    }
}

function drawDashedLine(x1, y1, x2, y2, dashLength, gapLength) {
    setLineDash([dashLength, gapLength]);
    line(x1, y1, x2, y2); 
}

function setLineDash(list) {
    drawingContext.setLineDash(list); 
}


function breakTexts() {
    for (let i = 0; i < textPositions.length; i++) {
        textPositions[i].x = random(0, width);
        textPositions[i].y = random(0, height);
    }
}

function mousePressed() {
    if (getAudioContext().state !== 'running') {
        getAudioContext().resume();
    }

    if (showScissors && mouseX >= scissorsX && mouseX <= scissorsX + scissorsWidth &&
        mouseY >= scissorsY && mouseY <= scissorsY + scissorsHeight) {
      
        breakTexts();
        showScissors = false;
        if (cuttingSound.isLoaded()) {
            cuttingSound.play();  
        }
        activatePieces();  
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

function activatePieces() {
    for (let i = 0; i < imgPieces.length; i++) {
        pieces.push(new Piece(random(width), random(height), random(-3, 3), random(-3, 3), imgPieces[i]));
    }
}
