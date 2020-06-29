window.onload = function() {
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

}

