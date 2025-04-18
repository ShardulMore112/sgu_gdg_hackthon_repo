document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    hamburger.addEventListener('click', function() {
        this.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // Testimonial Slider
    if (document.querySelector('.testimonial-slider')) {
        const testimonials = document.querySelectorAll('.testimonial');
        const dotsContainer = document.querySelector('.slider-dots');
        const prevBtn = document.querySelector('.slider-prev');
        const nextBtn = document.querySelector('.slider-next');
        
        let currentIndex = 0;
        
        // Create dots
        testimonials.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('slider-dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => {
                goToTestimonial(index);
            });
            dotsContainer.appendChild(dot);
        });
        
        const dots = document.querySelectorAll('.slider-dot');
        
        function goToTestimonial(index) {
            testimonials.forEach(testimonial => testimonial.classList.remove('active'));
            dots.forEach(dot => dot.classList.remove('active'));
            
            currentIndex = index;
            testimonials[currentIndex].classList.add('active');
            dots[currentIndex].classList.add('active');
        }
        
        prevBtn.addEventListener('click', () => {
            let newIndex = currentIndex - 1;
            if (newIndex < 0) newIndex = testimonials.length - 1;
            goToTestimonial(newIndex);
        });
        
        nextBtn.addEventListener('click', () => {
            let newIndex = currentIndex + 1;
            if (newIndex >= testimonials.length) newIndex = 0;
            goToTestimonial(newIndex);
        });
        
        // Auto-rotate testimonials
        setInterval(() => {
            let newIndex = currentIndex + 1;
            if (newIndex >= testimonials.length) newIndex = 0;
            goToTestimonial(newIndex);
        }, 5000);
    }

    // Modal functionality
    const modal = document.getElementById('profile-modal');
    const modalClose = document.querySelector('.close-modal');
    
    if (modal && modalClose) {
        const editButtons = document.querySelectorAll('.btn-add, .avatar-edit');
        
        editButtons.forEach(button => {
            button.addEventListener('click', () => {
                modal.style.display = 'flex';
                document.body.style.overflow = 'hidden';
            });
        });
        
        modalClose.addEventListener('click', () => {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
        
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }

    // Animate elements when they come into view
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.animate-slide-up, .animate-pop-in');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementPosition < windowHeight - 100) {
                element.style.animationPlayState = 'running';
            }
        });
    };
    
    // Run once on page load
    animateOnScroll();
    
    // Then run on scroll
    window.addEventListener('scroll', animateOnScroll);

    // Skill tags input (for profile page)
    if (document.querySelector('.skill-tags')) {
        const skillInput = document.createElement('input');
        skillInput.type = 'text';
        skillInput.placeholder = 'Add a skill...';
        skillInput.classList.add('skill-input');
        
        const addSkillButton = document.querySelector('.btn-add[onclick*="skill"]');
        if (addSkillButton) {
            addSkillButton.addEventListener('click', function(e) {
                e.preventDefault();
                const skillCategory = this.closest('.skill-category');
                const skillTags = skillCategory.querySelector('.skill-tags');
                
                if (!skillTags.querySelector('.skill-input')) {
                    skillTags.appendChild(skillInput);
                    skillInput.focus();
                }
            });
        }
        
        skillInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && this.value.trim() !== '') {
                const skillTag = document.createElement('span');
                skillTag.classList.add('skill-tag');
                skillTag.textContent = this.value.trim();
                this.parentNode.insertBefore(skillTag, this);
                this.value = '';
            }
        });
        
        skillInput.addEventListener('blur', function() {
            if (this.value.trim() === '') {
                this.remove();
            }
        });
    }

    // Job save functionality
    document.querySelectorAll('.btn-save').forEach(button => {
        button.addEventListener('click', function() {
            this.classList.toggle('saved');
            this.innerHTML = this.classList.contains('saved') ? 
                '<i class="fas fa-bookmark"></i> Saved' : 
                '<i class="far fa-bookmark"></i> Save';
        });
    });

    // Job filter functionality
    const jobFilters = document.querySelectorAll('#job-type-filter, #experience-filter, #salary-filter, #local-jobs-toggle');
    jobFilters.forEach(filter => {
        filter.addEventListener('change', filterJobs);
    });

    function filterJobs() {
        // In a real app, this would make an API call with filter parameters
        console.log('Filtering jobs based on:', {
            type: document.getElementById('job-type-filter').value,
            experience: document.getElementById('experience-filter').value,
            salary: document.getElementById('salary-filter').value,
            localOnly: document.getElementById('local-jobs-toggle').checked
        });
    }

    // Course filter functionality
    const courseFilters = document.querySelectorAll('#category-filter, #level-filter, #platform-filter');
    courseFilters.forEach(filter => {
        filter.addEventListener('change', filterCourses);
    });

    function filterCourses() {
        // In a real app, this would make an API call with filter parameters
        console.log('Filtering courses based on:', {
            category: document.getElementById('category-filter').value,
            level: document.getElementById('level-filter').value,
            platform: document.getElementById('platform-filter').value
        });
    }

    // Profile analysis button
    const analyzeBtn = document.getElementById('analyze-profile');
    if (analyzeBtn) {
        analyzeBtn.addEventListener('click', function() {
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Analyzing...';
            
            // Simulate API call
            setTimeout(() => {
                this.innerHTML = '<i class="fas fa-check-circle"></i> Analysis Complete!';
                
                // Show a notification or redirect to results
                showNotification('Profile analysis complete! Check your recommendations.');
                
                // Reset button after delay
                setTimeout(() => {
                    this.innerHTML = '<i class="fas fa-brain"></i> Analyze My Profile with AI';
                }, 2000);
            }, 3000);
        });
    }

    // Generate resume button
    const generateResumeBtn = document.getElementById('generate-resume');
    if (generateResumeBtn) {
        generateResumeBtn.addEventListener('click', function() {
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
            
            // Simulate API call
            setTimeout(() => {
                this.innerHTML = '<i class="fas fa-file-download"></i> Download Resume';
                showNotification('Resume generated successfully!');
            }, 2000);
        });
    }

    // Notification function
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    // Add notification style dynamically
    const notificationStyle = document.createElement('style');
    notificationStyle.textContent = `
        .notification {
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background-color: var(--primary-color);
            color: white;
            padding: 12px 24px;
            border-radius: var(--radius);
            box-shadow: var(--shadow);
            z-index: 3000;
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        .notification.show {
            opacity: 1;
        }
    `;
    document.head.appendChild(notificationStyle);
});