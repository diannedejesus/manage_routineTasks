let getPlannerTasks = document.querySelectorAll('.plannerLink')

getPlannerTasks.forEach(el => el.addEventListener('click', getTasks))

async function getTasks(event){
    //console.log(event.srcElement.dataset.id)

    try {
        const results = await fetch(`/planner/getTasks?${event.srcElement.dataset.id}`, {
            method: 'GET',
            headers: {'Content-type': 'application/json'},
        })

        const data = await results.json()
        //console.log(event.target.parentNode)
        const newUl = document.createElement("ul");
        const newli = []
        let i = 0

        for(items of data.value){
            //console.log(items.title)
            let thisitem = document.createElement("li");
            thisitem.appendChild(document.createTextNode(items.title))
            newli.push(thisitem)
            i++
        }
        for(items of newli){
            newUl.appendChild(items)
        }
        event.target.parentNode.appendChild(newUl)
        console.log(newli)
    } catch (error) {
        console.log(error)
    }
}