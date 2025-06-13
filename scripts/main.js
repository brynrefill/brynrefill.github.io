/*** cursor, menu (for mobile devices) and switch-theme animations ***/
$(document).ready(function() {
    scrollToTop();

    let mouseCursor = document.createElement("div");
    let mouseInnerCursor = document.createElement("div");
    document.body.appendChild(mouseCursor);
    document.body.appendChild(mouseInnerCursor);
    mouseCursor.classList.add("cursor");
    mouseInnerCursor.classList.add("innercursor");

    // if JS is disabled on the device, there will be no issues (the default cursor will remain, and the cursor animation simply won't be applied). This is why I set the style of the cursor here instead of in the CSS rules
    document.querySelectorAll('body, a, button').forEach(element => {
        element.style.cursor = 'none';
    });

    if (!isTouchEnabled()) {
        let navLinks = document.querySelectorAll('a, button, div.toggle');

        window.addEventListener('mousemove', function(e) {
            mouseCursor.style.top = e.pageY + "px";
            mouseCursor.style.left = e.pageX + "px";
            mouseInnerCursor.style.top = e.pageY + "px";
            mouseInnerCursor.style.left = e.pageX + "px";
        });

        navLinks.forEach(link => {
            link.addEventListener("mouseover", () => {
                mouseCursor.classList.add('cursor-change');
                mouseInnerCursor.classList.add('innercursor-change');
            });

            link.addEventListener("mouseleave", () => {
                mouseCursor.classList.remove('cursor-change');
                mouseInnerCursor.classList.remove('innercursor-change');
            });
        });

        $(document).mouseleave(function() {
            mouseCursor.style.display = 'none';
            if(localStorage.getItem('darkMode') === 'enabled')
                mouseInnerCursor.classList.remove('innercursor-dark');
        });

        $(document).mouseenter(function() {
            mouseCursor.style.display = 'block';
            if(localStorage.getItem('darkMode') === 'enabled')
                mouseInnerCursor.classList.add('innercursor-dark');
        });
    }
    else {
        mouseCursor.classList.remove('cursor');
        mouseInnerCursor.classList.remove('innercursor');
    }

    if(localStorage.getItem('darkMode') === 'enabled') {
        $("html").attr("data-theme", "dark");
        mouseCursor.classList.add('cursor-dark');
        mouseInnerCursor.classList.add('innercursor-dark');
    }
});

// toggle the menu visibility
function toggleMenu() {
    let menu = document.querySelector('.menu');
    let menuToggle = document.querySelector('.toggle');
    menu.classList.toggle('active');
    menuToggle.classList.toggle('active');

    scrollToTop();
}

// toggle between default and dark themes
function toggleTheme() {
    if (!isTouchEnabled()) {
        let mouseCursor = document.querySelector(".cursor");
        let mouseInnerCursor = document.querySelector(".innercursor");
        mouseCursor.classList.toggle('cursor-dark');
        mouseInnerCursor.classList.toggle('innercursor-dark');
    }

    let isDark = $("html").attr("data-theme") === "dark";
    $("html").attr("data-theme", isDark ? "default" : "dark");
    localStorage.setItem("darkMode", isDark ? "disabled" : "enabled");

    scrollToTop();
}

// check if touch events are enabled on the device
function isTouchEnabled() {
    return ('ontouchstart' in window ) ||
       (navigator.maxTouchPoints > 0 ) ||
       (navigator.msMaxTouchPoints > 0 );
}

// scroll to the top of the page
function scrollToTop() {
    if (window.scrollY > 0) window.scrollTo(0, 0);
}
