document.addEventListener('DOMContentLoaded', function() {

  const imageId = 3 //Enter your assigned imageId here

  const imageURL = `https://randopic.herokuapp.com/images/${imageId}`

  const likeURL = `https://randopic.herokuapp.com/likes/`

  const commentsURL = `https://randopic.herokuapp.com/comments/`


  const container = document.getElementsByClassName('container')[0];
  const imageContent = document.getElementById('image_content');
  const imageCard = document.getElementById('image_card');
  const imageThing = document.getElementById('image');
  const name = document.getElementById('name');



  fetch(imageURL).then(r => r.json()).then(getImage)



function getImage(image) {

  var list = image.comments.map(comment => `<li id="${comment.id}"> ${comment.content} <button id="delete">Delete</button> </li>`)

  imageCard.innerHTML = `<img src="${image.url}"> <img id="image" data-id/>
  <h4 id="name">${image.name}</h4>
  <span>Likes:
    <span id="likes">${image.like_count}</span>
  </span>
  <button id="like_button">Like</button>
  <form id="comment_form">
    <input id="comment_input" type="text" name="comment" placeholder="Add Comment"/>
    <input id="submit" type="submit" value="Submit"/>
  </form>
  <ul id="comments">
    ${list.join('')}
  </ul>`

}


imageContent.addEventListener('click', function(event){
  event.preventDefault();
  if (event.target.innerText == "Like") {
      addLikePost(event, imageId)
  } else if (event.target.id == "submit") {
    const commentInput = document.getElementById('comment_input')
      var comment = commentInput.value;
      if (comment !== '') {
        addcommentPost(event, imageId, comment);
        commentInput.value = '';
      }
  } else if (event.target.id == 'delete') {
      commentId = event.target.parentElement.id;
      removeComment(event, commentId);
  }
})


function removeComment(event, commentId) {
  fetch(`${commentsURL}/${commentId}`, {method: 'DELETE'}).then(r => r.json()).then(a => realTimeRemoveComment(event, a))
}


function realTimeRemoveComment(event, a) {
  event.target.parentElement.remove();
}



  function addcommentPost(event, imageId, comment) {

  const body = {
    image_id: imageId,
    content: comment
  };

  const config = {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-type': 'application/json'
    },
    body:JSON.stringify(body)
  };
  fetch(commentsURL, config).then(r => r.json()).then(a => realTimeAddComment(event, a, comment))
  }


  function realTimeAddComment(event, a, comment) {

    const commentContainer = document.getElementById('comments');
    const li = document.createElement('LI');
    li.setAttribute('id', `${a.id}`);
    li.innerText = `${comment}`;
    const buttonDelete = document.createElement('BUTTON');
    buttonDelete.setAttribute('id', 'delete');
    buttonDelete.innerText = "Delete";
    li.appendChild(buttonDelete);
    commentContainer.appendChild(li);
  }




  function addLikePost(event, imageId) {
    const body = {
        image_id: imageId
    };
    const config = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
    body:JSON.stringify(body)
    }

    fetch(likeURL, config).then(r => r.json()).then(a => realTimeAdd(a, event))

  }

  function realTimeAdd(a, event) {

    const likes = document.getElementById('likes');
    likes.innerText = Number(likes.innerText) + 1;
  }













})
