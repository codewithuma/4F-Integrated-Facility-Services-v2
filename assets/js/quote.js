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

  // Configuration mapping from Step 1 service values to Step 2 facility details (Option A)
  const SERVICE_FACILITY_MAPPING = {
    'fire-extinguishers': [
      { value: 'manufacturing', title: 'Manufacturing Units', desc: 'Factories, production lines, and industrial processing zones.' },
      { value: 'sez', title: 'Special Economic Zone (SEZ)', desc: 'High-compliance corporate enclaves and tech parks.' },
      { value: 'pharma', title: 'Pharma Companies', desc: 'Cleanrooms, labs, and specialized pharmaceutical manufacturing.' },
      { value: 'all-companies', title: 'All Type Companies', desc: 'General corporate offices, retail outlets, and warehouses.' }
    ],
    'fire-amc': [
      { value: 'manufacturing', title: 'Manufacturing Units', desc: 'Factories, production lines, and industrial processing zones.' },
      { value: 'sez', title: 'Special Economic Zone (SEZ)', desc: 'High-compliance corporate enclaves and tech parks.' },
      { value: 'pharma', title: 'Pharma Companies', desc: 'Cleanrooms, labs, and specialized pharmaceutical manufacturing.' },
      { value: 'all-companies', title: 'All Type Companies', desc: 'General corporate offices, retail outlets, and warehouses.' }
    ],
    'fire-noc': [
      { value: 'manufacturing', title: 'Manufacturing Units', desc: 'Factories, production lines, and industrial processing zones.' },
      { value: 'sez', title: 'Special Economic Zone (SEZ)', desc: 'High-compliance corporate enclaves and tech parks.' },
      { value: 'pharma', title: 'Pharma Companies', desc: 'Cleanrooms, labs, and specialized pharmaceutical manufacturing.' },
      { value: 'all-companies', title: 'All Type Companies', desc: 'General corporate offices, retail outlets, and warehouses.' },
      { value: 'fire-architecture', title: '1. Fire Architecture Available? *', desc: 'Please select if Fire Architecture is available.', isQuestion: true },
      { value: 'proposal-available', title: '2. Proposal Available? *', desc: 'Please select if Proposal is available.', isQuestion: true }
    ],
    'housekeeping': [
      { value: 'residential-apartments', title: 'Residential Apartments & Villas', desc: 'Societies, gated developments, and luxury estates.' },
      { value: 'schools', title: 'Schools & Educational Inst.', desc: 'Classrooms, campuses, libraries, and administrative blocks.' },
      { value: 'hospitals', title: 'Hospitals & Healthcare', desc: 'Clinics, nursing homes, and clinical environments.' },
      { value: 'front-offices', title: 'Front Offices / Reception', desc: 'Corporate lobbies, visitor areas, and front desks.' },
      { value: 'shopping-malls', title: 'Shopping Malls & Retail', desc: 'Outlets, public walkways, and food courts.' }
    ],
    'deep-cleaning': [
      { value: 'specialized-residential', title: 'Specialized Residential Houses', desc: 'Post-construction, move-in/out, and premium villas.' },
      { value: 'commercial-offices', title: 'Commercial Offices & Workspaces', desc: 'Corporate floors, meeting rooms, and tech setups.' }
    ],
    'security': [
      { value: 'gated-communities', title: 'Gated Communities', desc: 'Residential associations, villas, and housing estates.' },
      { value: 'commercial-offices', title: 'Commercial Offices & Workspaces', desc: 'IT parks, business towers, and office entries.' },
      { value: 'sez', title: 'Special Economic Zone (SEZ)', desc: 'Strict access control zones and secure perimeters.' },
      { value: 'shopping-malls', title: 'Shopping Malls & Retail', desc: 'Crowd management, parking control, and loss prevention.' },
      { value: 'in-person-security', title: 'In-Person Security Guard', desc: 'Trained security personnel and executive escorts.' }
    ],
    'pest-control': [
      { value: 'hostels', title: 'Hostels & PG Accommodations', desc: 'Student dorms, hostels, and shared housing environments.' },
      { value: 'restaurants', title: 'Restaurants & Dining', desc: 'Kitchens, dining areas, pantries, and food processing spaces.' },
      { value: 'company-audits', title: 'Company Audits / Warehouses', desc: 'Audit-ready pest compliance for logistics and storage.' }
    ],
    'full-integrated': [
      { value: 'gated-communities', title: 'Gated Communities', desc: 'Residential associations, villas, and housing estates.' },
      { value: 'schools', title: 'Schools & Colleges', desc: 'Integrated management for academic campuses.' },
      { value: 'restaurants', title: 'Restaurants & Cafeterias', desc: 'Comprehensive hygiene, pest, and cleaning care.' },
      { value: 'hospitals', title: 'Hospitals & Medical Centers', desc: 'Highly regulated healthcare facility operations.' },
      { value: 'premium-villas', title: 'Premium Gated Villas', desc: 'High-end residential concierge, cleaning, and security.' }
    ]
  };

  // Render dynamic questionnaire fields under #dynamic-questions-container
  const renderDynamicQuestions = (checkedServices) => {
    const container = document.querySelector('#dynamic-questions-container');
    if (!container) return;

    // Capture currently checked values to preserve state if user goes back/forth
    const savedValues = {};
    container.querySelectorAll('input[type="radio"]:checked').forEach(radio => {
      savedValues[radio.name] = radio.value;
    });

    container.innerHTML = '';
    
    // Find all questions for active services
    const activeQuestions = [];
    checkedServices.forEach(service => {
      const options = SERVICE_FACILITY_MAPPING[service];
      if (options) {
        options.forEach(opt => {
          if (opt.isQuestion) {
            activeQuestions.push({
              id: opt.value,
              label: opt.title,
              errorMsg: opt.desc
            });
          }
        });
      }
    });

    if (activeQuestions.length === 0) {
      container.classList.add('init-hidden');
      return;
    }

    container.classList.remove('init-hidden');

    // Create header label
    const headerLabel = document.createElement('label');
    headerLabel.className = 'form-label text-primary font-bold';
    const isFireNocOnly = checkedServices.includes('fire-noc') && activeQuestions.length === 2;
    headerLabel.textContent = isFireNocOnly ? 'Fire NOC Consultation Details' : 'Additional Service Details';
    container.appendChild(headerLabel);

    // Create a grid container for the questions
    const grid = document.createElement('div');
    grid.className = 'grid grid-2 gap-sm';
    container.appendChild(grid);

    activeQuestions.forEach(q => {
      const qGroup = document.createElement('div');
      qGroup.className = 'form-group dynamic-question-group';
      qGroup.dataset.questionId = q.id;

      const savedVal = savedValues[q.id] || '';

      qGroup.innerHTML = `
        <span class="form-label fs-13 mb-xs block question-label">${q.label}</span>
        <div class="radio-button-container">
          <div class="radio-button">
            <input type="radio" class="radio-button__input" id="${q.id}-yes" name="${q.id}" value="Yes"${savedVal === 'Yes' ? ' checked' : ''}>
            <label class="radio-button__label" for="${q.id}-yes">
              <span class="radio-button__custom"></span>
              Yes
            </label>
          </div>
          <div class="radio-button">
            <input type="radio" class="radio-button__input" id="${q.id}-no" name="${q.id}" value="No"${savedVal === 'No' ? ' checked' : ''}>
            <label class="radio-button__label" for="${q.id}-no">
              <span class="radio-button__custom"></span>
              No
            </label>
          </div>
        </div>
        <div class="invalid-feedback" id="${q.id}-feedback">${q.errorMsg}</div>
      `;

      // Attach instant validation handler on click
      qGroup.querySelectorAll('input[type="radio"]').forEach(radio => {
        radio.addEventListener('change', () => {
          validateStep(1); // Re-validate step 2 instantly
        });
      });

      grid.appendChild(qGroup);
    });
  };

  // Render Step 2 checklist options dynamically based on Step 1 selection(s)
  const updateDynamicFacilityOptions = () => {
    const dynamicContainer = document.querySelector('#dynamic-facility-container');
    if (!dynamicContainer) return;

    // Capture currently checked values to preserve state if user goes back/forth
    const previouslyChecked = new Set(
      Array.from(dynamicContainer.querySelectorAll('input[name="facility-type"]:checked'))
        .map(cb => cb.value)
    );

    // Get checked services from Step 1
    const checkedServices = Array.from(document.querySelectorAll('input[name="services"]:checked'))
      .map(checkbox => checkbox.value);

    // Render dynamic questions based on selected services
    renderDynamicQuestions(checkedServices);

    // Compile unique options
    const uniqueOptions = [];
    const seenValues = new Set();

    checkedServices.forEach(service => {
      const options = SERVICE_FACILITY_MAPPING[service];
      if (options) {
        options.forEach(opt => {
          if (!opt.isQuestion && !seenValues.has(opt.value)) {
            seenValues.add(opt.value);
            uniqueOptions.push(opt);
          }
        });
      }
    });

    // Clear and build the dynamic options list
    dynamicContainer.innerHTML = '';

    if (uniqueOptions.length === 0) {
      dynamicContainer.innerHTML = `
        <div class="col-span-full text-center text-muted-foreground fs-13 py-md">
          Please go back and select at least one service to see facility categories.
        </div>`;
      return;
    }

    uniqueOptions.forEach(opt => {
      const isChecked = previouslyChecked.has(opt.value);
      const card = document.createElement('div');
      card.className = `checkbox-card${isChecked ? ' active' : ''}`;
      
      card.innerHTML = `
        <input type="checkbox" name="facility-type" value="${opt.value}"${isChecked ? ' checked' : ''}>
        <div class="checkbox-card-header">
          <div class="checkbox-card-indicator"></div>
          <span class="checkbox-card-title">${opt.title}</span>
        </div>
        <span class="checkbox-card-desc">${opt.desc}</span>
      `;

      // Interactive click behavior for the card
      const checkbox = card.querySelector('input[type="checkbox"]');
      card.addEventListener('click', (e) => {
        if (e.target !== checkbox) {
          checkbox.checked = !checkbox.checked;
        }
        card.classList.toggle('active', checkbox.checked);
        validateStep(1); // Re-validate Step 2 instantly
      });

      dynamicContainer.appendChild(card);
    });
  };

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

    card.addEventListener('click', (e) => {
      if (!checkbox) return;

      // Toggle checkbox check if click is on card rather than the input itself
      if (e.target !== checkbox) {
        checkbox.checked = checkbox.type === 'radio' ? true : !checkbox.checked;
      }
      
      // Update active classes for either checkbox or radio groups
      if (checkbox.type === 'radio') {
        document.querySelectorAll(`input[name="${checkbox.name}"]`).forEach(radio => {
          radio.closest('.checkbox-card').classList.toggle('active', radio.checked);
        });
      } else {
        card.classList.toggle('active', checkbox.checked);
      }
      
      validateStep(currentStep); // Re-validate step instantly
    });
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
  const validateStep = (stepIndex, showErrors = false) => {
    let isValid = true;
    const stepContainer = steps[stepIndex];

    if (stepIndex === 0) {
      // Step 1: Select at least one Service
      const checkedServices = stepContainer.querySelectorAll('input[name="services"]:checked');
      const errorMsg = stepContainer.querySelector('.invalid-feedback');
      
      if (checkedServices.length === 0) {
        isValid = false;
        if (showErrors && errorMsg) errorMsg.style.display = 'block';
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
        if (showErrors && errorMsg) errorMsg.style.display = 'block';
      } else {
        if (errorMsg) errorMsg.style.display = 'none';
      }

      // Validate all dynamically rendered questionnaire fields
      const activeQuestions = stepContainer.querySelectorAll('#dynamic-questions-container .dynamic-question-group');
      activeQuestions.forEach(qGroup => {
        const qId = qGroup.dataset.questionId;
        const checked = qGroup.querySelector(`input[name="${qId}"]:checked`);
        const feedback = qGroup.querySelector(`#${qId}-feedback`);
        if (!checked) {
          isValid = false;
          if (showErrors && feedback) feedback.style.display = 'block';
        } else {
          if (feedback) feedback.style.display = 'none';
        }
      });
    } 

    else if (stepIndex === 2) {
      // Step 3: Contact details fields (Mandatory fields: Name, Email, Phone, Message)
      const nameInput = document.querySelector('#contact-name');
      const emailInput = document.querySelector('#contact-email');
      const phoneInput = document.querySelector('#contact-phone');
      const msgInput = document.querySelector('#contact-msg');

      // Name validation
      if (!nameInput.value.trim()) {
        isValid = false;
        if (showErrors) nameInput.classList.add('is-invalid');
      } else {
        nameInput.classList.remove('is-invalid');
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailInput.value.trim() || !emailRegex.test(emailInput.value)) {
        isValid = false;
        if (showErrors) emailInput.classList.add('is-invalid');
      } else {
        emailInput.classList.remove('is-invalid');
      }

      // Phone validation (numbers 10-15 digits)
      const phoneRegex = /^[0-9+() -]{10,15}$/;
      if (!phoneInput.value.trim() || !phoneRegex.test(phoneInput.value)) {
        isValid = false;
        if (showErrors) phoneInput.classList.add('is-invalid');
      } else {
        phoneInput.classList.remove('is-invalid');
      }

      // Message validation
      if (!msgInput.value.trim()) {
        isValid = false;
        if (showErrors) msgInput.classList.add('is-invalid');
      } else {
        msgInput.classList.remove('is-invalid');
      }
    }

    return isValid;
  };

  // Attach real-time validation triggers on input loss
  const contactInputs = document.querySelectorAll('#contact-name, #contact-email, #contact-phone, #contact-msg');
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
    const checkedTypes = Array.from(document.querySelectorAll('input[name="facility-type"]:checked'))
      .map(checkbox => checkbox.closest('.checkbox-card').querySelector('.checkbox-card-title').textContent.trim());
    const facilityTypeName = checkedTypes.length > 0 ? checkedTypes.join(', ') : 'N/A';
    
    if (summaryFacility) {
      summaryFacility.textContent = `${facilityTypeName} (${parseInt(facilitySizeVal).toLocaleString()} Sq. Ft.)`;
    }

    // Compile dynamic questionnaire answers
    const summaryFireNocItem = document.querySelector('#summary-fire-noc-item');
    if (summaryFireNocItem) {
      const activeQuestions = document.querySelectorAll('#dynamic-questions-container .dynamic-question-group');
      summaryFireNocItem.classList.toggle('init-hidden', activeQuestions.length === 0);
      if (activeQuestions.length > 0) {
        const details = Array.from(activeQuestions).map(qGroup => {
          const qId = qGroup.dataset.questionId;
          const label = qId.replace('fire-', '').replace('-available', ''); // 'fire-architecture' -> 'architecture', 'proposal-available' -> 'proposal'
          const capLabel = label.charAt(0).toUpperCase() + label.slice(1);
          const val = qGroup.querySelector(`input[name="${qId}"]:checked`)?.value || 'N/A';
          return `${capLabel}: ${val}`;
        });
        document.querySelector('#summary-fire-noc').textContent = details.join(', ');
      }
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
    if (validateStep(currentStep, true)) {
      if (currentStep < steps.length - 1) {
        currentStep++;
        
        // Render dynamic facility categories if entering step 2
        if (currentStep === 1) {
          updateDynamicFacilityOptions();
        }

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
    const checkedTypes = Array.from(document.querySelectorAll('input[name="facility-type"]:checked'))
      .map(checkbox => checkbox.closest('.checkbox-card').querySelector('.checkbox-card-title').textContent.trim());
    const facilityTypeName = checkedTypes.length > 0 ? checkedTypes.join(', ') : 'N/A';

    // Gather contact info
    const nameVal = document.querySelector('#contact-name').value;
    const companyVal = document.querySelector('#contact-company').value || '';
    const emailVal = document.querySelector('#contact-email').value;
    const phoneVal = document.querySelector('#contact-phone').value;
    const msgVal = document.querySelector('#contact-msg').value || '';

    // Check if Fire NOC is selected
    const isFireNocSelected = Array.from(document.querySelectorAll('input[name="services"]:checked'))
      .some(cb => cb.value === 'fire-noc');
    
    const fireArchitecture = isFireNocSelected ? (document.querySelector('input[name="fire-architecture"]:checked')?.value || '') : '';
    const proposalAvailable = isFireNocSelected ? (document.querySelector('input[name="proposal-available"]:checked')?.value || '') : '';

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
    params.append('fireArchitecture', fireArchitecture);
    params.append('proposalAvailable', proposalAvailable);

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
