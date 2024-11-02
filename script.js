document.addEventListener('DOMContentLoaded', function() {
    // Initialize Lucide icons
    lucide.createIcons();

    const form = document.getElementById('submissionForm');
    const steps = document.querySelectorAll('.step');
    const stepLabels = document.querySelectorAll('.step-label');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const saveBtn = document.getElementById('saveBtn');
    const submitBtn = document.getElementById('submitBtn');
    const progressBar = document.querySelector('.progress');
    let currentStep = 0;

    function showStep(n) {
        steps[currentStep].classList.remove('active');
        stepLabels[currentStep].classList.remove('active');
        steps[n].classList.add('active');
        stepLabels[n].classList.add('active');
        currentStep = n;

        updateButtons();
        updateProgressBar();
    }

    function updateButtons() {
        prevBtn.style.display = currentStep === 0 ? 'none' : 'inline-block';
        if (currentStep === steps.length - 1) {
            nextBtn.style.display = 'none';
            submitBtn.style.display = 'inline-block';
        } else {
            nextBtn.style.display = 'inline-block';
            submitBtn.style.display = 'none';
        }
    }

    function updateProgressBar() {
        const progress = ((currentStep + 1) / steps.length) * 100;
        progressBar.style.width = `${progress}%`;
    }

    prevBtn.addEventListener('click', () => {
        if (currentStep > 0) showStep(currentStep - 1);
    });

    nextBtn.addEventListener('click', () => {
        if (validateStep()) {
            if (currentStep < steps.length - 1) showStep(currentStep + 1);
        }
    });

    saveBtn.addEventListener('click', () => {
        // Simulate saving progress
        showNotification('Progress saved successfully!');
    });

    submitBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (validateStep() && document.getElementById('confirmSubmission').checked) {
            // Simulate form submission
            showNotification('Submission successful!', 'success');
            // Add animation for successful submission
            const successAnimation = document.createElement('div');
            successAnimation.className = 'success-animation';
            successAnimation.innerHTML = '<i data-lucide="check-circle"></i>';
            document.body.appendChild(successAnimation);
            setTimeout(() => successAnimation.remove(), 3000);
        } else {
            showNotification('Please confirm your submission.', 'error');
        }
    });

    function validateStep() {
        const currentStepElement = steps[currentStep];
        const requiredFields = currentStepElement.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.classList.add('invalid');
                showNotification(`Please fill out the ${field.name} field.`, 'error');
            } else {
                field.classList.remove('invalid');
            }
        });

        return isValid;
    }

    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }

    // Character counter for title
    const titleInput = document.getElementById('title');
    const characterCounter = document.querySelector('.character-counter');
    titleInput.addEventListener('input', () => {
        const count = titleInput.value.length;
        characterCounter.textContent = `${count} / 200 characters`;
        if (count > 200) {
            characterCounter.style.color = 'red';
        } else {
            characterCounter.style.color = '';
        }
    });

    // Keywords tagging
    const keywordsInput = document.getElementById('keywords');
    const tagsContainer = document.querySelector('.tags');
    keywordsInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && keywordsInput.value.trim()) {
            e.preventDefault();
            const tag = document.createElement('span');
            tag.className = 'tag';
            tag.innerHTML = `${keywordsInput.value.trim()} <span class="remove">&times;</span>`;
            tagsContainer.appendChild(tag);
            keywordsInput.value = '';
        }
    });
    tagsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove')) {
            e.target.parentElement.remove();
        }
    });

    // Rich text editor
    const editorButtons = document.querySelectorAll('.editor-toolbar button');
    const editorContent = document.getElementById('abstract');
    editorButtons.forEach(button => {
        button.addEventListener('click', () => {
            const command = button.dataset.command;
            document.execCommand(command, false, null);
        });
    });

    // File upload
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileUpload');
    const fileList = document.getElementById('fileList');

    uploadArea.addEventListener('click', () => fileInput.click());
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('dragover');
    });
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        handleFiles(e.dataTransfer.files);
    });
    fileInput.addEventListener('change', () => handleFiles(fileInput.files));

    function handleFiles(files) {
        for (let file of files) {
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';
            fileItem.innerHTML = `
                <i data-lucide="${getFileIcon(file.name)}"></i>
                <span>${file.name}</span>
                <button class="remove-file">&times;</button>
            `;
            fileList.appendChild(fileItem);
            lucide.createIcons();
        }
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

    fileList.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-file')) {
            e.target.closest('.file-item').remove();
        }
    });

    // Contributors
    const addContributorBtn = document.getElementById('addContributor');
    const contributorList = document.getElementById('contributorList');
    const contributorModal = document.getElementById('contributorModal');
    const contributorForm = document.getElementById('contributorForm');
    const cancelContributorBtn = document.getElementById('cancelContributor');

    addContributorBtn.addEventListener('click', () => {
        contributorModal.style.display = 'block';
    });

    cancelContributorBtn.addEventListener('click', () => {
        contributorModal.style.display = 'none';
    });

    contributorForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('contributorName').value;
        const email = document.getElementById('contributorEmail').value;
        const role = document.getElementById('contributorRole').value;
        const isPrimary = document.getElementById('isPrimaryContact').checked;

        const contributorCard = document.createElement('div');
        contributorCard.className = 'contributor-card';
        contributorCard.innerHTML = `
            <div class="contributor-info">
                <h3>${name}</h3>
                <p>${email} - ${role}</p>
                ${isPrimary ? '<span class="primary-badge">Primary Contact</span>' : ''}
            </div>
            <div class="contributor-actions">
                <button class="edit-contributor">Edit</button>
                <button class="remove-contributor">Remove</button>
            </div>
        `;
        contributorList.appendChild(contributorCard);
        contributorModal.style.display = 'none';
        contributorForm.reset();
    });

    contributorList.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-contributor')) {
            e.target.closest('.contributor-card').remove();
        } else if (e.target.classList.contains('edit-contributor')) {
            // Implement edit functionality
        }
    });

    // Help panel
    const helpIcon = document.getElementById('helpIcon');
    const helpPanel = document.getElementById('helpPanel');
    helpIcon.addEventListener('click', () => {
        helpPanel.style.display = helpPanel.style.display === 'none' ? 'block' : 'none';
    });

    // Review summary
    function updateReviewSummary() {
        const summary = document.getElementById('reviewSummary');
        summary.innerHTML = `
            <h3>Article Details</h3>
            <p><strong>Title:</strong> ${document.getElementById('title').value}</p>
            <p><strong>Keywords:</strong> ${Array.from(document.querySelectorAll('.tag')).map(tag => tag.textContent.trim()).join(', ')}</p>
            <p><strong>Abstract:</strong> ${document.getElementById('abstract').innerHTML}</p>
            
            <h3>Uploaded Files</h3>
            <ul>${Array.from(document.querySelectorAll('.file-item')).map(item => `<li>${item.textContent}</li>`).join('')}</ul>
            
            <h3>Contributors</h3>
            ${Array.from(document.querySelectorAll('.contributor-card')).map(card => `<p>${card.querySelector('h3').textContent} - ${card.querySelector('p').textContent}</p>`).join('')}
            
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
