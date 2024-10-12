//close the message popup
function closePopup(ID) {

  document.getElementById(ID).classList.add('popup-message-move');

  setTimeout(() => {
    document.getElementById(ID).remove();
  }, 250);
  
}


function toggleDropdown() {
  const dropdown = document.getElementById("dropdown-menu");
  // Toggle the display property between 'block' and 'none'
  if (dropdown.style.display === "block") {
    dropdown.style.display = "none";
  } else {
    dropdown.style.display = "block";
  }
}

// Close the dropdown if the user clicks outside of it
window.onclick = function(event) {
  if (!event.target.matches('.my-profile')) {
    const dropdowns = document.getElementsByClassName("dropdown-content");
    for (let i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.style.display === "block") {
        openDropdown.style.display = "none";
      }
    }
  }
}




//show the buttons when click the select button
function showSelectionOptions () {
  //check if we are not in the edit mode
  if (!activeEdit) {

    const selectButton = document.getElementsByClassName('select-button')[0];
    const deleteButton = document.querySelector('.delete-selection');
    const selectAllButton = document.querySelector('.select-all-selection');
    const cancelButton = document.querySelector('.cancel-selection');

    selectButton.disabled = true;
    deleteButton.style.display = 'block';
    selectAllButton.style.display = 'block';
    cancelButton.style.display = 'block';


    //target the select checkboxes to shows
    const checkboxes = document.querySelectorAll('.checkBox');

    checkboxes.forEach (checkbox => {
      checkbox.style.display = 'block';
    });
  }else {
  }
}



//show the search form 
function startSearch () {
  //check if we are not in the edit mode
  if (!activeEdit) {

    //get the necessary items
    const searchForm = document.getElementsByClassName('search-form')[0];
    const overlay = document.getElementsByClassName('form-overlay')[0];

    searchForm.classList.add('active-search');
    overlay.classList.add('active-overlay');
  } else {
  }
}



//function for closing the form
function closeSearch () {
    //get the necessary items
    const searchForm = document.getElementsByClassName('search-form')[0];
    const overlay = document.getElementsByClassName('form-overlay')[0];
    const addNoteForm = document.querySelector('.note-and-tag-form');
    const addTagDiv = document.querySelector('.add-tag');
    const addTagButton = document.querySelector('.add-tag-button');
  
    searchForm.classList.remove('active-search');
    overlay.classList.remove('active-overlay');
    overlay.classList.remove('active-add-note');
    addNoteForm.classList.remove('active-add-note');

    setTimeout(() => {
      addTagDiv.style.display = 'none';
      addTagButton.style.display = 'block';
    }, 1000);

}




//for the add note form
//click the add tag button to hide it and show the add tag form

function showAddTagForm () {
  //get the elements
  const addTagButton = document.querySelector('.add-tag-button');
  const tagFrom = document.querySelector('.add-tag');

  tagFrom.style.display = 'block';
  addTagButton.style.display = 'none';
}





//for showing the note form
function createNoteForm () {
  //check if we are not in the edit mode
  if (!activeEdit) {
    //get elements 
    const overlay = document.querySelector('.form-overlay');
    const noteForm = document.querySelector('.note-and-tag-form');

    overlay.classList.add('active-overlay');
    noteForm.classList.add('active-add-note');
  } else {
  }
}




//check if when the user click in the 'my notes' button is in the edit mode or not

function checkEditing(event) {
  if(!activeEdit) {
    //work as normal
  }else {
    event.preventDefault();
    showEditPopup();
  }
}

function showEditPopup () {
  //select element 
  const overlay = document.querySelector('.form-overlay');
  const popup = document.querySelector('.edit-window-popup');

  popup.classList.add('edit-window-popup-show');
  overlay.classList.add('active-overlay');
}

function hideEditPopup () {
  //select element 
  const overlay = document.querySelector('.form-overlay');
  const popup = document.querySelector('.edit-window-popup');

  popup.classList.remove('edit-window-popup-show');
  overlay.classList.remove('active-overlay');
}