/**
 * AkaFun Profile Page - Vanilla JavaScript
 * Zero external libraries or frameworks
 */

(function () {
  'use strict';

  // State
  let isConnected = false;
  let connectedAccount = null;

  // DOM Elements
  const htmlEl = document.documentElement;
  const bodyEl = document.body;
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const sidebar = document.getElementById('main-sidebar');
  const collapseBtn = document.getElementById('sidebar-collapse-btn');
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const sidebarBackdrop = document.getElementById('sidebar-backdrop');
  
  // Wallet Elements
  const headerConnectBtn = document.getElementById('header-connect-wallet-btn');
  const heroConnectBtn = document.getElementById('hero-connect-wallet-btn');
  const heroMigrateBtn = document.getElementById('hero-migrate-btn');
  const walletModal = document.getElementById('wallet-modal');
  const closeWalletModalBtn = document.getElementById('close-wallet-modal-btn');
  const walletOptions = document.querySelectorAll('.wallet-option-item');
  const heroCard = document.getElementById('portfolio-hero-card');
  const connectedSection = document.getElementById('connected-portfolio-section');
  const disconnectBtn = document.getElementById('disconnect-wallet-btn');

  // Migrate Elements
  const migrateModal = document.getElementById('migrate-modal');
  const closeMigrateModalBtn = document.getElementById('close-migrate-modal-btn');
  const migrateTokenForm = document.getElementById('migrate-token-form');

  // Network Elements
  const addArcBtn = document.getElementById('add-arc-btn');
  const networkModal = document.getElementById('network-modal');
  const closeNetworkModalBtn = document.getElementById('close-network-modal-btn');
  const confirmAddNetworkBtn = document.getElementById('confirm-add-network-btn');

  // Launch Token Elements
  const launchTokenBtn = document.getElementById('launch-token-btn');
  const launchModal = document.getElementById('launch-modal');
  const closeLaunchModalBtn = document.getElementById('close-launch-modal-btn');
  const createTokenForm = document.getElementById('create-token-form');

  // 1. Theme Management (Light / Dark)
  function initTheme() {
    const savedTheme = localStorage.getItem('aka_theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setTheme('dark');
    } else {
      setTheme('light');
    }
  }

  function setTheme(theme) {
    if (theme === 'dark') {
      htmlEl.classList.add('dark');
      bodyEl.classList.add('dark');
      localStorage.setItem('aka_theme', 'dark');
    } else {
      htmlEl.classList.remove('dark');
      bodyEl.classList.remove('dark');
      localStorage.setItem('aka_theme', 'light');
    }
  }

  function toggleTheme() {
    const isDark = htmlEl.classList.contains('dark');
    setTheme(isDark ? 'light' : 'dark');
    showToast(isDark ? 'Light theme activated' : 'Dark theme activated');
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', toggleTheme);
  }

  // 2. Sidebar Collapse / Expand on Desktop
  function initSidebar() {
    const isCollapsed = localStorage.getItem('aka_sidebar_collapsed') === 'true';
    if (isCollapsed && sidebar) {
      sidebar.classList.add('collapsed');
    }
  }

  if (collapseBtn) {
    collapseBtn.addEventListener('click', () => {
      if (!sidebar) return;
      sidebar.classList.toggle('collapsed');
      const collapsed = sidebar.classList.contains('collapsed');
      localStorage.setItem('aka_sidebar_collapsed', collapsed ? 'true' : 'false');
    });
  }

  // 3. Mobile Sidebar Drawer
  if (mobileMenuBtn && sidebar && sidebarBackdrop) {
    mobileMenuBtn.addEventListener('click', () => {
      sidebar.classList.add('mobile-open');
      sidebarBackdrop.classList.add('active');
    });

    sidebarBackdrop.addEventListener('click', () => {
      sidebar.classList.remove('mobile-open');
      sidebarBackdrop.classList.remove('active');
    });
  }

  // Close mobile sidebar on window resize if enlarged
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 901 && sidebar && sidebarBackdrop) {
      sidebar.classList.remove('mobile-open');
      sidebarBackdrop.classList.remove('active');
    }
  });

  // 4. Wallet Connection
  function openWalletModal() {
    if (isConnected) {
      showToast('Wallet already connected: ' + connectedAccount);
      return;
    }
    if (walletModal) walletModal.classList.add('active');
  }

  function closeWalletModal() {
    if (walletModal) walletModal.classList.remove('active');
  }

  function redirectToGrah() {
    window.location.href = './Grah/index.html';
  }

  if (headerConnectBtn) headerConnectBtn.addEventListener('click', redirectToGrah);
  if (heroConnectBtn) heroConnectBtn.addEventListener('click', redirectToGrah);
  if (closeWalletModalBtn) closeWalletModalBtn.addEventListener('click', closeWalletModal);

  // Connect through wallet options
  walletOptions.forEach((option) => {
    option.addEventListener('click', () => {
      const walletName = option.getAttribute('data-wallet') || 'Wallet';
      connectWallet(walletName);
    });
  });

  function connectWallet(walletName) {
    closeWalletModal();
    showToast(`Connecting to ${walletName}...`);

    setTimeout(() => {
      isConnected = true;
      connectedAccount = '0x' + Array.from({ length: 4 }, () => Math.floor(Math.random() * 16).toString(16)).join('') + '...' + Array.from({ length: 4 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
      
      updateWalletUI();
      showToast(`Connected to ${walletName}`);
    }, 600);
  }

  function disconnectWallet() {
    isConnected = false;
    connectedAccount = null;
    updateWalletUI();
    showToast('Wallet disconnected');
  }

  if (disconnectBtn) {
    disconnectBtn.addEventListener('click', disconnectWallet);
  }

  function updateWalletUI() {
    if (isConnected && connectedAccount) {
      // Header button
      if (headerConnectBtn) {
        headerConnectBtn.innerHTML = `
          <span style="display:inline-block;width:7px;height:7px;background:#16c784;border-radius:50%;margin-right:8px;"></span>
          ${connectedAccount}
        `;
        headerConnectBtn.style.backgroundColor = 'var(--primary)';
      }

      // Hide empty state, show connected portfolio
      if (heroCard) heroCard.style.display = 'none';
      if (connectedSection) connectedSection.classList.add('visible');

      const addrDisplay = document.getElementById('connected-wallet-address');
      if (addrDisplay) addrDisplay.textContent = connectedAccount;
    } else {
      // Restore header button
      if (headerConnectBtn) {
        headerConnectBtn.textContent = 'Connect Wallet';
        headerConnectBtn.style.backgroundColor = 'var(--primary)';
      }

      // Restore hero card
      if (heroCard) heroCard.style.display = 'flex';
      if (connectedSection) connectedSection.classList.remove('visible');
    }
  }

  // 5. Add Arc Network Modal
  function openNetworkModal() {
    if (networkModal) networkModal.classList.add('active');
  }

  function closeNetworkModal() {
    if (networkModal) networkModal.classList.remove('active');
  }

  if (addArcBtn) addArcBtn.addEventListener('click', openNetworkModal);
  if (closeNetworkModalBtn) closeNetworkModalBtn.addEventListener('click', closeNetworkModal);
  if (confirmAddNetworkBtn) {
    confirmAddNetworkBtn.addEventListener('click', () => {
      closeNetworkModal();
      showToast('Arc Network added to your wallet!');
    });
  }

  // 6. Launch Token Modal
  function openLaunchModal(e) {
    if (e) e.preventDefault();
    if (launchModal) launchModal.classList.add('active');
  }

  function closeLaunchModal() {
    if (launchModal) launchModal.classList.remove('active');
  }

  if (launchTokenBtn) launchTokenBtn.addEventListener('click', openLaunchModal);
  if (closeLaunchModalBtn) closeLaunchModalBtn.addEventListener('click', closeLaunchModal);

  if (createTokenForm) {
    createTokenForm.addEventListener('submit', (e) => {
      e.preventDefault();
      closeLaunchModal();
      showToast('Token launch initiated on Arc!');
    });
  }

  // 7. Migrate Token Modal
  function openMigrateModal(e) {
    if (e) e.preventDefault();
    if (migrateModal) migrateModal.classList.add('active');
  }

  function closeMigrateModal() {
    if (migrateModal) migrateModal.classList.remove('active');
  }

  if (heroMigrateBtn) heroMigrateBtn.addEventListener('click', redirectToGrah);
  if (closeMigrateModalBtn) closeMigrateModalBtn.addEventListener('click', closeMigrateModal);

  if (migrateTokenForm) {
    migrateTokenForm.addEventListener('submit', (e) => {
      e.preventDefault();
      closeMigrateModal();
      showToast('Migration initiated: Bridging tokens to Arc Uniswap v4...');
    });
  }

  // Close modals on clicking outside
  window.addEventListener('click', (e) => {
    if (e.target === walletModal) closeWalletModal();
    if (e.target === networkModal) closeNetworkModal();
    if (e.target === launchModal) closeLaunchModal();
    if (e.target === migrateModal) closeMigrateModal();
  });

  // ESC key to close any open modal
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeWalletModal();
      closeNetworkModal();
      closeLaunchModal();
      closeMigrateModal();
      if (sidebar && sidebar.classList.contains('mobile-open')) {
        sidebar.classList.remove('mobile-open');
        if (sidebarBackdrop) sidebarBackdrop.classList.remove('active');
      }
    }
  });

  // 8. Toast Notification System
  function showToast(message) {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color:var(--primary);flex-shrink:0;">
        <circle cx="12" cy="12" r="10"></circle>
        <path d="m9 12 2 2 4-4"></path>
      </svg>
      <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.transition = 'opacity 200ms ease, transform 200ms ease';
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 220);
    }, 3200);
  }

  // Initialize
  initTheme();
  initSidebar();
})();
