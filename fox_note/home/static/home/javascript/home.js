/* document.addEventListener("DOMContentLoaded", function () {
  const hiddenElements = document.querySelectorAll('.hidden-content');

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Stop observing once the element is visible
        observer.unobserve(entry.target);
      }
    });
  });

  hiddenElements.forEach((el) => observer.observe(el));
});
 */

/* document.addEventListener("DOMContentLoaded", function () {
  const hiddenElements = document.querySelectorAll('.hidden-content');

  // Create the IntersectionObserver with rootMargin for 70% from top
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);  // Stop observing once the element is visible
      }
    });
  }, {
    root: null,  // Use the viewport as the root
    rootMargin: '-30% 0px',  // Offset the intersection by 30% from the top
    threshold: 0  // Trigger as soon as any part of the element is visible
  });

  hiddenElements.forEach((el) => observer.observe(el));
});

 */


/* document.addEventListener("DOMContentLoaded", function () {
  const welcomeSection = document.querySelector('.welcome-section');

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');  // Show the section
        
        // Stop observing the welcome section once it becomes visible
        observer.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    rootMargin: '-30% 0px',  // Show when 70% of viewport is above the section
    threshold: 0
  });

  observer.observe(welcomeSection);
});
 */




document.addEventListener("DOMContentLoaded", function () {
  const hiddenElements = document.querySelectorAll('.hidden-content');

  // Create the IntersectionObserver with rootMargin for 70% from top
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);  // Stop observing once the element is visible
      }
    });
  }, {
    root: null,  // Use the viewport as the root
    rootMargin: '-20% 0px',  // Offset the intersection by 30% from the top
    threshold: 0.20  // Trigger as soon as any part of the element is visible
  });



  hiddenElements.forEach((el) => observer.observe(el));
});




//generate the year automatucaly 

// Get the current year
const year = new Date().getFullYear();

// Set the year in the footer
document.querySelector('.current-year').textContent = year;





//showing the about window
function show_window (event, target) {
  //block normal processe of the bottom
  event.preventDefault();

  //target the ncessary
  const window = document.querySelector(`.${target}`);
  const overlay = document.querySelector('.overlay');

  //do the action 
  window.classList.add('show');
  overlay.classList.add('show');
}



//function to close the window
function close_window () {
  //select the elements
  const overlay = document.querySelector('.overlay');
  const about = document.querySelector('.about-window');
  const term = document.querySelector('.term-window');
  const privacy = document.querySelector('.privacy-window');

  //do the action
  overlay.classList.remove('show');
  about.classList.remove('show');
  term.classList.remove('show');
  privacy.classList.remove('show');
}


//to load the page correctly without showing the garbeg

window.onload = function() { setTimeout(() => {
  document.body.style.visibility = "visible";
  document.body.style.opacity = "1";  // This will trigger the fade-in effect
}, 5000);
};
