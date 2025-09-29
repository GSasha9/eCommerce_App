export const observer = new IntersectionObserver((entries, obs) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const wrapper = entry.target;
      const src = wrapper.getAttribute('data-src');

      if (!src) return;

      const image = new Image();

      image.src = src;

      image.onload = (): void => {
        const spinner = wrapper.querySelector('.spinner');

        if (spinner) spinner.remove();

        const bgDiv = document.createElement('div');

        bgDiv.classList.add('card-img');
        bgDiv.style.backgroundImage = `url(${src})`;

        wrapper.replaceChildren();
        wrapper.appendChild(bgDiv);
        obs.unobserve(wrapper);
      };
    }
  });
});
