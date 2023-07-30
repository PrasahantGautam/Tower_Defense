class Building extends Sprite {

    constructor({position = {x: 0, y: 0}}) {
        super(
            {
                position, 
                imgSrc: "Images/tower.png", 
                parts: {maxParts: 19},
                offSet: {x: 0, y: -80}
            })

        this.position = position
        this.width = 64 * 2
        this.height = 64
        this.center = {
            x: this.position.x + this.width/2,
            y: this.position.y + this.height/2
        }
        this.projectiles = []
        this.radius = 250
        this.target
        this.frames = 0
    }

    draw() {
        super.draw()

        // range for the tower in which it can shoot
        ctx.beginPath()
        ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(0,0,255, 0)'
        ctx.fill()
    }


    update() {
        this.draw()

        // if there is any enemy in the range or when there is not any enemy but tower is stuck 
        //  into animation so we have to make it into the oginal intial position so it doesn't look weird
        if(this.target || !this.target && this.parts.current !== 0)
            super.update()

        if(this.target && this.parts.current === 6 && this.parts.elapsed % 3 === 0)
            this.shoot()
    }

    
    shoot() {
            this.projectiles.push(new Projectile({
                position: {
                x: this.center.x - 20,      // offset to create projectile form the center
                y: this.center.y - 112
                },
                enemy: this.target
            }))
        this.frames++
    }
}