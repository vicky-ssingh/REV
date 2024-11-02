document.addEventListener('DOMContentLoaded', function() {
    // Initialize Lucide icons
    lucide.createIcons();

    const form = document.getElementById('submissionForm');
    const steps = document.querySelectorAll('.step');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const progressBar = document.querySelector('.progress');
    const milestones = document.querySelectorAll('.milestone');
    let currentStep = 0;

    // Welcome screen
    const startSubmissionBtn = document.getElementById('startSubmission');
    startSubmissionBtn.addEventListener('click', () => {
        document.getElementById('welcome').classList.remove('active');
        showStep(0);
    });

    function showStep(n) {
        steps[currentStep].classList.remove('active');
        steps[n].classList.add('active');
        currentStep = n;

        updateButtons();
        updateProgressBar();
        updateMilestones();
    }

    function updateButtons() {
        prevBtn.style.display = currentStep === 0 ? 'none' : 'inline-block';
        nextBtn.textContent = currentStep === steps.length - 1 ? 'Submit' : 'Continue';
    }

    function updateProgressBar() {
        const progress = ((currentStep + 1) / steps.length) * 100;
        progressBar.style.width =   progress + '%';
    }

    function updateMilestones() {
        milestones.forEach((milestone, index) => {
            if (index <= currentStep) {
                milestone.classList.add('active');
            } else {
                milestone.classList.remove('active');
            }
        });
    }

    prevBtn.addEventListener('click', () => {
        if (currentStep > 0) showStep(currentStep - 1);
    });

    nextBtn.addEventListener('click', () => {
        if (currentStep < steps.length - 1) {
            if (validateStep()) {
                showStep(currentStep + 1);
            }
        } else {
            submitForm();
        }
    });

    function validateStep() {
        const inputs = steps[currentStep].querySelectorAll('input[required], textarea[required]');
        let isValid = true;
        inputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                input.classList.add('invalid');
                showValidationMessage(input, 'This field is required');
            } else {
                input.classList.remove('invalid');
                hideValidationMessage(input);
            }
        });
        return isValid;
    }

    function showValidationMessage(input, message) {
        let validationMessage = input.nextElementSibling;
        if (!validationMessage || !validationMessage.classList.contains('validation-message')) {
            validationMessage = document.createElement('div');
            validationMessage.classList.add('validation-message');
            input.parentNode.insertBefore(validationMessage, input.nextSibling);
        }
        validationMessage.textContent = message;
        validationMessage.style.color = 'red';
        input.classList.add('shake');
        setTimeout(() => input.classList.remove('shake'), 500);
    }

    function hideValidationMessage(input) {
        const validationMessage = input.nextElementSibling;
        if (validationMessage && validationMessage.classList.contains('validation-message')) {
            validationMessage.remove();
        }
    }

    function submitForm() {
        if (validateStep()) {
            alert('Form submitted successfully!');
            // Here you would typically send the form data to a server
        }
    }

    // Auto-save functionality
    const autoSaveInputs = document.querySelectorAll('input, textarea');
    autoSaveInputs.forEach(input => {
        input.addEventListener('input', debounce(() => {
            const autoSaveIndicator = input.parentNode.querySelector('.auto-save');
            autoSaveIndicator.style.display = 'flex';
            setTimeout(() => {
                autoSaveIndicator.style.display = 'none';
            }, 2000);
        }, 1000));
    });

    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Word counter for abstract
    const abstractTextarea = document.getElementById('abstract');
    const wordCounter = document.querySelector('.word-counter');
    abstractTextarea.addEventListener('input', () => {
        const wordCount = abstractTextarea.value.trim().split(/\s+/).length;
        wordCounter.textContent = `${wordCount} / 300 words`;
        if (wordCount > 300) {
            wordCounter.style.color = 'red';
        } else {
            wordCounter.style.color = '';
        }
    });

    // File upload handling
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileUpload');
    const filePreview = document.getElementById('filePreview');

    dropZone.addEventListener('click', () => fileInput.click());
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('dragover');
    });
    dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
        handleFiles(e.dataTransfer.files);
    });
    fileInput.addEventListener('change', () => handleFiles(fileInput.files));

    function handleFiles(files) {
        for (let file of files) {
            const fileItem = document.createElement('div');
            fileItem.classList.add('file-item');
            fileItem.innerHTML = `
                <i data-lucide="${getFileIcon(file.name)}"></i>
                <span>${file.name}</span>
            `;
            filePreview.appendChild(fileItem);
        }
        lucide.createIcons();
    }

    function getFileIcon(fileName) {
        const extension = fileName.split('.').pop().toLowerCase();
        switch (extension) {
            case 'pdf': return 'file-text';
            case 'doc':
            case 'docx': return 'file-type';
            case 'jpg':
            case 'jpeg':
            case 'png': return 'image';
            default: return 'file';
        }
    }

    // Contributor handling
    const addContributorBtn = document.getElementById('addContributor');
    const contributorList = document.getElementById('contributorList');
    let contributorCount = 0;

    addContributorBtn.addEventListener('click', () => {
        contributorCount++;
        const contributorDiv = document.createElement('div');
        contributorDiv.classList.add('contributor');
        contributorDiv.innerHTML = `
            <div class="contributor-header">
                <div class="contributor-avatar">${getInitials(`Contributor ${contributorCount}`)}</div>
                <h3>Contributor ${contributorCount}</h3>
                <button type="button" class="remove-contributor">Remove</button>
            </div>
            <input type="text" placeholder="Name" required>
            <input type="email" placeholder="Email" required>
            <select>
                <option value="author">Author</option>
                <option value="co-author">Co-Author</option>
            </select>
            <label>
                <input type="checkbox" class="primary-contact"> Primary Contact
            </label>
        `;
        contributorList.appendChild(contributorDiv);
    });

    contributorList.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-contributor')) {
            e.target.closest('.contributor').remove();
        }
    });

    function getInitials(name) {
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    }

    // Review summary
    function updateReviewSummary() {
        const summary = document.getElementById('reviewSummary');
        summary.innerHTML = `
            <h3>Article Details</h3>
            <p><strong>Title:</strong> ${document.getElementById('title').value}</p>
            <p><strong>Keywords:</strong> ${document.getElementById('keywords').value}</p>
            <p><strong>Abstract:</strong> ${document.getElementById('abstract').value}</p>
            
            <h3>Uploaded Files</h3>
            <ul>${Array.from(filePreview.children).map(li => li.textContent).join('')}</ul>
            
            <h3>Contributors</h3>
            ${contributorList.innerHTML}
            
            <h3>Editor Comments</h3>
            <p>${document.getElementById('editorComments').value || 'No comments provided.'}</p>
        `;
    }

    // Update review summary when navigating to the review step
    nextBtn.addEventListener('click', () => {
        if (currentStep === steps.length - 2) {
            updateReviewSummary();
        }
    });
});
