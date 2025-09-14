export function handleNavClick(href: string, isPage?: boolean) {
  if (isPage) {
    // Page routes are now handled by the App.tsx routing system
    // This function should not be called for page routes anymore

    return;
  }

  if (href === '#home') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }
  
  const element = document.querySelector(href);
  if (element) {
    const headerHeight = 80;
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerHeight;
    
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
}