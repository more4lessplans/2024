// navbar.js
document.addEventListener('DOMContentLoaded', function() {
    // This is just a placeholder; actual fetch happens in each page
    // We'll rely on each page to call this logic after loading navbar.html
  });
  
  function initializeNavbar() {
    console.log('Initializing navbar'); // Debug: Confirm function runs
  
    const navLinks = document.querySelectorAll('.nav-link');
    console.log('Found', navLinks.length, 'nav links'); // Debug: Confirm links found
  
    navLinks.forEach(link => {
      link.addEventListener('click', function(event) {
        const href = this.getAttribute('href');
        const isModalTrigger = this.getAttribute('data-toggle') === 'modal';
        const cbType = this.getAttribute('data-cb-type');
        console.log('Clicked link:', href, 'Modal trigger:', isModalTrigger, 'Chargebee type:', cbType); // Debug: Log clicks
  
        if (!isModalTrigger && href && href !== '#') {
          event.preventDefault();
          const mobileMenuModal = document.getElementById('mobileMenuModal');
          if (mobileMenuModal) {
            console.log('Closing mobile menu modal'); // Debug: Confirm modal close
            $('#mobileMenuModal').modal('hide');
          }
          setTimeout(() => {
            console.log('Navigating to:', href); // Debug: Confirm navigation
            window.location.href = href;
          }, 300);
        } else if (cbType === 'portal') {
          event.preventDefault();
          const existingCustomersModal = $('#existingCustomersModal');
          existingCustomersModal.modal('hide');
  
          // Handle navigation or Chargebee portal after modal is hidden
          existingCustomersModal.on('hidden.bs.modal', function() {
            if (cbType === 'portal') {
              console.log('Modal hidden, opening Chargebee portal'); // Debug: Confirm trigger
              if (typeof Chargebee !== 'undefined') {
                const cbInstance = Chargebee.init({
                  site: 'more4lessplans', // Ensure this matches your Chargebee site name
                  publishableKey: 'your-publishable-key' // Replace with your Chargebee publishable key
                });
  
                // Simulate fetching a portal session (replace with server-side call in production)
                const portalSession = {
                  id: 'portal-session-id', // Placeholder
                  access_url: 'https://more4lessplans.chargebeeportal.com/portal', // Replace with actual portal URL
                  token: 'portal-session-token' // Placeholder
                };
  
                // Open the Chargebee portal
                cbInstance.openPortal({
                  portalSession: function() {
                    return new Promise((resolve) => {
                      resolve(portalSession);
                    });
                  },
                  success: function() {
                    console.log('Chargebee portal opened successfully');
                  },
                  close: function() {
                    console.log('Chargebee portal closed');
                  },
                  error: function(err) {
                    console.error('Error opening Chargebee portal:', err);
                    window.location.href = '/login'; // Fallback
                  }
                });
              } else {
                console.error('Chargebee library not loaded');
                window.location.href = '/login'; // Fallback
              }
            }
          });
        }
      });
    });
  }