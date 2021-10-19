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
             const descriptionH3 = document.createElement("h3")
             const checklistH3 = document.createElement("h3")
             const newP = document.createElement('p')
             const newul = document.createElement('ul')

             descriptionH3.appendChild(document.createTextNode('Description'))
             checklistH3.appendChild(document.createTextNode('Checklist'))
             newP.appendChild(document.createTextNode(data.description))

             newdiv.appendChild(descriptionH3)
             newdiv.appendChild(newP)
             newdiv.appendChild(checklistH3)

             for(item in data.checklist){
                let newInput = document.createElement("input")
                let newli = document.createElement('li')
                newInput.setAttribute('type', 'checkbox')
                
                console.log(item)
                if(data.checklist[item].isChecked){newInput.setAttribute('checked', '')}
                newInput.setAttribute('disabled', '')
                newli.appendChild(newInput)
                newli.appendChild(document.createTextNode(data.checklist[item].title))
                newul.appendChild(newli)
             }

            newdiv.appendChild(newul)
            event.target.parentNode.appendChild(newdiv)
            //console.log(data.checklist)
        } catch (error) {
            console.log(error)
        }
    }
    
}