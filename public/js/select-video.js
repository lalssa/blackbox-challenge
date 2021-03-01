var checkboxes = document.querySelectorAll('input[type=checkbox]');
var bottomBar = document.getElementById('bottom-bar');
var selectNumber = document.getElementById('select-number');
var selectFeature = document.getElementById('select-feature');
var selectTag = document.getElementById('select-tag');
var addBtn = document.getElementById('addBtn');
var tagModal = document.getElementById('tag-modal');
var tagTitle = document.getElementById('tagTitle');

let checkedItems = [];

checkboxes.forEach(function (checkbox) {
  checkbox.addEventListener('change', function () {
    checkedItems = Array.from(checkboxes) // Convert checkboxes to an array to use filter and map.
      .filter((i) => i.checked) // Use Array.filter to remove unchecked checkboxes.
      .map((i) => i.id.split('selected-')[1]); // Use Array.map to extract only the checkbox values from the array of objects.

    if (checkedItems.length > 0) {
      bottomBar.style.display = 'flex';
    } else {
      bottomBar.style.display = 'none';
    }

    selectNumber.firstElementChild.textContent =
      checkedItems.length + ' videos selected';
  });
});

selectFeature.onclick = function () {
  fetch('/library/star-videos', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ videos: checkedItems }),
  })
    .then((result) => {
      console.log(result);
      location.reload();
    })
    .catch((err) => {
      console.log(err);
    });
};

selectTag.onclick = function () {
  tagModal.style.display = 'flex';
};

addBtn.onclick = function () {
  const title = tagTitle.value;
  console.log(title);
  fetch('/library/tag-videos', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ videos: checkedItems, title }),
  })
    .then((result) => {
      console.log(result);
      // location.reload();
    })
    .catch((err) => {
      console.log(err);
    });
};

document.getElementById('select-all').onclick = function () {
  for (var checkbox of checkboxes) {
    checkbox.checked = true;
    checkbox.dispatchEvent(new Event('change'));
  }
};

document.getElementById('select-cancel').onclick = function () {
  for (var checkbox of checkboxes) {
    checkbox.checked = false;
    checkbox.dispatchEvent(new Event('change'));
  }
};
