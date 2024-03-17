

function loadNewTemplate(newTemplateID, destination, empty = false){

    const newTemplate = document.getElementById(newTemplateID);
    
    if(newTemplate.content){
        const clone = newTemplate.content.cloneNode(true);
        if(empty){
            emptyContainer(destination);
        }
        destination.appendChild(clone);
    } else{
        console.log("The browser does not support templates!")
    }

}

function emptyContainer(element){
    let child = element.firstChild;
    while(child){
        element.removeChild(child);
        child = element.firstChild;
    }
}
