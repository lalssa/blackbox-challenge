var selectModal = document.getElementById('select-modal');
var selectSettings = document.getElementById('select-settings');
var span = document.getElementsByClassName('close')[1];
var selectVideos = document.getElementById('select-videos');
var selectBtn = document.getElementById('selectBtn');
let tags = [];
let videosToBeSelected = [];
let selectedTag;
let isClick = false;

selectSettings.onclick = function () {
  fetch('/library/tags', {
    method: 'GET',
  })
    .then((res) => {
      return res.json();
    })
    .then((result) => {
      tags = result;
      selectVideos.innerHTML =
        '<option disabled value="" selected>Choose a tag</option> ';
      tags.forEach((element) => {
        var opt = document.createElement('option');
        opt.value = element._id;
        opt.innerHTML = element.title; // whatever property it has

        // then append it to the select element
        selectVideos.appendChild(opt);
      });
      selectModal.style.display = 'flex';
    })
    .catch((err) => {
      console.log(err);
    });
};

selectVideos.onchange = function () {
  const selectedId = selectVideos.selectedOptions[0].value;
  selectedTag = tags.find((t) => t._id.toString() === selectedId.toString());
  videosToBeSelected = selectedTag.videos;
  console.log(videosToBeSelected);
};

selectBtn.onclick = function () {
  let checkbox;
  videosToBeSelected.forEach((id) => {
    checkbox = document.getElementById('selected-' + id);
    checkbox.checked = true;
    checkbox.dispatchEvent(new Event('change'));
  });
};

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
  selectModal.style.display = 'none';
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == selectModal) {
    selectModal.style.display = 'none';
  }
};
