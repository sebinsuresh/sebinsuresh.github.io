const navSlide = () => {
    console.log(screen.width);
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');
    // this variable is needed because on mobile devices
    //  the text with opacity 0 still causes overflow issues
    let navShown = false;
    
    burger.addEventListener('click',()=>{
        if(!navShown) {
            navShown = true;
            nav.style.right = "0px";
        } else {
            navShown = false;
            setTimeout(()=>{nav.style.right = "50px";},500);
        }
        console.log(window.innerWidth + " " + window.innerHeight);
        // Toggles nav 
        nav.classList.toggle('nav-active');
        // Animate links
        navLinks.forEach((link, index) => {
            if(link.style.animation) {
                link.style.animation = '';
            } else {
                link.style.animation = "navLinkFade 0.5s ease forwards " + ((index/5)+0.4) + "s";
            }
        });
        burger.classList.toggle('toggle');
        console.log(window.innerWidth + " " + window.innerHeight);
    });
};

navSlide();