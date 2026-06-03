/**
 * 4F Integrated Facility Services - Get a Quote Form Wizard Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('#quote-wizard-form');
  if (!form) return;

  const steps = Array.from(document.querySelectorAll('.step-content'));
  const indicators = Array.from(document.querySelectorAll('.step-indicator'));
  const progressFill = document.querySelector('.stepper-progress-fill');
  const prevBtn = document.querySelector('#btn-prev');
  const nextBtn = document.querySelector('#btn-next');
  
  let currentStep = 0;

  // Range Slider Value dynamic indicator
  const rangeSlider = document.querySelector('#facility-size');
  const rangeValueText = document.querySelector('#facility-size-value');
  
  if (rangeSlider && rangeValueText) {
    rangeSlider.addEventListener('input', (e) => {
      // Format number with commas
      const value = parseInt(e.target.value).toLocaleString();
      rangeValueText.textContent = `${value} Sq. Ft.`;
    });
  }

  // Interactive toggle checkcard active styles
  const checkCards = document.querySelectorAll('.checkbox-card');
  checkCards.forEach(card => {
    const checkbox = card.querySelector('input[type="checkbox"], input[type="radio"]');
    
    // Initial state
    if (checkbox && checkbox.checked) {
      card.classList.add('active');
    }

    card.addEventListener('click', () => {
      if (checkbox) {
        if (checkbox.type === 'radio') {
          // Uncheck all radios in matching name group
          const groupName = checkbox.name;
          const siblings = document.querySelectorAll(`input[name="${groupName}"]`);
          siblings.forEach(sibling => {
            sibling.closest('.checkbox-card').classList.remove('active');
          });
          checkbox.checked = true;
          card.classList.add('active');
        } else {
          // Toggle checkbox check
          checkbox.checked = !checkbox.checked;
          card.classList.toggle('active', checkbox.checked);
        }
        validateStep(currentStep); // Re-validate step instantly
      }
    });

    // Make sure direct clicks to checkbox indicator are handled smoothly
    if (checkbox) {
      checkbox.addEventListener('click', (e) => {
        e.stopPropagation(); // Avoid double click toggle
        card.classList.toggle('active', checkbox.checked);
        validateStep(currentStep);
      });
    }
  });

  // ==========================================================================
  // Stepper Navigation Utilities
  // ==========================================================================
  const updateStepperLayout = () => {
    // 1. Toggle Step Container visibility
    steps.forEach((step, index) => {
      step.classList.toggle('active', index === currentStep);
    });

    // 2. Update Header Progress Indicators
    indicators.forEach((indicator, index) => {
      indicator.classList.remove('active', 'completed');
      if (index === currentStep) {
        indicator.classList.add('active');
      } else if (index < currentStep) {
        indicator.classList.add('completed');
      }
    });

    // 3. Update Progress Timeline Line Fill
    const fillPercent = (currentStep / (steps.length - 1)) * 100;
    if (progressFill) progressFill.style.width = `${fillPercent}%`;

    // 4. Update Navigation Buttons visibility
    if (currentStep === 0) {
      prevBtn.classList.add('hidden');
    } else {
      prevBtn.classList.remove('hidden');
    }

    if (currentStep === steps.length - 1) {
      nextBtn.textContent = 'Submit Request';
      nextBtn.classList.add('btn-primary');
      nextBtn.classList.remove('btn-secondary');
    } else {
      nextBtn.textContent = 'Continue';
      nextBtn.classList.remove('btn-primary');
      nextBtn.classList.add('btn-secondary');
    }
  };

  // ==========================================================================
  // Validations per Wizard Step
  // ==========================================================================
  const validateStep = (stepIndex) => {
    let isValid = true;
    const stepContainer = steps[stepIndex];

    if (stepIndex === 0) {
      // Step 1: Select at least one Service
      const checkedServices = stepContainer.querySelectorAll('input[name="services"]:checked');
      const errorMsg = stepContainer.querySelector('.invalid-feedback');
      
      if (checkedServices.length === 0) {
        isValid = false;
        if (errorMsg) errorMsg.style.display = 'block';
      } else {
        if (errorMsg) errorMsg.style.display = 'none';
      }
    } 
    else if (stepIndex === 1) {
      // Step 2: Slider sizing is always valid (has defaults), but facility type is checked
      const checkedType = stepContainer.querySelector('input[name="facility-type"]:checked');
      const errorMsg = stepContainer.querySelector('.invalid-feedback');
      
      if (!checkedType) {
        isValid = false;
        if (errorMsg) errorMsg.style.display = 'block';
      } else {
        if (errorMsg) errorMsg.style.display = 'none';
      }
    } 
    else if (stepIndex === 2) {
      // Step 3: Contact details fields (Mandatory fields: Name, Email, Phone)
      const nameInput = document.querySelector('#contact-name');
      const emailInput = document.querySelector('#contact-email');
      const phoneInput = document.querySelector('#contact-phone');

      // Name validation
      if (!nameInput.value.trim()) {
        nameInput.classList.add('is-invalid');
        isValid = false;
      } else {
        nameInput.classList.remove('is-invalid');
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailInput.value.trim() || !emailRegex.test(emailInput.value)) {
        emailInput.classList.add('is-invalid');
        isValid = false;
      } else {
        emailInput.classList.remove('is-invalid');
      }

      // Phone validation (numbers 10-15 digits)
      const phoneRegex = /^[0-9+() -]{10,15}$/;
      if (!phoneInput.value.trim() || !phoneRegex.test(phoneInput.value)) {
        phoneInput.classList.add('is-invalid');
        isValid = false;
      } else {
        phoneInput.classList.remove('is-invalid');
      }
    }

    return isValid;
  };

  // Attach real-time validation triggers on input loss
  const contactInputs = document.querySelectorAll('#contact-name, #contact-email, #contact-phone');
  contactInputs.forEach(input => {
    input.addEventListener('blur', () => {
      validateStep(2);
    });
    input.addEventListener('input', () => {
      if (input.classList.contains('is-invalid')) {
        validateStep(2);
      }
    });
  });

  // ==========================================================================
  // Populate Confirmation details
  // ==========================================================================
  const compileQuoteSummaryData = () => {
    const summaryServices = document.querySelector('#summary-services');
    const summaryFacility = document.querySelector('#summary-facility');
    const summaryContact = document.querySelector('#summary-contact');

    // Compile selected services
    const checkedServices = Array.from(document.querySelectorAll('input[name="services"]:checked'))
      .map(checkbox => checkbox.closest('.checkbox-card').querySelector('.checkbox-card-title').textContent.trim());
    
    if (summaryServices) {
      summaryServices.textContent = checkedServices.join(', ');
    }

    // Compile facility profile
    const facilitySizeVal = rangeSlider ? rangeSlider.value : '0';
    const checkedType = document.querySelector('input[name="facility-type"]:checked');
    const facilityTypeName = checkedType ? checkedType.closest('.checkbox-card').querySelector('.checkbox-card-title').textContent.trim() : 'N/A';
    
    if (summaryFacility) {
      summaryFacility.textContent = `${facilityTypeName} (${parseInt(facilitySizeVal).toLocaleString()} Sq. Ft.)`;
    }

    // Compile contact profiles
    const nameVal = document.querySelector('#contact-name').value;
    const emailVal = document.querySelector('#contact-email').value;
    const phoneVal = document.querySelector('#contact-phone').value;
    
    if (summaryContact) {
      summaryContact.innerHTML = `<strong>${nameVal}</strong><br>Email: ${emailVal}<br>Phone: ${phoneVal}`;
    }
  };

  // ==========================================================================
  // Navigation Button Handlers
  // ==========================================================================
  nextBtn.addEventListener('click', () => {
    if (validateStep(currentStep)) {
      if (currentStep < steps.length - 1) {
        currentStep++;
        updateStepperLayout();
        
        // Compile summary data before displaying final validation screen
        if (currentStep === 3) {
          compileQuoteSummaryData();
        }
      } else {
        // Form submitted: Render ultimate success page animations
        triggerFormSuccess();
      }
    }
  });

  prevBtn.addEventListener('click', () => {
    if (currentStep > 0) {
      currentStep--;
      updateStepperLayout();
    }
  });

  const triggerFormSuccess = () => {
    const wizardContent = document.querySelector('#wizard-interactive-box');
    const successFrame = document.querySelector('#wizard-success-box');
    const ticketId = document.querySelector('#success-ticket-id-val');
    
    // Disable nextBtn and show loading state
    nextBtn.disabled = true;
    nextBtn.innerHTML = 'Submitting... <i class="fa-solid fa-spinner fa-spin"></i>';

    const timestampId = Date.now();
    const ticketIdVal = `4F-${timestampId}`;

    // Gather selected services
    const checkedServices = Array.from(document.querySelectorAll('input[name="services"]:checked'))
      .map(checkbox => checkbox.closest('.checkbox-card').querySelector('.checkbox-card-title').textContent.trim());
    
    // Gather facility details
    const facilitySizeVal = rangeSlider ? rangeSlider.value : '0';
    const checkedType = document.querySelector('input[name="facility-type"]:checked');
    const facilityTypeName = checkedType ? checkedType.closest('.checkbox-card').querySelector('.checkbox-card-title').textContent.trim() : 'N/A';

    // Gather contact info
    const nameVal = document.querySelector('#contact-name').value;
    const companyVal = document.querySelector('#contact-company').value || '';
    const emailVal = document.querySelector('#contact-email').value;
    const phoneVal = document.querySelector('#contact-phone').value;
    const msgVal = document.querySelector('#contact-msg').value || '';

    // Prepare parameters for Google Apps Script parameter parsing
    const params = new URLSearchParams();
    params.append('ticketId', ticketIdVal);
    params.append('services', checkedServices.join(', '));
    params.append('facilityType', facilityTypeName);
    params.append('facilitySize', facilitySizeVal);
    params.append('name', nameVal);
    params.append('company', companyVal);
    params.append('email', emailVal);
    params.append('phone', phoneVal);
    params.append('message', msgVal);

    const scriptUrl = 'https://script.google.com/macros/s/AKfycbw0EXgejX49qHe4sSVuoEFZIw_X3L4kXdtUzpzXq3KuE1web50nhW7O8bm8UmVH7HuV9A/exec';

    fetch(scriptUrl, {
      method: 'POST',
      mode: 'no-cors', // standard redirect bypass for script post requests
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params
    })
    .then(() => {
      // Transition to success screen
      if (ticketId) ticketId.textContent = ticketIdVal;
      if (wizardContent && successFrame) {
        wizardContent.style.display = 'none';
        successFrame.style.display = 'flex';
        
        indicators.forEach(indicator => {
          indicator.classList.remove('active');
          indicator.classList.add('completed');
        });
        if (progressFill) progressFill.style.width = '100%';
        successFrame.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    })
    .catch(err => {
      console.error('Error submitting form data:', err);
      // Fallback display success screen anyway so form doesn't hang in case of network block
      if (ticketId) ticketId.textContent = ticketIdVal;
      if (wizardContent && successFrame) {
        wizardContent.style.display = 'none';
        successFrame.style.display = 'flex';
        
        indicators.forEach(indicator => {
          indicator.classList.remove('active');
          indicator.classList.add('completed');
        });
        if (progressFill) progressFill.style.width = '100%';
        successFrame.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  };

  // Initialize view
  updateStepperLayout();
});
