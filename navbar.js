// navbar.js
document.addEventListener('DOMContentLoaded', function() {
  // Handle all navigation links (desktop and mobile)
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', function(event) {
      const href = this.getAttribute('href');
      const isModalTrigger = this.getAttribute('data-bs-toggle') === 'modal';

      if (!isModalTrigger && href && href !== '#') {
        event.preventDefault();
        const mobileMenuModal = document.getElementById('mobileMenuModal');
        const existingCustomersModal = document.getElementById('existingCustomersModal');
        if (mobileMenuModal) {
          const mobileModalInstance = bootstrap.Modal.getInstance(mobileMenuModal);
          if (mobileModalInstance) mobileModalInstance.hide();
        }
        if (existingCustomersModal) {
          const existingModalInstance = bootstrap.Modal.getInstance(existingCustomersModal);
          if (existingModalInstance) existingModalInstance.hide();
        }
        setTimeout(() => {
          window.location.href = href;
        }, 300);
      }
    });
  });

  // Handle Existing Customers modal links
  const existingCustomerLinks = document.querySelectorAll('#existingCustomersModal .nav-link');
  existingCustomerLinks.forEach(link => {
    link.addEventListener('click', function(event) {
      event.preventDefault();
      const href = this.getAttribute('href');
      const cbType = this.getAttribute('data-cb-type');

      const modal = document.getElementById('existingCustomersModal');
      const modalInstance = bootstrap.Modal.getInstance(modal);
      modalInstance.hide();

      modal.addEventListener('hidden.bs.modal', function() {
        if (cbType === 'portal') {
          if (typeof Chargebee !== 'undefined') {
            const cbInstance = Chargebee.init({
              site: 'more4lessplans',
              publishableKey: 'your-publishable-key' // Replace with your actual key
            });
            const portalSession = {
              id: 'portal-session-id',
              access_url: 'https://more4lessplans.chargebeeportal.com/portal',
              token: 'portal-session-token'
            };
            cbInstance.openPortal({
              portalSession: function() {
                return new Promise(resolve => resolve(portalSession));
              },
              success: function() { console.log('Portal opened'); },
              close: function() { console.log('Portal closed'); },
              error: function(err) {
                console.error('Error:', err);
                window.location.href = '/login';
              }
            });
          } else {
            window.location.href = '/login';
          }
        } else if (href && href !== 'javascript:void(0)') {
          window.location.href = href;
        }
      }, { once: true });
    });
  });
});