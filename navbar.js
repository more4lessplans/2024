function initializeNavbar() {
    console.log('Initializing navbar');

    // Handle existing customer links (including Chargebee portal)
    document.querySelectorAll('.existing-customer-link').forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const href = link.getAttribute('href');
            const cbType = link.getAttribute('data-cb-type');
            console.log('Clicked existing-customer-link:', href, 'Chargebee portal:', cbType === 'portal');

            $('#existingCustomersModal').modal('hide');
            $('#existingCustomersModal').one('hidden.bs.modal', () => {
                if (cbType === 'portal') {
                    if (typeof Chargebee !== 'undefined') {
                        console.log('Chargebee library loaded, initializing portal');
                        try {
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
                        } catch (error) {
                            console.error('Chargebee initialization failed:', error);
                            window.location.href = '/login';
                        }
                    } else {
                        console.error('Chargebee library not loaded');
                        window.location.href = '/login';
                    }
                } else {
                    console.log('Navigating to:', href);
                    window.location.href = href;
                }
            });
        });
    });

    // Handle other nav links (e.g., Contact, Mobility, FAQ)
    document.querySelectorAll('.nav-link:not(.existing-customer-link)').forEach(link => {
        link.addEventListener('click', function(event) {
            const href = this.getAttribute('href');
            const isModalTrigger = this.getAttribute('data-toggle') === 'modal';
            console.log('Clicked nav-link:', href, 'Modal trigger:', isModalTrigger);

            if (!isModalTrigger && href && href !== '#') {
                event.preventDefault();
                const mobileMenuModal = $('#mobileMenuModal');
                if (mobileMenuModal.length) {
                    console.log('Closing mobile menu modal');
                    mobileMenuModal.modal('hide');
                }
                setTimeout(() => {
                    console.log('Navigating to:', href);
                    window.location.href = href;
                }, 300);
            }
        });
    });
}