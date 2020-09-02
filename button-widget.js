// closest polyfill
// https://developer.mozilla.org/en-US/docs/Web/API/Element/closest
if (!Element.prototype.matches) {
  Element.prototype.matches =
    Element.prototype.msMatchesSelector ||
    Element.prototype.webkitMatchesSelector;
}

if (!Element.prototype.closest) {
  Element.prototype.closest = function (s) {
    var el = this;

    do {
      if (Element.prototype.matches.call(el, s)) return el;
      el = el.parentElement || el.parentNode;
    } while (el !== null && el.nodeType === 1);
    return null;
  };
}

// wrap original code using IIFE with id of container as parameter
(function (id) {
  // ---------
  // Variables
  // ---------

  // call nav by dynamic id
  const nav = document.querySelector("#" + id);
  // select all nav__items element
  const navItems = nav.querySelectorAll(".nav__item");
  // use nav element to select its children
  const navActiveIndicator = nav.querySelector(".nav__active-indicator");
  const buttons = nav.querySelectorAll("button");
  let activeButton = nav.querySelector(".active");

  // ---
  // App
  // ---
  setIndexKey(buttons);

  navItems.forEach((item) => {
    item.addEventListener("mouseover", buttonMouseover);
  });

  // ---------
  // Functions
  // ---------

  function setIndexKey(arrayOfElements) {
    arrayOfElements.forEach((element, index) => {
      element.index = index;
    });
  }

  // update indicator position for passed navItem element
  function positionIndicator(navItem) {
    // wait until active styles updated
    setTimeout(() => {     	  
      navActiveIndicator.style.transform = `translateX(${navItem.offsetLeft}px) translateY(${navItem.offsetTop}px)`;
      navActiveIndicator.style.width = `${navItem.clientWidth}px`;
      navActiveIndicator.style.height = `${navItem.clientHeight}px`;
    }, 50);
  }

  function buttonMouseover() {
    // find button to activate
    const button = this.querySelector("button");
    // Position the text so that it appears to not move with the button width growth
    if (button.index > activeButton.index) {
      nav.classList.remove("slide-right");
      nav.classList.add("slide-left");
    } else {
      nav.classList.remove("slide-left");
      nav.classList.add("slide-right");
    }

    /* old code
      // Animate the active indicator position
      const iconWidth = parseInt(
          getComputedStyle(document.documentElement).getPropertyValue("--icon-width")
      );
      const spaceBetweenIcons = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue(
          "--space-between-icons"
        )
      );
      navActiveIndicator.style.transform = `translateX(${(iconWidth +
      spaceBetweenIcons) *
      this.index}px) translateY(-50%)`;
    */

    // Update the active button
    if (activeButton) activeButton.classList.remove("active");
    button.classList.add("active");
    activeButton = button;

    // update indicator position on active button change
    positionIndicator(this);
  }

  // update indicator position on window resize
  window.addEventListener('resize', function(event){
  	positionIndicator(activeButton.closest(".nav__item"));
  });
  
  // on load position indicator correctly
  positionIndicator(activeButton.closest(".nav__item"));
  
})("{{uc_id}}"); // dynamic id