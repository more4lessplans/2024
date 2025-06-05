function initializeNavbar() {
    console.log('Initializing navbar');

    const navLinks = document.querySelectorAll('.nav-link');
    console.log('Found', navLinks.length, 'nav links');

    navLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            const href = this.getAttribute('href');
            const isModalTrigger = this.getAttribute('data-toggle') === 'modal';
            const isChargebeePortal = this.getAttribute('data-cb-type') === 'portal';
            console.log('Clicked link:', href, 'Modal trigger:', isModalTrigger, 'Chargebee portal:', isChargebeePortal);

            if (isChargebeePortal) {
                event.preventDefault();
                const existingCustomersModal = $('#existingCustomersModal');
                
                // Ensure modal is hidden before proceeding
                existingCustomersModal.modal('hide');

                // Wait for modal to fully close
                existingCustomersModal.on('hidden.bs.modal', function() {
                    console.log('Modal hidden, attempting to open Chargebee portal');
                    
                    if (typeof Chargebee !== 'undefined' && Chargebee.getInstance()) {
                        try {
                            const cbInstance = Chargebee.getInstance();
                            cbInstance.setPortalSession(() => Promise.resolve({
                                id: 'portal-session-id',
                                access_url: 'https://more4lessplans.chargebeeportal.com/portal',
                                token: 'portal-session-token'
                            }));
                            cbInstance.openPortal({
                                success: () => console.log('Chargebee portal opened successfully'),
                                close: () => console.log('Chargebee portal closed'),
                                error: (err) => {
                                    console.error('Error opening Chargebee portal:', err);
                                    window.location.href = '/login';
                                }
                            });
                        } catch (error) {
                            console.error('Chargebee portal initialization failed:', error);
                            window.location.href = '/login';
                        }
                    } else {
                        // Initialize Chargebee if not already initialized
                        if (typeof Chargebee !== 'undefined') {
                            try {
                                const cbInstance = Chargebee.init({
                                    site: 'more4lessplans',
                                    publishableKey: 'live_9xoL0GUAJyfaZddNn5cdFhI4hrLAGhyIh' // Replace with your actual Chargebee publishable key
                                });
                                cbInstance.setPortalSession(() => Promise.resolve({
                                    id: 'portal-session-id',
                                    access_url: 'https://more4lessplans.chargebeeportal.com/portal',
                                    token: 'portal-session-token'
                                }));
                                cbInstance.openPortal({
                                    success: () => console.log('Chargebee portal opened successfully'),
                                    close: () => console.log('Chargebee portal closed'),
                                    error: (err) => {
                                        console.error('Error opening Chargebee portal:', err);
                                        window.location.href = '/login';
                                    }
                                });
                            } catch (error) {
                                console.error('Chargebee initialization failed:', error);
                                window.location.href = '/login';
                            }
                        } else {
                            console.error('Chargebee library not loaded');
                            window.location.href = '/login';
                        }
                    }
                });
            } else if (!isModalTrigger && href && href !== '#') {
                event.preventDefault();
                const mobileMenuModal = document.getElementById('mobileMenuModal');
                if (mobileMenuModal) {
                    console.log('Closing mobile menu modal');
                    $('#mobileMenuModal').modal('hide');
                }
                setTimeout(() => {
                    console.log('Navigating to:', href);
                    window.location.href = href;
                }, 300);
            }
        });
    });
}