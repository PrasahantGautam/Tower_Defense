const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d');


// ----------------------------------------------------------------------------------------------------------------------------------------------------

canvas.width = 1280
canvas.height = 768

ctx.fillStyle = 'white'
ctx.fillRect(0, 0, canvas.width, canvas.height)

const BuildingPlacement2D = []

// -------------------------Converting the cordinates of the places where a building can be placed---------------------------------------------------------------

for(let i = 0; i < BuildingPlacementData.length; i+= 20)
    BuildingPlacement2D.push(BuildingPlacementData.slice(i, i + 20))


const BuildingPlacement = []
BuildingPlacement2D.forEach((row, y) => {
    row.forEach((symbol, x) => {
        // adding building here using the Building class
        if(symbol === 14){
            BuildingPlacement.push(
                new PlacementTile( 
                    {
                position: {x: x * 64,
                            y: y * 64
                        }
                })
            )
        }
    })
})


// ----------------------Loading the image on the canvas--------------------------------------------------------------------------------------------------------

const image = new Image()
image.onload = () => { animate()}
image.src = 'Images/Map.png'

// ----------------------------Creating Enemies------------------------------------------------------------------------------------------------------------------

const enemies = []
function spawnEnemies(spawnCount){
    for(let i = 1; i < spawnCount; i++){
        const xOffest = i * 150
        enemies.push(new Enemy( {
            position:  {
                x: wayPoints[0].x - xOffest,
                y: wayPoints[0].y
                }
            })
        )
    }

}



const buildings = []
let activeTile = undefined
let spawnCount = 3
let hearts = 10
let coins = 100
const explosions = []

spawnEnemies(spawnCount)

function animate(){
    const animationId = requestAnimationFrame(animate)

    ctx.drawImage(image, 0, 0)
    for(let i = enemies.length - 1; i >= 0; i--){
        const enemy = enemies[i]
        enemy.update()

        if(enemy.position.x > canvas.width){
            hearts -= 1
            enemies.splice(i, 1)
            document.querySelector('#hearts').innerHTML = hearts

            if(hearts === 0){
                 console.log('game over');
                 cancelAnimationFrame(animationId)
                 document.querySelector('#gameOver').style.display = 'flex'
            }
        }
    }

    for(let i = explosions.length - 1; i >= 0; i--) {
        const explosion = explosions[i]
        explosion.draw()                                 // explosion effect animation
        explosion.update()

        console.log(explosion.parts.current , explosion.parts.maxParts);
        if(explosion.parts.current >= explosion.parts.maxParts - 1){

            explosions.splice(i, 1)
        }
    }
// tracking the number of enmies
    if(enemies.length === 0) {
        spawnCount += 2
        spawnEnemies(spawnCount)  
    }

    BuildingPlacement.forEach(building => {             // building ----> tile
        building.update(mouse)
    })

    buildings.forEach(building => {
        building.update()
        building.target = null

        const validEnemies = enemies.filter(enemy => {
            const xDifference = enemy.center.x - building.center.x
            const yDifference = enemy.center.y - building.center.y
            const distance = Math.hypot(xDifference, yDifference)

            return distance < enemy.radius + building.radius
        })
        building.target = validEnemies[0]
        // console.log(validEnemies);

        for(let i = building.projectiles.length - 1; i >= 0; i--){
            const projectile = building.projectiles[i]
            projectile.update()

            const xDifference = projectile.enemy.center.x - projectile.position.x
            const yDifference = projectile.enemy.center.y - projectile.position.y

            const distance = Math.hypot(xDifference, yDifference)

            //  when projectile hits the enemy
            if(distance < projectile.enemy.radius + projectile.radius){

                //enemy health and removing the enemy
                projectile.enemy.health -= 20
                if(projectile.enemy.health <= 0){
                    const enemyIndex =  enemies.findIndex((enemy) => {
                      return projectile.enemy === enemy  
                    })
                    if(enemyIndex > -1){     // in case the above function return -1
                        enemies.splice(enemyIndex, 1)
                        coins += 25
                        document.querySelector('#coins').innerHTML = coins
                    }

                }
                    explosions.push(new Sprite( {        // populating the explaion animation array
                        position: {x: projectile.position.x, y: projectile.position.y}, 
                        imgSrc: "Images/explosion.png",
                        parts: {maxParts: 4},
                        offSet: { x: 0, y: 0}
                    }))
                    building.projectiles.splice(i, 1)
            }
        }
        } 
    )
}

// -----------------------------------EventHandler_for_colliding_with the building placable postions-------------------------------------------------------------------

const mouse = {
    x: undefined,
    y: undefined
}

canvas.addEventListener('click',(event) => {
    if(activeTile && !activeTile.isOccupied && coins - 50 >= 0) {
        coins -= 50
        document.querySelector('#coins').innerHTML = coins
        buildings.push
            (new Building({
                position: {
                    x: activeTile.position.x,
                y: activeTile.position.y           
              }
          })
       )
       console.log(buildings);
       activeTile.isOccupied = true
    }

})
window.addEventListener('mousemove', (event) => {
    mouse.x = event.clientX
    mouse.y = event.clientY

    activeTile = null
    for(let i = 0; i < BuildingPlacement.length; i++){
        const tile = BuildingPlacement[i]
        if(mouse.x > tile.position.x && mouse.x < tile.position.x + tile.size &&
            mouse.y > tile.position.y && mouse.y < tile.position.y + tile.size)
            {
                activeTile = tile
                break;
            }
    }
})