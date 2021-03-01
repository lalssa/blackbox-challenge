// Get the modal
var modal = document.getElementById('tag-modal');

// Get the button that opens the modal
var tagButtons = document.querySelectorAll('button[id^=tag-btn]');

var addBtn = document.getElementById('addBtn');

var modalInput = document.getElementById('tagTitle');

// Get the <span> element that closes the modal
var span = document.getElementsByClassName('close')[0];

var videoId = '';

tagButtons.forEach((btn) => {
  btn.addEventListener('click', (event) => {
    videoId = event.target.parentNode.id.toString().split('tag-btn-')[1];
    modal.style.display = 'block';
  });
});

// When the user clicks the button, open the modal
// btn.onclick = function () {
//   modal.style.display = 'block';
// };

addBtn.onclick = function () {
  if (videoId && videoId !== '') {
    var titleHiddenInput = document.getElementById('title-' + videoId);
    var tagForm = document.getElementById('tag-form-' + videoId);
    titleHiddenInput.value = modalInput.value;
    modal.style.display = 'none';
    tagForm.submit();
  }
};

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
  modal.style.display = 'none';
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = 'none';
  }
};
