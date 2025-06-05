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
                existingCustomersModal.modal('hide');

                existingCustomersModal.on('hidden.bs.modal', function() {
                    console.log('Modal hidden, opening Chargebee portal');
                    if (typeof Chargebee !== 'undefined') {
                        const cbInstance = Chargebee.init({
                            site: 'more4lessplans',
                            publishableKey: 'your-publishable-key' // Replace with actual key
                        });
                        cbInstance.openPortal({
                            portalSession: () => Promise.resolve({
                                id: 'portal-session-id',
                                access_url: 'https://more4lessplans.chargebeeportal.com/portal',
                                token: 'portal-session-token'
                            }),
                            success: () => console.log('Chargebee portal opened'),
                            close: () => console.log('Chargebee portal closed'),
                            error: (err) => {
                                console.error('Error opening Chargebee portal:', err);
                                window.location.href = '/login';
                            }
                        });
                    } else {
                        console.error('Chargebee library not loaded');
                        window.location.href = '/login';
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