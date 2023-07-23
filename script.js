// how you do anything is how you do everything

const roads = [
    "Alice's House-Bob's House",
    "Alice's House-Cabin",
    "Alice's House-Post Office",
    "Bob's House-Town Hall",
    "Daria's House-Ernie's House", 
    "Daria's House-Town Hall",
    "Ernie's House-Grete's House", 
    "Grete's House-Farm",
    "Grete's House-Shop",
    "Marketplace-Farm",
    "Marketplace-Post Office",
    "Marketplace-Shop",
    "Marketplace-Town Hall",
    "Shop-Town Hall"
];

//edges are in this case the endpoints on a road
function buildGraph(edges)
{
    let graph = Object.create(null);
    function addEdge(from, to)
    {
        if (graph[from] == null)
        {
            graph[from] = [to];
        }
        else
        {
            graph[from].push(to);
        }
    }

    for (let [from, to] of edges.map((element) => element.split("-")))
    {
        addEdge(from, to);
        addEdge(to, from);
    }
    return graph;
}

const roadGraph = buildGraph(roads);

class VillageState 
{
    constructor(place, parcels)
    {
        this.place = place;
        this.parcels = parcels;
    }
    move(destination)
    {
        if (!roadGraph[this.place].includes(destination))
        {
            return this;
        }
        else
        {
            let parcels = this.parcels.map((p) => {
                if (p.place != this.place) return p;
                return {place: destination, address: p.address};
            }).filter((p) => p.place != p.address);
            return new VillageState(destination, parcels);
        }
    }

    //static function to create state with random parcel array
    static random(parcelCount = 5)
    {
        let parcels = [];
        for (let i = 0; i < parcelCount; ++i)
        {
            let address = randomPick(Object.keys(roadGraph));
            let place;
            do {
                place = randomPick(Object.keys(roadGraph));
            } while (place == address);
            parcels.push({place, address});
        }
        return new VillageState("Post Office", parcels);
    }
}

function runRobot(state, robot, memory)
{
    for (let turn = 0;; turn++)
    {
        if (state.parcels.length == 0)
        {
            console.log(`Done in ${turn} turns`);
            break;
        }
        let action = robot(state, memory);
        state = state.move(action.direction);
        memory = action.memory;
        console.log(`Moved to ${action.direction}`);
    }
}

function randomPick(array)
{
    let choice = Math.floor(Math.random() * array.length);
    return array[choice];
}

//random robot

// function randomRobot(state) 
// {
//     return {direction: randomPick(roadGraph[state.place])};
// }

//robot done



// random robot run
// runRobot(VillageState.random(), randomRobot);

//mail route for a strict route following robot
const mailRoute = [
    "Alice's House", 
    "Cabin", 
    "Alice's House", 
    "Bob's House",
    "Town Hall", 
    "Daria's House", 
    "Ernie's House",
    "Grete's House", 
    "Shop", 
    "Grete's House", 
    "Farm",
    "Marketplace", 
    "Post Office"
];

//route robot

function routeRobot(state, memory)
{
    if(memory.length == 0)
    {
        memory = mailRoute;
    }
    return {direction: memory[0], memory: memory.slice(1)};
}

// runRobot(VillageState.random(100), routeRobot, mailRoute);