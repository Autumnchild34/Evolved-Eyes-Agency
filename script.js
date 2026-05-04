function scrollToContact() {
    document.getElementById("contact").scrollIntoView({
        behavior: "smooth"
    });
}

function showMessage() {
    document.getElementById("message").innerText = 
        "Thanks! We'll reach out to you soon.";
}