function activateProductCarousel(){

    var productCarousels = document.querySelectorAll(".product-carousel-container")
    productCarousels.forEach(productCarousel => {
        var carouselContainer = productCarousel.querySelector(".carousel-container")
        var carousel = productCarousel.querySelector(".carousel-slides")
        
        if(!carouselContainer)
            return

        var prevButton = productCarousel.querySelector(".prev")
        var nextButton = productCarousel.querySelector(".next")
        var carouselSlides = carouselContainer.querySelectorAll(".carousel-slide")
        var slideWidth = carouselSlides[1].offsetWidth
        // var totalWidth = carousel.scrollWidth;
                                                                    
        // Event listener for PREV scroll button
        prevButton.addEventListener("click", () => {
            carousel.scrollTo({ left: carousel.scrollLeft - slideWidth, behavior: 'smooth' });
        });
        
        // Event listener for NEXT scroll button
        nextButton.addEventListener("click", () => {
            carousel.scrollTo({ left: carousel.scrollLeft + slideWidth, behavior: 'smooth' });
        });
    });
}

window.addEventListener("load", function() {
    try {
        activateProductCarousel();
    } catch (error) {
        console.error("Error in activateProductCarousel:", error);
    }
});                                                                                                                                                                                                                                         