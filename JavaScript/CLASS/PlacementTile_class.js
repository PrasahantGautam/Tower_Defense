class PlacementTile{
    constructor({position = {x: 0, y: 0}}) {
        this.position = position
        this.size = 64     // as each tile has the size of 64px
        this.color = 'rgba(255, 255, 255, 0.25)'
        this.occupied = false
    }

    drawingBuilding() {
        ctx.fillStyle = this.color
        ctx.fillRect(this.position.x, this.position.y, this.size, this.size)
    }

    update(mouse) {
        this.drawingBuilding()

        if(mouse.x > this.position.x && mouse.x < this.position.x + this.size &&
            mouse.y > this.position.y && mouse.y < this.position.y + this.size){
                // console.log('collllide');
                this.color = 'white'
            }
        else
            this.color = 'rgba(255,255,255,0.25)'

    }
}