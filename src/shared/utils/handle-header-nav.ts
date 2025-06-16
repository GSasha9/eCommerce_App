export const handleHeaderNav = (path: string): void => {
  const headerItems = Array.from(document.querySelectorAll<HTMLLIElement>('.header__menu-item'));

  headerItems.forEach((item) => {
    if (!item.childNodes[0]) return;

    item.classList.remove('header__menu-item-active');

    const text = item.childNodes[0].textContent?.toLowerCase();

    if (text === path.slice(1)) {
      item.classList.add('header__menu-item-active');
    } else if (path.slice(1) === '' && text === 'home') {
      item.classList.add('header__menu-item-active');
    }
  });
};
