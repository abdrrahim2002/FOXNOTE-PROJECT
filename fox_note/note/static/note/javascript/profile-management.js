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




// for count up animation
function countUpAnimation(element, start, end, duration) {
  let startTime = null;

  // Function to update the count
  function updateCount(currentTime) {
    if (!startTime) startTime = currentTime;
    
    const progress = currentTime - startTime;
    const currentValue = Math.min(Math.floor(progress / duration * (end - start) + start), end);

    element.innerText = currentValue;

    if (currentValue < end) {
      requestAnimationFrame(updateCount);
    }
  }

  requestAnimationFrame(updateCount);
}

// DOM Content Loaded event listener to start the count up animation for notes
document.addEventListener("DOMContentLoaded", function() {
  const noteCountElement = document.querySelector("#num-notes span"); // Select the span where the number will be displayed
  const targetCount = parseInt(document.getElementById('num-notes').getAttribute('data-count'), 10); // Get the target count from data-count attribute

  // Call the count up function with start = 0, targetCount, and duration = 2000ms (2 seconds)
  countUpAnimation(noteCountElement, 0, targetCount, 2000);
});



// DOM Content Loaded event listener to start the count up animation for tags
document.addEventListener("DOMContentLoaded", function() {
  const noteCountElement = document.querySelector("#num-tags span"); // Select the span where the number will be displayed
  const targetCount = parseInt(document.getElementById('num-tags').getAttribute('data-count'), 10); // Get the target count from data-count attribute

  // Call the count up function with start = 0, targetCount, and duration = 2000ms (2 seconds)
  countUpAnimation(noteCountElement, 0, targetCount, 2000);
});

