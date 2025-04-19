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
            hamburger.clasdocument.addEventListener('DOMContentLoaded', function() {
                // Loader
                setTimeout(function() {
                    document.querySelector('.loader').classList.add('fade-out');
                }, 1000);
                
                // Mobile Menu Toggle
                const hamburger = document.querySelector('.hamburger');
                const navLinks = document.querySelector('.nav-links');
                
                if (hamburger && navLinks) {
                    hamburger.addEventListener('click', function() {
                        this.classList.toggle('active');
                        navLinks.classList.toggle('active');
                    });
                }
                
                // Header Scroll Effect
                const header = document.querySelector('.header');
                
                window.addEventListener('scroll', function() {
                    if (window.scrollY > 50) {
                        header.classList.add('scrolled');
                    } else {
                        header.classList.remove('scrolled');
                    }
                });
                
                // Profile Tabs
                const profileMenuItems = document.querySelectorAll('.profile-menu li');
                const profileTabs = document.querySelectorAll('.profile-tab');
                
                if (profileMenuItems.length && profileTabs.length) {
                    profileMenuItems.forEach(item => {
                        item.addEventListener('click', function() {
                            // Remove active class from all items and tabs
                            profileMenuItems.forEach(i => i.classList.remove('active'));
                            profileTabs.forEach(tab => tab.classList.remove('active'));
                            
                            // Add active class to clicked item
                            this.classList.add('active');
                            
                            // Show corresponding tab
                            const tabId = this.querySelector('a').getAttribute('href');
                            document.querySelector(tabId).classList.add('active');
                        });
                    });
                }
                
                // Salary Range Slider
                const salarySlider = document.getElementById('salary');
                const salaryValue = document.querySelector('.salary-value');
                
                if (salarySlider && salaryValue) {
                    salarySlider.addEventListener('input', function() {
                        const value = parseInt(this.value).toLocaleString('en-IN');
                        salaryValue.textContent = `₹${value}`;
                    });
                }
                
                // Course and Job Card Animations
                const animateOnScroll = function() {
                    const elements = document.querySelectorAll('.slide-up, .slide-left, .slide-right, .pop-in');
                    
                    elements.forEach(element => {
                        const elementPosition = element.getBoundingClientRect().top;
                        const windowHeight = window.innerHeight;
                        
                        if (elementPosition < windowHeight - 100) {
                            element.style.opacity = '1';
                            element.style.transform = 'translate(0, 0)';
                        }
                    });
                };
                
                // Set initial state for animated elements
                document.querySelectorAll('.slide-up').forEach(el => {
                    el.style.opacity = '0';
                    el.style.transform = 'translateY(50px)';
                });
                
                document.querySelectorAll('.slide-left').forEach(el => {
                    el.style.opacity = '0';
                    el.style.transform = 'translateX(-50px)';
                });
                
                document.querySelectorAll('.slide-right').forEach(el => {
                    el.style.opacity = '0';
                    el.style.transform = 'translateX(50px)';
                });
                
                document.querySelectorAll('.pop-in').forEach(el => {
                    el.style.opacity = '0';
                    el.style.transform = 'scale(0.5)';
                });
                
                // Run animation check on scroll and load
                window.addEventListener('scroll', animateOnScroll);
                window.addEventListener('load', animateOnScroll);
                
                // Skill Tag Removal
                document.querySelectorAll('.skill-tag i').forEach(icon => {
                    icon.addEventListener('click', function() {
                        this.parentElement.remove();
                    });
                });
                
                // Add New Skill
                const skillInput = document.querySelector('.skill-input input');
                const addSkillBtn = document.querySelector('.skill-input .btn');
                
                if (skillInput && addSkillBtn) {
                    addSkillBtn.addEventListener('click', function() {
                        const skillName = skillInput.value.trim();
                        if (skillName) {
                            const skillTag = document.createElement('span');
                            skillTag.className = 'skill-tag';
                            skillTag.innerHTML = `${skillName} <i class="fas fa-times"></i>`;
                            
                            document.querySelector('.skill-tags').appendChild(skillTag);
                            skillInput.value = '';
                            
                            // Add event listener to new tag's remove icon
                            skillTag.querySelector('i').addEventListener('click', function() {
                                this.parentElement.remove();
                            });
                        }
                    });
                }
                
                // Pagination
                const paginationButtons = document.querySelectorAll('.pagination .btn-small');
                
                paginationButtons.forEach(button => {
                    button.addEventListener('click', function() {
                        paginationButtons.forEach(btn => btn.classList.remove('active'));
                        this.classList.add('active');
                    });
                });
                
                // Level/Type/Exp Buttons
                const levelButtons = document.querySelectorAll('.level-buttons .btn-small');
                const typeButtons = document.querySelectorAll('.type-buttons .btn-small');
                const expButtons = document.querySelectorAll('.exp-buttons .btn-small');
                
                levelButtons.forEach(button => {
                    button.addEventListener('click', function() {
                        levelButtons.forEach(btn => btn.classList.remove('active'));
                        this.classList.add('active');
                    });
                });
                
                typeButtons.forEach(button => {
                    button.addEventListener('click', function() {
                        typeButtons.forEach(btn => btn.classList.remove('active'));
                        this.classList.add('active');
                    });
                });
                
                expButtons.forEach(button => {
                    button.addEventListener('click', function() {
                        expButtons.forEach(btn => btn.classList.remove('active'));
                        this.classList.add('active');
                    });
                });
                
                // Login/Signup Buttons
                const loginBtn = document.querySelector('.btn-login');
                const signupBtn = document.querySelector('.btn-signup');
                
                if (loginBtn) {
                    loginBtn.addEventListener('click', function() {
                        alert('Login functionality will be implemented in the backend');
                    });
                }
                
                if (signupBtn) {
                    signupBtn.addEventListener('click', function() {
                        alert('Signup functionality will be implemented in the backend');
                    });
                }
                
                // Course/Job Apply Buttons
                document.querySelectorAll('.course-card .btn-small, .job-card .btn-primary').forEach(button => {
                    button.addEventListener('click', function(e) {
                        e.preventDefault();
                        alert('This action will be handled by the backend system');
                    });
                });
            });sList.remove('active');
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