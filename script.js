document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('submissionForm');
    const tabs = document.querySelectorAll('.tab-button');
    const contents = document.querySelectorAll('.tab-content');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const saveBtn = document.getElementById('saveBtn');
    const submitBtn = document.getElementById('submitBtn');
    const progressBar = document.querySelector('.progress');
    let currentTab = 0;

    // Initialize Lucide icons
    lucide.createIcons();

    function showTab(n) {
        contents[currentTab].classList.remove('active');
        tabs[currentTab].classList.remove('active');
        contents[n].classList.add('active');
        tabs[n].classList.add('active');
        currentTab = n;

        if (currentTab === 0) {
            prevBtn.style.display = 'none';
        } else {
            prevBtn.style.display = 'inline-block';
        }

        if (currentTab === tabs.length - 1) {
            nextBtn.style.display = 'none';
            submitBtn.style.display = 'inline-block';
            updateReviewTab();
        } else {
            nextBtn.style.display = 'inline-block';
            submitBtn.style.display = 'none';
        }

        updateProgressBar();
    }

    function nextPrev(n) {
        if (n === 1 && !validateForm()) return false;
        showTab(currentTab + n);
    }

    function validateForm() {
        let valid = true;
        const inputs = contents[currentTab].getElementsByTagName('input');
        for (let i = 0; i < inputs.length; i++) {
            if (inputs[i].hasAttribute('required') && inputs[i].value === '') {
                inputs[i].classList.add('invalid');
                valid = false;
            } else {
                inputs[i].classList.remove('invalid');
            }
        }
        if (!valid) {
            alert('Please fill out all required fields.');
        }
        return valid;
    }

    function updateProgressBar() {
        const progress = ((currentTab + 1) / tabs.length) * 100;
        progressBar.style.width = progress + '%';
    }

    function updateReviewTab() {
        const summary = document.getElementById('reviewSummary');
        summary.innerHTML = `
            <h3>Article Details</h3>
            <p><strong>Title:</strong> ${document.getElementById('title').value}</p>
            <p><strong>Keywords:</strong> ${document.getElementById('keywords').value}</p>
            <p><strong>Abstract:</strong> ${document.getElementById('abstract').value}</p>
            
            <h3>Uploaded Files</h3>
            <ul>${Array.from(document.getElementById('fileList').children).map(li => li.textContent).join('')}</ul>
            
            <h3>Contributors</h3>
            ${document.getElementById('contributorList').innerHTML}
            
            <h3>Editor Comments</h3>
            <p>${document.getElementById('editorComments').value || 'No comments provided.'}</p>
        `;
    }

    // Event listeners
    prevBtn.addEventListener('click', () => nextPrev(-1));
    nextBtn.addEventListener('click', () => nextPrev(1));
    saveBtn.addEventListener('click', () => alert('Progress saved!'));
    submitBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (validateForm()) {
            alert('Form submitted successfully!');
        }
    });

    // File upload handling
    const uploadArea = document.querySelector('.upload-area');
    const fileInput = document.getElementById('fileUpload');
    const fileList = document.getElementById('fileList');

    uploadArea.addEventListener('click', () => fileInput.click());
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });
    uploadArea.addEventListener('dragleave', () => uploadArea.classList.remove('dragover'));
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        handleFiles(e.dataTransfer.files);
    });
    fileInput.addEventListener('change', () => handleFiles(fileInput.files));

    function handleFiles(files) {
        for (let file of files) {
            const li = document.createElement('li');
            li.textContent = file.name;
            fileList.appendChild(li);
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
            <h3>Contributor ${contributorCount}</h3>
            <input type="text" placeholder="Name" required>
            <input type="email" placeholder="Email" required>
            <select>
                <option value="author">Author</option>
                <option value="co-author">Co-Author</option>
            </select>
            <label>
                <input type="checkbox" class="primary-contact"> Primary Contact
            </label>
            <button type="button" class="remove-contributor">Remove</button>
        `;
        contributorList.appendChild(contributorDiv);
    });

    contributorList.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-contributor')) {
            e.target.closest('.contributor').remove();
        }
    });

    // Initialize the form
    showTab(currentTab);
});
