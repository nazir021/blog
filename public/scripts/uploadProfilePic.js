window.onload = function(){
    let baseCropping = $('#cropped-image').croppie({
        viewport : {
            width : 200,
            height : 200
        },
        boundary : {
            width : 300 ,
            height : 300
        },
        showZoomer : true
    })

    function readableFile(file){   //grenerate readable file
        let reader = new FileReader()    // by which croppie can read file
        reader.onload = function(event){
            baseCropping.croppie('bind', {
                url : event.target.result
            }).then(() => {
                $('.cr-slider').attr({
                    'min' : 0.5000,
                    'max' : 1.5000
                })
            })
        }
        reader.readAsDataURL(file)  //reading the file as data URL
    }
    
    $('#profilePicFile').on('change', function (e) { 
        if (this.files[0]){     //files ??
            readableFile(this.files[0]) 
            $('#crop-modal').modal({ 
                backdrop: 'static', 
                keyboard: false 
            }) 
        }
    })
    
    $('#cancel-cropping').on('click', function () { 
        $('#crop-modal').modal('hide')
    }) 

    $('#upload-image').on('click',function(){
        baseCropping.croppie('result','blob')
        .then(blob => {
            let formData = new FormData() 
            let file = document.getElementById('profilePicFile').files[0]
            // console.log("file name : "+file.name)  /////////////
            let name = generateFileName(file.name)
            // console.log("name : "+name)
            formData.append('profilePic',blob,name) 

            let headers = new Headers()
            headers.append('Accept','Application/JSON')

            let req = new Request('/uploads/profilePic',{
                method : 'POST',  // req data sends to server
                headers,
                mode : 'cors' ,  //so than no out server can use our server 
                body : formData
            })
            return fetch(req)
        })
        .then(res => res.json() )
        .then(data => {
            document.getElementById('removeProfilePic').style.display='block' 
            document.getElementById('profilePic').src = data.profilePic
            // console.log(data.profilePics)                                 //////////////////////////////////////            
            document.getElementById('profilePicForm').reset()
            
            $('#crop-modal').modal('hide')
        }) 
    })

    $('#removeProfilePic').on('click', function(){
        let req = new Request('/uploads/profilePic',{
            method : 'DELETE',
            mode : 'cors' ,  //so than no out server can use our server 
        })
        fetch(req)
        .then(res=>res.json())
        .then(data=>{
            document.getElementById('removeProfilePic').style.display='none' 
            document.getElementById('profilePic').src = data.profilePic
            document.getElementById('profilePicForm').reset()
        })
        .catch(err=>{
            console.log(err);
            alert('Server Error Occured...');
        })

    })
}

function generateFileName(name){
    const types = /(.jpeg|.jpg|.png|.gif)/
    return name.replace(types,'.png')
}