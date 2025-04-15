document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile Menu Toggle ---
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            // Toggle hamburger icon to 'X' icon
            const icon = menuToggle.querySelector('i');
            if (icon.classList.contains('fa-bars')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });

        // Close menu when a link is clicked (for single-page navigation)
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    menuToggle.querySelector('i').classList.remove('fa-times');
                    menuToggle.querySelector('i').classList.add('fa-bars');
                }
                 // Update active class on click
                 document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
                 link.classList.add('active');
            });
        });
    }

    // --- Contact Form Handling ---
    const contactForm = document.getElementById('contact-form');
    const whatsAppButton = document.getElementById('send-whatsapp');
    const emailButton = document.getElementById('send-email');
    const formStatus = document.getElementById('form-status');

    const yourWhatsAppNumber = '919259140335'; // Your WhatsApp Number with country code
    const yourEmailAddress = 'trivedirishi98@gmail.com'; // Your personal email for receiving form submissions

    // Attach event listeners to the buttons, not the form submit itself
    if (whatsAppButton) {
        whatsAppButton.addEventListener('click', () => handleFormSubmit('whatsapp'));
    }
    if (emailButton) {
        emailButton.addEventListener('click', () => handleFormSubmit('email'));
    }

    function handleFormSubmit(method) {
        if (!contactForm) return;

        const name = contactForm.name.value.trim();
        const email = contactForm.email.value.trim();
        const phone = contactForm.phone.value.trim();
        const service = contactForm.service.value.trim();
        const message = contactForm.message.value.trim();

        // Basic Validation
        if (!name || !email || !service || !message) {
            showFormStatus('Please fill in all required fields.', 'error');
            // Highlight missing fields (optional)
            highlightEmptyFields(contactForm);
            return;
        }
        if (!validateEmail(email)) {
            showFormStatus('Please enter a valid email address.', 'error');
            contactForm.email.focus(); // Focus the invalid field
             contactForm.email.style.borderColor = '#dc3545'; // Highlight error
            return;
        }

        // Clear previous status and highlights
        showFormStatus('');
        clearFieldHighlights(contactForm);

        if (method === 'whatsapp') {
            // --- WhatsApp ---
            let whatsappMessage = `*New Inquiry from Website*:\n\n`;
            whatsappMessage += `*Name:* ${name}\n`;
            whatsappMessage += `*Email:* ${email}\n`;
            if (phone) whatsappMessage += `*Phone:* ${phone}\n`;
            whatsappMessage += `*Service/Device:* ${service}\n`;
            whatsappMessage += `*Issue:* ${message}\n`;

            const encodedMessage = encodeURIComponent(whatsappMessage);
            const whatsappUrl = `https://wa.me/${yourWhatsAppNumber}?text=${encodedMessage}`;

            window.open(whatsappUrl, '_blank');
            showFormStatus('Redirecting to WhatsApp...', 'success');
            // Don't clear form immediately, user might need to copy info
            // setTimeout(() => { contactForm.reset(); }, 5000);

        } else if (method === 'email') {
            // --- Email (using mailto:) ---
            const subject = `Website Inquiry: ${service} from ${name}`;
            let body = `New Inquiry from Mobile Care Center Website:\n\n`;
            body += `Name: ${name}\n`;
            body += `Email: ${email}\n`;
            if (phone) body += `Phone: ${phone}\n`;
            body += `Service Needed / Device: ${service}\n\n`;
            body += `Message:\n${message}\n`;

            const mailtoLink = `mailto:${yourEmailAddress}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

            // Using location.href can sometimes be blocked, try opening in a new tab first
            try {
                 window.open(mailtoLink, '_blank');
            } catch(e) {
                 // Fallback if popup blocker interferes
                 window.location.href = mailtoLink;
            }

            showFormStatus('Opening your email client...', 'success');
             // Don't clear form immediately
             // setTimeout(() => { contactForm.reset(); }, 5000);
        }
    }

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }

     function showFormStatus(message, type = 'info') {
        if (!formStatus) return;
        formStatus.textContent = message;
        formStatus.className = ''; // Clear previous classes
        if (type === 'error') {
            formStatus.classList.add('status-error');
        } else if (type === 'success') {
            formStatus.classList.add('status-success');
        } else {
             formStatus.classList.add('status-info');
        }
    }
    // Add CSS for status messages
    const style = document.createElement('style');
    style.textContent = `
        .status-error { color: #dc3545; font-weight: bold; }
        .status-success { color: #28a745; font-weight: bold; }
        .status-info { color: #007bff; }
        .field-error { border-color: #dc3545 !important; }
    `;
    document.head.appendChild(style);


    function highlightEmptyFields(form) {
        ['name', 'email', 'service', 'message'].forEach(fieldName => {
            const field = form[fieldName];
            if (field && !field.value.trim()) {
                field.classList.add('field-error');
            } else if(field) {
                 field.classList.remove('field-error'); // Remove if filled later
            }
        });
    }

     function clearFieldHighlights(form) {
         form.querySelectorAll('.field-error').forEach(el => el.classList.remove('field-error'));
          form.querySelectorAll('input, textarea').forEach(el => {
             el.style.borderColor = ''; // Reset border color if manually set
         });
    }


    // --- Add active class to nav link based on scroll position ---
    const sections = document.querySelectorAll('section[id]');
    const navLiAnchors = document.querySelectorAll('nav .nav-links li a');

    window.addEventListener('scroll', () => {
        let current = '';
        const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            // Adjust offset for better accuracy, especially with sticky header
            const offset = 100; // Adjust this value as needed
            if (scrollPosition >= (sectionTop - offset)) {
                current = section.getAttribute('id');
            }
        });

        navLiAnchors.forEach(a => {
            a.classList.remove('active');
            // Check if the href matches the current section id
            if (a.getAttribute('href') === `#${current}`) {
                a.classList.add('active');
            }
        });
        // Special case for top of page - highlight Home
        if (scrollPosition < (sections[0]?.offsetTop - 100 || 300)) { // Check top section offset or a default value
             navLiAnchors.forEach(a => a.classList.remove('active'));
            const homeLink = document.querySelector('nav .nav-links li a[href="#hero"]');
            if(homeLink) homeLink.classList.add('active');
        }
    });

    // --- Set Current Year in Footer ---
     const currentYearSpan = document.getElementById('current-year');
     if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
     }

}); // End DOMContentLoaded