document.addEventListener('DOMContentLoaded', () => {
  const header = document.getElementById('header');
  const menuToggle = document.getElementById('menu-toggle');
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const formContacto = document.getElementById('formContacto');
  const formFeedback = document.getElementById('formFeedback');

  /* ==========================================================
     1. Desofuscación Dinámica de Contactos (Protección anti-scraping)
  ========================================================== */
  // Emails
  document.querySelectorAll('.secure-mail').forEach(el => {
    const encoded = el.getAttribute('data-mail');
    if (encoded) {
      const email = atob(encoded);
      el.href = `mailto:${email}`;
      const span = el.querySelector('span');
      if (span) {
        span.textContent = email;
      } else {
        el.textContent = email;
      }
    }
  });

  // Enlaces de WhatsApp e insignias (Badges)
  document.querySelectorAll('.secure-wa-badge, .secure-wa-btn').forEach(el => {
    const waEncoded = el.getAttribute('data-wa');
    const msgEncoded = el.getAttribute('data-msg');
    if (waEncoded) {
      const wa = atob(waEncoded);
      const msg = msgEncoded ? encodeURIComponent(atob(msgEncoded)) : '';
      el.href = `https://wa.me/${wa}?text=${msg}`;
    }
  });

  // Números telefónicos en texto y enlaces de WhatsApp
  document.querySelectorAll('.secure-tel-link').forEach(el => {
    const waEncoded = el.getAttribute('data-wa');
    const telEncoded = el.getAttribute('data-tel');
    const msgEncoded = el.getAttribute('data-msg');
    if (waEncoded && telEncoded) {
      const wa = atob(waEncoded);
      const tel = atob(telEncoded);
      const msg = msgEncoded ? encodeURIComponent(atob(msgEncoded)) : '';
      el.href = `https://wa.me/${wa}?text=${msg}`;
      const span = el.querySelector('span');
      if (span) {
        span.textContent = tel;
      } else {
        el.textContent = tel;
      }
    }
  });

  /* ==========================================================
     2. Menú Hamburguesa Mobile
  ========================================================== */
  if (menuToggle && navbar) {
    menuToggle.addEventListener('click', () => {
      const isOpen = navbar.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', isOpen);
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navbar.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', false);
      });
    });
  }

  /* ==========================================================
     3. Header Compacto al Scroll & Scrollspy
  ========================================================== */
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.style.padding = '0.6rem 0';
      header.style.backgroundColor = 'rgba(13, 34, 23, 0.98)';
      header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.5)';
    } else {
      header.style.padding = '0.8rem 0';
      header.style.backgroundColor = 'rgba(13, 34, 23, 0.98)';
      header.style.boxShadow = 'none';
    }

    const scrollPosition = window.scrollY + 180;
    const sections = document.querySelectorAll('section[id]');

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });

  /* ==========================================================
     4. Envío Seguro del Formulario vía AJAX a enviar.php
  ========================================================== */
  if (formContacto) {
    formContacto.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btnEnviar = document.getElementById('btnEnviar');
      const formData = new FormData(formContacto);

      btnEnviar.disabled = true;
      btnEnviar.innerText = 'ENVIANDO...';
      formFeedback.innerText = '';

      try {
        const response = await fetch(formContacto.action, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          formFeedback.className = 'form-feedback success';
          formFeedback.innerText = '¡Gracias por su consulta! Nuestro equipo se pondrá en contacto a la brevedad.';
          formContacto.reset();
        } else {
          formFeedback.className = 'form-feedback error';
          formFeedback.innerText = 'Ocurrió un error al enviar. Por favor intente nuevamente o comuníquese por WhatsApp.';
        }
      } catch (error) {
        formFeedback.className = 'form-feedback error';
        formFeedback.innerText = 'Error de conexión. Intente nuevamente.';
      } finally {
        btnEnviar.disabled = false;
        btnEnviar.innerText = 'ENVIAR CONSULTA';

        setTimeout(() => {
          formFeedback.innerText = '';
        }, 7000);
      }
    });
  }
});

/* ==========================================================
   5. Galería Interactiva de Fotos del Estudio
========================================================== */
function cambiarFotoEstudio(src, el) {
  const currentImg = document.getElementById('currentStudioImg');
  if (currentImg) {
    currentImg.src = src;
  }
  const thumbs = document.querySelectorAll('.facility-thumbnails img');
  thumbs.forEach(thumb => thumb.classList.remove('active'));
  if (el) {
    el.classList.add('active');
  }
}