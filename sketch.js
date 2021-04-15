let flock = [];
let boidCount = 100;

let speedSlider;
let seperationSlider;
let alignmentSlider;
let cohesionSlider;
let perceptionRadiusSlider;
let boidCountSlider;
let forceArrowsCheckbox;
let nightModeCheckbox;

function setup() {
  createCanvas(windowWidth, windowHeight - 70);


  speedSlider = createSlider(0, 15, 4, 0);
  seperationSlider = createSlider(0, 0.5, 0.08, 0);
  alignmentSlider = createSlider(0, 0.5, 0.1, 0);
  cohesionSlider = createSlider(0, 0.5, 0.06, 0);
  perceptionRadiusSlider = createSlider(0, 500, 50, 0);
  boidCountSlider = createSlider(0, 500, 100, 1);
  forceArrowsCheckbox = createCheckbox('force arrows');
  nightModeCheckbox = createCheckbox('night mode', true);


  for(let i = 0; i < boidCount; i++) {
    flock.push(new Boid);
  }
}

function draw() {
  if(nightModeCheckbox.checked()) background(20);
  else background(240);

  if(boidCountSlider.value() > flock.length) {
    let diff = boidCountSlider.value() - flock.length;
    for(let i = 0; i < diff; i++) {
      flock.push(new Boid);
    }
  }
  else if(boidCountSlider.value() < flock.length) {
    let diff = flock.length - boidCountSlider.value();
    for(let i = 0; i < diff; i++) {
      flock.pop();
    }
  }

  for(let boid of flock) {
    if(speedSlider.value() > 0) boid.speed = speedSlider.value() + boid.speedModifier;
    else boid.speed = 0;
    boid.seperationForce = seperationSlider.value();
    boid.alignmentForce = alignmentSlider.value();
    boid.cohesionForce = cohesionSlider.value();
    boid.perceptionRadius = perceptionRadiusSlider.value();

    boid.update(flock);

    fill(255, 0, 0); stroke(255, 0, 0);
    if(nightModeCheckbox.checked()) fill(255); stroke(255);

    boid.display();
  }
}


//-- helper functions ---------------------------

function normalizeVector(vector) {
  return vector.copy().normalize();
}

//-----------------------------------------------
