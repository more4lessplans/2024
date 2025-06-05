function initializeNavbar() {
    console.log('Initializing navbar at', new Date().toISOString());

    // Wait for Chargebee script to load
    function waitForChargebee(callback) {
        if (typeof Chargebee !== 'undefined') {
            console.log('Chargebee library loaded');
            callback();
        } else {
            console.log('Waiting for Chargebee library...');
            setTimeout(() => waitForChargebee(callback), 100);
        }
    }

    // Handle existing customer links
    document.querySelectorAll('.existing-customer-link').forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const href = link.getAttribute('href');
            const cbType = link.getAttribute('data-cb-type');
            console.log('Clicked existing-customer-link:', { href, isChargebeePortal: cbType === 'portal' });

            const existingCustomersModal = $('#existingCustomersModal');
            if (!existingCustomersModal.length) {
                console.error('existingCustomersModal not found');
                if (cbType === 'portal') {
                    openChargebeePortal();
                } else {
                    window.location.href = href;
                }
                return;
            }

            existingCustomersModal.modal('hide');
            existingCustomersModal.one('hidden.bs.modal', () => {
                console.log('existingCustomersModal hidden');
                if (cbType === 'portal') {
                    openChargebeePortal();
                } else {
                    console.log('Navigating to:', href);
                    window.location.href = href;
                }
            });
        });
    });

    // Handle other nav links
    document.querySelectorAll('.nav-link:not(.existing-customer-link)').forEach(link => {
        link.addEventListener('click', (event) => {
            const href = link.getAttribute('href');
            const isModalTrigger = link.getAttribute('data-toggle') === 'modal';
            console.log('Clicked nav-link:', { href, isModalTrigger });

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

    function openChargebeePortal() {
        console.log('Attempting to open Chargebee portal');
        waitForChargebee(() => {
            try {
                console.log('Initializing Chargebee');
                const cbInstance = Chargebee.init({
                    site: 'more4lessplans',
                    publishableKey: 'your-publishable-key' // Replace with actual key or remove if not needed
                });
                console.log('Chargebee initialized, opening portal');
                cbInstance.openPortal({
                    portalSession: () => Promise.resolve({
                        id: 'portal-session-id',
                        access_url: 'https://more4lessplans.chargebeeportal.com/portal',
                        token: 'portal-session-token'
                    }),
                    success: () => console.log('Chargebee portal opened successfully'),
                    close: () => console.log('Chargebee portal closed'),
                    error: (err) => {
                        console.error('Error opening Chargebee portal:', err);
                        tryNativeChargebeeHandler();
                    }
                });
            } catch (error) {
                console.error('Chargebee initialization failed:', error);
                tryNativeChargebeeHandler();
            }
        });
    }

    function tryNativeChargebeeHandler() {
        console.log('Falling back to native Chargebee handler');
        if (typeof Chargebee !== 'undefined' && Chargebee.getPortal) {
            const portal = Chargebee.getPortal();
            portal.open({
                success: () => console.log('Native Chargebee portal opened'),
                close: () => console.log('Native Chargebee portal closed'),
                error: (err) => {
                    console.error('Native Chargebee portal error:', err);
                    console.log('Redirecting to /login as final fallback');
                    window.location.href = '/login';
                }
            });
        } else {
            console.error('Chargebee not available for native handler');
            console.log('Redirecting to /login');
            window.location.href = '/login';
        }
    }
}