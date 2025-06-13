/*** fade in/fade out animation (not for mobile devices) ***/
if (window.matchMedia("(min-width: 1281px)").matches) { // if ($(window).width() > 1280)
    // if JS is disabled on the device, there will be no issues (the opacity of the page will remain at 100%, and the fade in/fade out animation simply won't be applied). This is why I set the opacity here instead of in the CSS rules
    $("body").css("opacity", "0");

    $(document).ready(function() {
        $("body").animate({ opacity: 1 }, 300);

        $("a").click(function(event) {
            const linkLocation = this.href;
            let linkDomain = new URL(linkLocation);
            linkDomain = linkDomain.hostname;

            if((linkDomain === window.location.hostname && linkLocation.includes('#')) || linkLocation.includes('mailto')) {
                /* preserve the default behavior */
            }
            else {
                event.preventDefault();

                if ($(this).attr("target") === "_blank") // if(this.target)
                    window.open(linkLocation, '_blank').focus();
                else
                    $("body").animate({ opacity: 0 }, 400, function() {
                        window.location.href = linkLocation;
                    });
            }
        });
    });

    // to prevent that the opacity of the body from remaining at 0%, when the browser back button is clicked
    $(window).on('unload', function() {
        $("body").css('opacity', '1');
    });

    // helpful if the page takes too long to fade in
    setTimeout(function() {
        $("body").animate({ opacity: 1 }, 300);
    }, 1000);
}
