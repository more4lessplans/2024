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
                // Allow Chargebee's default behavior for portal links
                event.preventDefault(); // Prevent default only to handle modal
                const existingCustomersModal = $('#existingCustomersModal');
                
                // Close the modal before Chargebee handles the portal
                if (existingCustomersModal.length) {
                    existingCustomersModal.modal('hide');
                    existingCustomersModal.on('hidden.bs.modal', function() {
                        console.log('Modal hidden, letting Chargebee handle portal link');
                        // Trigger Chargebee's default handler if needed
                        if (typeof Chargebee !== 'undefined' && Chargebee.getInstance()) {
                            try {
                                const cbInstance = Chargebee.getInstance();
                                cbInstance.openPortal({
                                    success: () => console.log('Chargebee portal opened successfully'),
                                    close: () => console.log('Chargebee portal closed'),
                                    error: (err) => {
                                        console.error('Error opening Chargebee portal:', err);
                                        window.location.href = '/login';
                                    }
                                });
                            } catch (error) {
                                console.error('Chargebee portal error:', error);
                                window.location.href = '/login';
                            }
                        } else {
                            console.error('Chargebee library not loaded or initialized');
                            window.location.href = '/login';
                        }
                    });
                } else {
                    // No modal, let Chargebee handle directly
                    console.log('No modal, letting Chargebee handle portal link');
                    if (typeof Chargebee === 'undefined') {
                        console.error('Chargebee library not loaded');
                        window.location.href = '/login';
                    }
                }
            } else if (!isModalTrigger && href && href !== '#') {
                // Handle non-Chargebee navigation links
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