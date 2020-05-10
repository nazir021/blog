window.onload = function(){
    let baseCropping = $('#cropped-image').croppie({
        viewport: {
            width:200,
            height: 200
        },
        boundary: {
            width: 300,
            height:300
        },
        showZoomer: true
    })
    function readableFile(file){
        let reader = new FileReader()
        reader.onload = function (event){
            baseCropping.croppie('bind',{
                url: event.target.result
            }).then(()=>{
                $('.cr-slider').attr({
                    'min': 0.5000,
                    'max': 1.5000
                })
            })
        }
        reader.readAsDataURL(file)
    }
    $('#profilePicFile').on('change',function(e){
        if(this.files[0]){
            readableFile(this.files[0])
            $('#crop-modal').modal({
                backdrop:'static',
                keyboard: false
            })
        }
    })
    $('#cancel-cropping').on('click',function(){
        $('#crop-modal').modal('hide')
        setTimeout(()=>{
            baseCropping.croppie('destroy')
        },1000)
    })
    $('#upload-image').on('click',function(){
        baseCropping.croppie('result','blob')
        .then(blob=>{
            let formData = new FormData()
            let file = document.getElementById('profilePicFile').files[0]
            let name = genaratePng(file.name)
            // console.log(blob);
            
            formData.append('profilePic',blob,name)

            let headers = new Headers()
            headers.append('Accept','aplication/json')
            headers.append('Content-Type','Aplication/JSON')

            let req = new Request('/uploads/profilePic', {
                method:'POST',
                headers,
                mode:'cors',
                body:formData
            })
            return fetch(req)
        })
        //.then(res=> res.text())
        .then(res=> res.json())
        //.then(text=>console.log(text))
        .catch(err=>{
            console.log(err);
        })
        .then(data=>{
            console.log(data);
            
            document.getElementById('removeProfilePic').style.display = 'block'
            document.getElementById('profilePic').src = data.profilePic
            document.getElementById('removeProfilePic').reset()

            $('#crop-modal').modal('hide')
            setTimeout(()=>{
                baseCropping.croppie('destroy')
            },1000)
        })
        .catch(err=>{
            console.log(err);
        })
    })

}

function genaratePng(name){
    const types = /(.jpeg|.png|.jpg|.gif)/
    return name.replace(types,'png')
}