document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.querySelector('.contact-card form');
  
  if (!contactForm) return;

  // Add unique id attributes to form elements programmatically if missing for automation
  const inputs = contactForm.querySelectorAll('input, select, textarea');
  inputs.forEach(input => {
    if (!input.id) {
      input.id = `input-${input.name || 'field'}`;
    }
  });

  // Set up invalid-feedback placeholders programmatically if not already present
  inputs.forEach(input => {
    let parent = input.parentElement;
    let feedback = parent.querySelector('.invalid-feedback');
    if (!feedback) {
      feedback = document.createElement('div');
      feedback.className = 'invalid-feedback';
      
      // Determine placeholder messaging
      if (input.type === 'email') {
        feedback.textContent = 'Please enter a valid email address.';
      } else if (input.tagName === 'SELECT') {
        feedback.textContent = 'Please select a service category.';
      } else {
        feedback.textContent = `Please enter your ${input.name || 'details'}.`;
      }
      
      parent.appendChild(feedback);
    }
  });

  /**
   * Safe email format validation helper
   */
  const isValidEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  /**
   * Performs form field validation checks
   */
  const validateField = (input) => {
    let isValid = true;
    const val = input.value.trim();

    if (input.hasAttribute('required') || ['name', 'email', 'message', 'category'].includes(input.name)) {
      if (val === '') {
        isValid = false;
      }
    }

    if (isValid && input.type === 'email') {
      if (!isValidEmail(val)) {
        isValid = false;
      }
    }

    // Toggle styling classes based on validation result
    if (isValid) {
      input.classList.remove('is-invalid');
    } else {
      input.classList.add('is-invalid');
    }

    return isValid;
  };

  // Attach immediate blur events for instant error highlighting
  inputs.forEach(input => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => {
      if (input.classList.contains('is-invalid')) {
        validateField(input);
      }
    });
  });

  /**
   * Premium modal injector and trigger
   */
  const launchSuccessModal = (name) => {
    // Check if modal already exists in body, if not create and inject
    let overlay = document.querySelector('#success-modal-overlay');
    
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'success-modal-overlay';
      overlay.className = 'success-modal-overlay';
      overlay.innerHTML = `
        <div class="success-modal-card" id="success-modal-card-block" data-aos="zoom-in">
          <div class="success-modal-icon" id="success-modal-icon-block">
            <i class="fa-solid fa-circle-check"></i>
          </div>
          <h3 class="success-modal-title" id="success-modal-title-heading">Message Sent!</h3>
          <p class="success-modal-desc" id="success-modal-desc-body">
            Thank you <strong id="success-user-name">Guest</strong>. We have received your inquiry for facility services. Our operations team will contact you within one business day.
          </p>
          <button class="btn btn-primary" id="btn-success-modal-close" style="width: 100%;">Close</button>
        </div>
      `;
      document.body.appendChild(overlay);
      
      // Attach click closing actions
      const closeBtn = overlay.querySelector('#btn-success-modal-close');
      closeBtn.addEventListener('click', () => {
        overlay.classList.remove('active');
        contactForm.reset();
      });
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          overlay.classList.remove('active');
          contactForm.reset();
        }
      });
    }

    // Inject User Name dynamically
    const nameSpan = overlay.querySelector('#success-user-name');
    if (nameSpan) nameSpan.textContent = name;

    // Show modal overlay
    overlay.classList.add('active');
  };

  // Intercept submit button action
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    let isFormValid = true;
    let firstInvalidInput = null;

    inputs.forEach(input => {
      const isFieldValid = validateField(input);
      if (!isFieldValid) {
        isFormValid = false;
        if (!firstInvalidInput) firstInvalidInput = input;
      }
    });

    if (isFormValid) {
      const nameVal = contactForm.querySelector('[name="name"]')?.value || 'Guest';
      
      // Programmatically trigger a gorgeous success modal popup
      launchSuccessModal(nameVal);
    } else if (firstInvalidInput) {
      // Focus on the first problematic element automatically
      firstInvalidInput.focus();
    }
  });
});
