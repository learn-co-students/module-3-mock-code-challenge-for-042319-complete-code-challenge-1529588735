document.addEventListener('DOMContentLoaded', function() {

  const imageId = 1 //Enter your assigned imageId here

  const imageURL = `https://randopic.herokuapp.com/images/${imageId}`

  const likeURL = `https://randopic.herokuapp.com/likes/`

  const commentsURL = `https://randopic.herokuapp.com/comments/`

  const image = document.getElementById("image")
  const name = document.getElementById("name")
  const likes = document.getElementById("likes")
  const comments = document.getElementById("comments")
  const likeButton = document.getElementById("like_button")
  const imageDiv = document.getElementById("image_card")
  const commentForm = document.getElementById("comment_form")

  imageDiv.addEventListener("click", function (event){
  //  console.log(event)
    if (event.target === likeButton){
    //  console.log(event)
      numLikes = parseInt(likes.innerText)
      numLikes += 1
      likes.innerText = numLikes

      config = {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify({image_id: imageId})
      }
      fetch(likeURL, config)
    } else if (event.target.innerText === "Delete"){
      const li = document.getElementById(`${event.target.id}`)
      //console.log(event)
      li.remove(event.target.id)
      fetch(`${commentsURL}/${event.target.id}`, {method: "DELETE"}).then(r=>r.json()).then(r => alert(r.message))
    }
  })

  commentForm.addEventListener("submit", function (event){
    event.preventDefault()
    const li = document.createElement("li")
    
    li.innerText = event.srcElement["0"].value
    comments.appendChild(li)
    config = {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: "POST",
      body: JSON.stringify({
        image_id: imageId,
        content: event.srcElement["0"].value
      })
    }
    fetch(commentsURL, config)

  })

  function getImageData () {
    fetch(imageURL).then(r => r.json()).then(putImageToDom)
  }

  function putImageToDom (imageObj) {
    image.src = imageObj.url
    name.innerText = imageObj.name
    likes.innerText = imageObj.like_count

    iterateThroughComments(imageObj)
  }

  function iterateThroughComments (imageObj) {
    imageObj.comments.forEach(function (comment) {
      const li = document.createElement("li")
      const deleteButton = document.createElement("button")

      deleteButton.innerText = "Delete"
      deleteButton.id = `${comment.id}`
      deleteButton.type = "button"
      li.id = `${comment.id}`
      li.innerText = comment.content
      li.appendChild(deleteButton)
      comments.appendChild(li)
    })
  }


  function startApp () {
    getImageData ()
  }

  startApp()
})
