const resetBtn = document.getElementById("resetBtn");
const form = document.getElementById("loginForm");

resetBtn.addEventListener("click", () => {
  // Reset input fields
  form.reset();

  // Trigger rotate animation
  form.classList.add("rotated");

  // Remove the class to allow future re-triggers
  setTimeout(() => {
    form.classList.remove("rotated");
  }, 800);
});


document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const uploadBtn = document.getElementById('upload-btn');
    const resumeInput = document.getElementById('resume-upload');
    const resumePreview = document.getElementById('resume-preview');
    const fileNameDisplay = document.createElement('span');
    fileNameDisplay.className = 'file-name';
    resumePreview.parentNode.insertBefore(fileNameDisplay, resumePreview.nextSibling);

    // Configuration
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    const ALLOWED_TYPES = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain'
    ];

    // Initialize from local storage
    loadResumeFromStorage();

    // Event Listeners
    uploadBtn.addEventListener('click', triggerFileInput);
    resumeInput.addEventListener('change', handleFileUpload);

    function triggerFileInput() {
        resumeInput.value = ''; // Clear previous selection
        resumeInput.click();
    }

    function handleFileUpload(e) {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file
        if (!validateFile(file)) return;

        // Read file
        const reader = new FileReader();
        reader.onload = function(e) {
            saveResumeToStorage(file.name, e.target.result);
            displayResume(file.name, e.target.result);
            showFeedback('Resume uploaded successfully!', 'success');
        };
        reader.onerror = function() {
            showFeedback('Error reading file', 'error');
        };
        reader.readAsDataURL(file);
    }

    function validateFile(file) {
        // Check file type
        if (!ALLOWED_TYPES.includes(file.type)) {
            showFeedback('Only PDF, DOC, DOCX, or TXT files are allowed', 'error');
            return false;
        }

        // Check file size
        if (file.size > MAX_FILE_SIZE) {
            showFeedback('File size exceeds 5MB limit', 'error');
            return false;
        }

        return true;
    }

    function displayResume(name, data) {
        // Update file name display
        fileNameDisplay.textContent = name;

        // Clear previous preview
        resumePreview.innerHTML = '';

        // Create appropriate display based on file type
        if (name.endsWith('.pdf')) {
            // PDF preview
            const iframe = document.createElement('iframe');
            iframe.src = data;
            iframe.className = 'pdf-preview';
            resumePreview.appendChild(iframe);
        } else {
            // Download link for other formats
            const downloadLink = document.createElement('a');
            downloadLink.href = data;
            downloadLink.textContent = 'Download Resume';
            downloadLink.download = name;
            downloadLink.className = 'download-link';
            resumePreview.appendChild(downloadLink);

            // Optional: Add icon based on file type
            const icon = document.createElement('i');
            icon.className = getFileIcon(name);
            downloadLink.insertBefore(icon, downloadLink.firstChild);
        }
    }

    function getFileIcon(filename) {
        if (filename.endsWith('.pdf')) return 'fas fa-file-pdf';
        if (filename.endsWith('.doc') || filename.endsWith('.docx')) return 'fas fa-file-word';
        if (filename.endsWith('.txt')) return 'fas fa-file-alt';
        return 'fas fa-file';
    }

    function saveResumeToStorage(name, data) {
        const resumeData = {
            name: name,
            data: data,
            lastUpdated: new Date().toISOString()
        };
        localStorage.setItem('userResume', JSON.stringify(resumeData));
    }

    function loadResumeFromStorage() {
        const savedResume = localStorage.getItem('userResume');
        if (savedResume) {
            try {
                const { name, data } = JSON.parse(savedResume);
                displayResume(name, data);
            } catch (e) {
                console.error('Error loading resume from storage:', e);
                localStorage.removeItem('userResume');
            }
        }
    }

    function showFeedback(message, type) {
        const feedback = document.createElement('div');
        feedback.className = `feedback ${type}`;
        feedback.textContent = message;
        document.body.appendChild(feedback);

        setTimeout(() => {
            feedback.classList.add('fade-out');
            setTimeout(() => feedback.remove(), 300);
        }, 3000);
    }
});
