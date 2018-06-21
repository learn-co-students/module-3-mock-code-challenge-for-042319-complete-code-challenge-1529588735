document.addEventListener('DOMContentLoaded', function() {

  const imageId = 2 //Enter your assigned imageId here

  const imageURL = `https://randopic.herokuapp.com/images/${imageId}`

  const likeURL = `https://randopic.herokuapp.com/likes/`

  const commentsURL = `https://randopic.herokuapp.com/comments/`


  const imageSpace = document.getElementById("image_card")
  const likeCount = document.getElementById("likes")
  const likeButton = document.getElementById("like_button")
  const commentForm = document.getElementById("comment_form")
  const commentList = document.getElementById("comments")


// ------------------------ FETCH FUNCTIONS TO GET AND POST -------------------------

  function fetchImage(){
    fetch(imageURL).then(response=>response.json()).then(renderImage)
  }

  function postLike(likeOnImage){

    let imageElements = Array.from(likeOnImage.children)

    let configObj = {
      method:"POST",
      headers:{
        'Accept':'application/json',
        'Content-Type':'application/json'
      },
      body: JSON.stringify({image_id: `${imageElements[0].dataset.imageId}`})
    }

    fetch(likeURL, configObj).then(fetchImage)
  }


  function postComment(comment){
    let elements = Array.from(comment.children)

    let configObj2 = {
      method:"POST",
      headers:{'Accept': 'application/json',
      'Content-Type': 'application/json'
      },
      body: JSON.stringify({image_id: `${imageId}`, content: `${elements[0].value}`})
    }

    fetch(commentsURL, configObj2).then(response=>response.json()).then(fetchImage)
  }

  function deleteComment(id){

    let configObj3 = {
      method:"DELETE"
    }

    fetch(`${commentsURL}/${id}`, configObj3).then(fetchImage)
  }

// ---------------------------------------------------------------------

// ------------------------ EVENT LISTENERS ----------------------------

  imageSpace.addEventListener('submit', function(event){
    event.preventDefault();
    postComment(event.target)
  })

  document.addEventListener('click', function(event){

    if(event.target.innerText === "Like"){
      postLike(event.target.parentElement);
    } else if (event.target.className === "Delete"){
      deleteComment(event.target.dataset.commentId)
    }

  })

// ---------------------------------------------------------------------


// ------------------------ RENDER FUNCTIONS ---------------------------

  function renderImage(image){

    imageSpace.innerHTML = `<img id="image" src="${image.url}" data-image-id="${image.id}"/>
              <h4 id="name"></h4>
              <span>Likes:
                <span id="likes">${image.like_count}</span>
              </span>
              <button id="like_button">Like</button>
              <form id="comment_form">
                <input id="comment_input" type="text" name="comment" placeholder="Add Comment"/>
                <input type="submit" value="Submit"/>
              </form>
              <ul id="comments">
              ${renderComments(image.comments)}
              </ul>`
  }


  function renderComments(comment){
    return comment.map(c=>`<br><li>${c.content}</li><button class="Delete" id="delete" data-comment-id="${c.id}">DELETE</button><br>`).join("")
  }


// ---------------------------------------------------------------------

  fetchImage();


})
