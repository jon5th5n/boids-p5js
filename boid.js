class Boid {
    constructor() {
        this.position = createVector(random(width), random(height));
        this.speedModifier = random(0, 2);
        this.speed = speedSlider.value() + this.speedModifier;
        this.velocity = createVector(random(-this.speed, this.speed), random(-this.speed, this.speed));
        this.perceptionRadius = 50;
        this.size = 10; 
        this.seperationForce = 0.08;
        this.alignmentForce = 0.1;
        this.cohesionForce = 0.06;
    }

    display() {
        ellipse(this.position.x, this.position.y, this.size);
    }

    update(flock) {
        let acceleration = createVector(0, 0)

        let seperationSteer = this.seperate(flock);
        acceleration.add(seperationSteer);

        let alignmentSteer = this.align(flock);
        acceleration.add(alignmentSteer);

        let cohesionSteer = this.cohese(flock);
        acceleration.add(cohesionSteer);


        // avoidObstacles();

        //---
        if(this.position.x < 0) this.position.x = width;
        else if(this.position.x > width) this.position.x = 0;
        if(this.position.y < 0) this.position.y = height;
        else if(this.position.y > height) this.position.y = 0;
        //---

        this.velocity.add(acceleration);
        this.velocity.setMag(this.speed);
        this.position.add(this.velocity);
    }



    seperate(flock) {
        let desiredDirection = createVector();

        let total = 0;
        for(let boid of flock) {
            let d = this.position.dist(boid.position);
            if(boid === this || d >= this.perceptionRadius) continue;
            let diff = p5.Vector.sub(this.position, boid.position)
            diff.setMag(this.perceptionRadius - diff.mag());
            desiredDirection.add(diff);
            total++;
        }

        if(total > 0) desiredDirection.div(total);
        else return createVector(0, 0);

        if(forceArrowsCheckbox.checked()) {
            stroke(0, 0, 255)
            line(this.position.x, this.position.y, this.position.x + desiredDirection.x, this.position.y + desiredDirection.y)
        }

        let steer = p5.Vector.sub(desiredDirection, this.velocity)
        steer.setMag(this.seperationForce);
        return steer;
    }

    align(flock) {
        let desiredDirection = createVector();

        let total = 0;
        for(let boid of flock) {
            if(boid === this || this.position.dist(boid.position) >= this.perceptionRadius) continue;
            desiredDirection.add(normalizeVector(boid.velocity));
            total++;
        }

        if(total <= 0) return createVector();

        desiredDirection.normalize();

        
        if(forceArrowsCheckbox.checked()) {
            stroke(255, 0, 0);
            line(this.position.x, this.position.y, this.position.x + desiredDirection.x * 30, this.position.y + desiredDirection.y * 30);
        }

        let steer = (p5.Vector.sub(desiredDirection, (normalizeVector(this.velocity))));
        steer.setMag(this.alignmentForce);
        return steer;
    }

    cohese(flock) {
        let desiredPosition = createVector();

        let total = 0;
        for(let boid of flock) {
            if(boid === this || this.position.dist(boid.position) >= this.perceptionRadius) continue;
            desiredPosition.add(boid.position);
            total++;
        }

        let steer;

        if(total > 0) desiredPosition.div(total);
        else desiredPosition = this.position;

        let desiredDirection = p5.Vector.sub(desiredPosition, this.position);

        if(forceArrowsCheckbox.checked()) {
            stroke(0, 255, 0);
            line(this.position.x, this.position.y, this.position.x + desiredDirection.x, this.position.y + desiredDirection.y);
        }

        steer = p5.Vector.sub(desiredDirection, this.velocity);
        steer.setMag(this.cohesionForce);
        return steer;
    }

    avoidObstacled() {
        //--
    }
}