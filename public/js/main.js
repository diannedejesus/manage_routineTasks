let getPlannerTasks = document.querySelectorAll('.plannerLink')
//let getTaskDetails = document.querySelectorAll('.taskLink')

getPlannerTasks.forEach(el => el.addEventListener('click', getTasks))
//getTaskDetails.forEach(el => el.addEventListener('click', getDetails))

async function getTasks(event){

    if(event.target.parentNode.children.length > 1){
        event.target.parentNode.removeChild(event.target.parentNode.children[1])
    }else{
        try {
            const results = await fetch(`/planner/getTasks?${event.srcElement.dataset.id}`, {
                method: 'GET',
                headers: {'Content-type': 'application/json'},
            })
    
            const data = await results.json()
            
            const newUl = document.createElement("ul");
            const newli = []
    
            for(items of data.value){
                //console.log(items)
                let newListItem = document.createElement("li")
                let newLink = document.createElement("a")
                newLink.classList.add('taskLink')
                newLink.setAttribute('data-id', items.id)
                newLink.addEventListener('click', getDetails)
                newLink.appendChild(document.createTextNode(items.title))
                newListItem.appendChild(newLink)
                newli.push(newListItem)
            }
            for(items of newli){
                newUl.appendChild(items)
            }
            event.target.parentNode.appendChild(newUl)
            //console.log(newli)
        } catch (error) {
            console.log(error)
        }
    }
    
}

async function getDetails(event){
    console.log('details')
    if(event.target.parentNode.children.length > 1){
        event.target.parentNode.removeChild(event.target.parentNode.children[1])
    }else{
        try {
            const results = await fetch(`/planner/getSingleTask?${event.srcElement.dataset.id}`, {
                method: 'GET',
                headers: {'Content-type': 'application/json'},
            })
    
            const data = await results.json()
            
             const newdiv = document.createElement("div")
             const newP = document.createElement('p')
             newP.appendChild(document.createTextNode(data.description))
             newdiv.appendChild(newP)
             for(item in data.checklist){
                let newInput = document.createElement("input")
                newInput.setAttribute('type', 'checkbox')
                newdiv.appendChild(newInput)
                newdiv.appendChild(document.createTextNode(data.checklist[item].title))
             }
            // const newli = []
    
            // for(items of data.value){
            //     //console.log(items.title)
            //     let newListItem = document.createElement("li")
            //     let newLink = document.createElement("a")
            //     newLink.appendChild(document.createTextNode(items.title))
            //     newListItem.appendChild(newLink)
            //     newli.push(newListItem)
            // }
            // for(items of newli){
            //     newUl.appendChild(items)
            // }
            event.target.parentNode.appendChild(newdiv)
            console.log(data.checklist)
        } catch (error) {
            console.log(error)
        }
    }
    
}