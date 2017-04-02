const form = document.querySelector('.js-create-post');

form && form.addEventListener('submit', createPost);
function createPost(e) {
  e.preventDefault();
  const data = new FormData(form);


  const options = {
    method: 'post',
    body: data
  };

  fetch('createpost', options)
    .then(data => {
      return data.text()
    }).then(data => {
    console.log(data)
  }).catch(error => {
    console.log(error)
  })
}

