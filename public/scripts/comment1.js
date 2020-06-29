window.onload = function () {
    
    const commentholder = document.getElementById('comment-holder')
    
    commentholder.addEventListener('keypress',function(e){
        if(commentholder.hasChildNodes(e.target)){
            if(e.key == 'Enter'){
                let commentId = e.target.dataset.comment   
                let value = e.target.value
                                    
                if(value){
                    let data = {
                        body : value
                    }
                    let req = generateRequest(`/api/comment/replies/${commentId}`,'POST',data)
                    fetch(req)
                        .then(res => res.json())
                        .then(data => {      
                            console.log(data);
                                                                             
                            let replyElement = createReplyElement(data)
                            let parent = e.target.parentElement   //parent is a div
                            parent.previousElementSibling.appendChild(replyElement)
                            e.target.value = ''
                        })
                        .catch(e => {
                            console.log(e.message)
                            alert(e.message)                            
                        } )                                       
                }
                else{
                    alert('Plese enter a valid reply')
                }
            }
        }
    }) 
    
}

function generateRequest(url,method,body){
    let headers = new Headers()
    
    headers.append('Accept','Application/JSON')
    headers.append('Content-Type' , 'Application/JSON')

        
    let req= new Request(url,{
        method ,
        headers ,
        body : JSON.stringify(body) ,
        mode : 'cors'
    })
    return req
}

function createReplyElement(reply){
let innerHTML = `
    <img src="${reply.profilePic}" alt="replier Photo" 
    class="align-self-start mr-3 rounded-circle" style="width: 40px;">
    <div class="media-body">
        <p>${reply.body}</p>
    </div>
    `
    let div = document.createElement('div')
    div.className = 'media mt-3' 
    div.innerHTML = innerHTML

    return div 
}
