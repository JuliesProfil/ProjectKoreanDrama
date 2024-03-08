

function loadNewTemplate(newTemplateID, destination, empty = false){

    const newTemplate = document.getElementById(newTemplateID);
    
    if(newTemplate.content){
        const clone = newTemplate.content.cloneNode(true);

        if(empty){
            emptyContainer(destination);
        }

        destination.appendChild(clone);
    } else{
        console.log("Your browser does not support newTemplates!")
    }

}

function emptyContainer(element){
    let child = element.firstChild;
    while(child){
        element.removeChild(child);
        child = element.firstChild;
    }
}
