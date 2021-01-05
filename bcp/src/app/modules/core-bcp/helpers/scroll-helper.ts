import { scrollTo } from 'moh-common-lib';

export function scrollToElement(selector: string): void {
  setTimeout(() => {
    const el = document.querySelector(selector);
    if (el) {
      const top = el.getBoundingClientRect().top + window.pageYOffset;
      scrollTo(top);
    }
  }, 50);
}
