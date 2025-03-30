document.addEventListener("DOMContentLoaded", function() {
    // Initialize EmailJS with your User ID
    emailjs.init("YOUR_EMAILJS_USER_ID"); // Replace with your actual EmailJS user ID

    // Mobile Menu Toggle
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuBtn && navLinks) {
        menuBtn.addEventListener('click', function() {
            this.classList.toggle('active');
            navLinks.classList.toggle('active');
            
            if (navLinks.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
        
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                menuBtn.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }
    
    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            if (this.getAttribute('href') !== '#') {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    window.scrollTo({
                        top: target.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Animate skill bars on scroll
    const animateSkillBars = () => {
        const skillBars = document.querySelectorAll('.skill-progress');
        skillBars.forEach(bar => {
            const width = bar.getAttribute('data-width');
            bar.style.width = width;
        });
    };

    // Scroll to top button
    const scrollToTopBtn = document.querySelector('.scroll-to-top');
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.classList.add('active');
        } else {
            scrollToTopBtn.classList.remove('active');
        }
    });

    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.classList.contains('skills-section')) {
                    animateSkillBars();
                }
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);

    // Observe all sections
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });

    // Form validation and submission with EmailJS
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Get form elements
            const name = document.getElementById('name');
            const email = document.getElementById('email');
            const message = document.getElementById('message');
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.textContent;
            const formStatus = document.getElementById('form-status');

            // Reset UI
            document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
            formStatus.textContent = '';
            formStatus.className = 'form-status';

            // Validate form
            if (!name.value.trim()) {
                document.getElementById('name-error').textContent = 'Name is required';
                return;
            }
            if (!email.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
                document.getElementById('email-error').textContent = 'Valid email is required';
                return;
            }
            if (!message.value.trim()) {
                document.getElementById('message-error').textContent = 'Message is required';
                return;
            }

            // Prepare for submission
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            try {
                // Try EmailJS first
                const response = await emailjs.sendForm(
                    'YOUR_EMAILJS_SERVICE_ID',  // Replace with your service ID
                    'YOUR_EMAILJS_TEMPLATE_ID',   // Replace with your template ID
                    contactForm
                );

                // Success handling
                formStatus.textContent = 'Message sent successfully!';
                formStatus.className = 'form-status success';
                contactForm.reset();
            } catch (emailjsError) {
                console.error('EmailJS Failed:', emailjsError);
                
                // Fallback to FormSubmit.co if EmailJS fails
                try {
                    const formSubmitResponse = await fetch('https://formsubmit.co/ajax/vedanthkokkula2007@gmail.com', {
                        method: 'POST',
                        headers: { 
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        },
                        body: JSON.stringify({
                            name: name.value,
                            email: email.value,
                            message: message.value,
                            _captcha: false
                        })
                    });
                    
                    const result = await formSubmitResponse.json();
                    
                    if (result.success) {
                        formStatus.textContent = 'Message sent successfully! (via fallback)';
                        formStatus.className = 'form-status success';
                        contactForm.reset();
                    } else {
                        throw new Error('FormSubmit failed');
                    }
                } catch (fallbackError) {
                    console.error('Fallback failed:', fallbackError);
                    formStatus.textContent = 'Failed to send message. Please try again later or contact me directly at vedanthkokkula2007@gmail.com';
                    formStatus.className = 'form-status error';
                }
            } finally {
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
                
                // Clear status after 5 seconds
                setTimeout(() => {
                    formStatus.textContent = '';
                    formStatus.className = 'form-status';
                }, 5000);
            }
        });
    }

    // WhatsApp function
    window.sendToWhatsApp = function() {
        const name = document.getElementById('name')?.value || '';
        const email = document.getElementById('email')?.value || '';
        const message = document.getElementById('message')?.value || '';
        
        const text = `Hey Vedanth!%0A%0AName: ${name}%0AEmail: ${email}%0AMessage: ${message}`;
        window.open(`https://wa.me/9765682905?text=${text}`, '_blank');
    };
});
