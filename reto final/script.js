const navToggle = document.getElementById('js-navbar-toggle');
const mainNav = document.getElementById('js-menu');

navToggle.addEventListener('click', function () {
    mainNav.classList.toggle('is-active');
    const expanded = this.getAttribute('aria-expanded') === 'true';
    this.setAttribute('aria-expanded', !expanded);
});

mainNav.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') {
        mainNav.classList.remove('is-active');
        navToggle.setAttribute('aria-expanded', 'false');
    }
});

const slidesContainer = document.getElementById("carruselSlides");
const slides = document.querySelectorAll(".carrusel-slide");
const prevBtn = document.getElementById("btnPrev");
const nextBtn = document.getElementById("btnNext");
const indicadores = document.querySelectorAll(".indicador");

let currentIndex = 0;
const totalSlides = slides.length;

function updateCarrusel(index) {
    if (index < 0) {
        currentIndex = totalSlides - 1;
    } else if (index >= totalSlides) {
        currentIndex = 0;
    } else {
        currentIndex = index;
    }
    
    slidesContainer.style.transform = `translateX(-${currentIndex * 100}%)`;
    
    indicadores.forEach((ind, i) => {
        if (i === currentIndex) {
            ind.classList.add("activo");
        } else {
            ind.classList.remove("activo");
        }
    });
}

prevBtn.addEventListener("click", () => {
    updateCarrusel(currentIndex - 1);
});

nextBtn.addEventListener("click", () => {
    updateCarrusel(currentIndex + 1);
});

indicadores.forEach((ind) => {
    ind.addEventListener("click", (e) => {
        const targetSlide = parseInt(e.target.getAttribute("data-slide"));
        updateCarrusel(targetSlide);
    });
});

// Cambiado a 10000ms (10s) para evitar problemas de re-renderizado brusco durante la medición inicial de Lighthouse
let autoSlide = setInterval(() => {
    updateCarrusel(currentIndex + 1);
}, 10000);

const carruselContenedor = document.querySelector(".carrusel-contenedor");
carruselContenedor.addEventListener("mouseenter", () => {
    clearInterval(autoSlide);
});

carruselContenedor.addEventListener("mouseleave", () => {
    autoSlide = setInterval(() => {
        updateCarrusel(currentIndex + 1);
    }, 10000);
});

const scrollBtn = document.getElementById("scrollTopBtn");

function toggleScrollButton(){
    if(scrollBtn){
        window.scrollY > 300 ? scrollBtn.classList.add("show") : scrollBtn.classList.remove("show");
    }
}

window.addEventListener("scroll", toggleScrollButton);
window.addEventListener("load", toggleScrollButton);

if(scrollBtn){
    scrollBtn.addEventListener("click", function(e){
        e.preventDefault();
        window.scrollTo({top: 0, behavior: "smooth"});
    });
}

function speak(text, lang = "es-ES") {
    if ("speechSynthesis" in window) {
        try {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = lang;
            window.speechSynthesis.speak(utterance);
        } catch (e) {
            console.error("Error en la síntesis de voz", e);
        }
    }
}

const newsletterForm = document.getElementById("form-newsletter");
if(newsletterForm) {
    newsletterForm.addEventListener("submit", function(e) {
        e.preventDefault();
        const emailInput = document.getElementById("email-boletin");
        const emailValue = emailInput ? emailInput.value.trim() : "";
        const submitBtn = this.querySelector("button[type='submit']");
        const originalTxt = submitBtn.textContent;

        if(emailValue) {
            submitBtn.textContent = "Enviando...";
            submitBtn.disabled = true;

            emailjs.send("service_6e0g1zc", "template_ieb4rfh", {
                email: emailValue,
                notes: "Suscripción desde el boletín de la Sagrada Familia."
            })
            .then(function() {
                speak("Gracias por suscribirte. Revisa tu correo para confirmar.");
                alert("¡Muchas gracias! El correo de confirmación de suscripción ha sido enviado.");
                newsletterForm.reset();
            }, function(err) {
                alert("Hubo un error al procesar el envío: " + JSON.stringify(err));
            })
            .finally(function() {
                submitBtn.textContent = originalTxt;
                submitBtn.disabled = false;
            });
        } else {
            speak("Por favor, introduce un correo electrónico válido.");
            alert("Introduce un correo electrónico válido.");
        }
    });
}
document.addEventListener("DOMContentLoaded", () => {
    const cookieBanner = document.getElementById("cookie-banner");
    const acceptBtn = document.getElementById("accept-cookies");

    if (!localStorage.getItem("cookiesAceptadas") && cookieBanner) {
        cookieBanner.style.display = "block";
    }

    if (acceptBtn) {
        acceptBtn.addEventListener("click", () => {
            localStorage.setItem("cookiesAceptadas", "true");
            cookieBanner.style.display = "none";
        });
    }
});