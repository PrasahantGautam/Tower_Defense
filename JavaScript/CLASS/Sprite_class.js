class Sprite {
    constructor(
        { 
            position = { x: 0, y: 0}, 
            imgSrc, 
            parts = {maxParts: 1},
            offSet = {x: 0, y: 0} 
        })
    {
        this.position = position
        this.image = new Image()
        this.image.src = imgSrc
        this.parts = {
            maxParts: parts.maxParts,
            current: 0,
            elapsed: 0
        }
        this.offSet = offSet

    }

    draw() {
        const cropWidth =  this.image.width / this.parts.maxParts
        const crop = {
            position: {
                x: cropWidth * this.parts.current, 
                y: 0
            },
            width: cropWidth,
            height: this.image.height
        }
        ctx.drawImage(
            this.image,
            crop.position.x,
            crop.position.y,
            crop.width,
            crop.height,
            this.position.x + this.offSet.x,        //these last four arguments decide where the building is placed
            this.position.y + this.offSet.y,
            crop.width,
            crop.height
            )
    }

    update() {
        this.parts.elapsed++
    if(this.parts.elapsed % 3 === 0)        // to slow down animation
        this.parts.current++

    if(this.parts.current >= this.parts.maxParts){      // to reset the animation
        this.parts.current = 0
    }
    }

}