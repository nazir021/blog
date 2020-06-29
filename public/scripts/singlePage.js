window.onload = function(){

    const bookmarks = document.getElementsByClassName('bookmark');
    [...bookmarks].forEach(bookmark=>{
        bookmark.style.cursor = 'pointer'
        bookmark.addEventListener('click',function(e){
            let target = e.target.parentElement

            let headers = new Headers()
            headers.append('Accept','Application/JSON')

            let req = new Request(`/api/bookmarks/${target.dataset.post}`,{
                method:'GET',
                headers,
                mode:'cors',
            })
            fetch(req)
            .then(res=>res.json())
            .then(data=>{
                if(data.bookmark){
                    target.innerHTML = '<i class="fas fa-bookmark"></i>'
                }else{
                    target.innerHTML = '<i class="far fa-bookmark"></i>'
                }
            })
            .catch(err=>{
                console.log(err.response.data)
                alert(err.response.data.error)
            })
        })
    })

    const comment = document.getElementById('comment')
    const commentholder = document.getElementById('comment-holder') 

    comment.addEventListener('keypress',function(e){
        if(e.key == 'Enter'){
            if(e.target.value){
                let postId = comment.dataset.post  // but 36 no line
                let data = {
                    body : e.target.value  
                }
                let req = generateRequest(`/api/comment/${postId}`,'POST',data)
                fetch(req)
                .then(res =>res.json() )
                .then(data => {                                        
                    let commentElement = createComment(data)    // get a HTML DOM
                    commentholder.insertBefore(commentElement,commentholder.children[0]) 
                    e.target.value = '' 
                })
                .catch(e => {
                    console.log(e.message)
                    alert(e.message)
                })

            }else{
                alert('Please enter valid comment')
            }
        }
    })

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
                            let parent = e.target.parentElement   
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

    const likeBtn = document.getElementById('likeBtn')
    const dislikeBtn = document.getElementById('dislikeBtn')
    
    likeBtn.addEventListener('click',function(e){
        let postId = likeBtn.dataset.post 
                 
        reqLikeDislike('like',postId) 
        .then(res => res.json())
        .then(data => {                      
            
            let likeText = data.liked ? 'Liked' : 'Like'
            likeText = likeText+ ` ( ${data.totalLike} )`
            let disLikeText = `Dislike ( ${data.totalDisLike} )` 
            
            likeBtn.innerHTML = likeText
            dislikeBtn.innerHTML = disLikeText
        })
        .catch(e =>{
            console.log(e)
            alert(e.response.data.error)              
        })

    })

    dislikeBtn.addEventListener('click',function(e){
        let postId = likeBtn.dataset.post 
                 
        reqLikeDislike('dislike',postId) 
        .then(res => res.json())
        .then(data => {                      
            
            let dislikeText = data.disliked ? 'Disliked' : 'Dislike'
            dislikeText = dislikeText+ ` ( ${data.totalDisLike} )`
            let likeText = `Like ( ${data.totalLike} )` 
            
            likeBtn.innerHTML = likeText
            dislikeBtn.innerHTML = dislikeText
        })
        .catch(e =>{
            console.log(e)
            alert(e.response.data.error)            
        })      
        
    })

}


function generateRequest(url,method,body){
    let headers = new Headers()
    
    headers.append('Accept','Application/JSON')
    headers.append('Content-Type' , 'Application/JSON')
    console.log(JSON.stringify(body))
        
    let req= new Request(url,{
        method ,
        headers ,
        body : JSON.stringify(body) ,
        mode : 'cors'
    })
    return req
}

function createComment(comment){
    let innerHTML = `
    <img
        src = ${comment.user.profilePic}
        class = "rounded-circle mx-3 my-3" style="width:48px";">
        <div class="media-body my-3">
        <p>${comment.body}</p>

        <div class = "my-3">
            <input class="form-control" type="text" placeholder = "Press enter to reply" name="reply" data-comment = ${comment._id}/>
        </div>
    </div>
    
    `
    let div = document.createElement('div')
    div.className = 'media border' 
    div.innerHTML = innerHTML

    return div 
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

    function reqLikeDislike(type,postId){
        let headers = new Headers()
    
        headers.append('Accept','Application/JSON')
        headers.append('Content-Type' , 'Application/JSON')
    
        let req= new Request(`/api/${type}/${postId}`,{
            method : 'GET',
            headers ,
            mode : 'cors'
        })
        return fetch(req) 
}