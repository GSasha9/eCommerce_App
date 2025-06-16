export interface ISliderProperties {
  images: string[];
  width: number;
  alt: string;
  name: string;
  title: string[];
  bio: string[];
  roles: string[];
  contribution: string[];
  github: string[];
}

export const sliderProperties: ISliderProperties = {
  images: ['/images/maxim.jpg', '/images/ksenia.jpg', '/images/sasha.png'],
  width: 300,
  alt: 'Team-member-image',
  name: 'Team-slider',
  title: ['Maxim Dudaryonak', 'Kseniya Sharshneva', 'Alexandra Hurbanava'],
  bio: [
    "My name is Maxim. I graduated from BNTU's Faculty of Construction. I worked in construction. A couple of years ago, I decided to try learning front-end development, and based on reviews from acquaintances who had taken the course and secured jobs, I chose RS School. Initially, I worked on it in my free time. This year, I thought it was time to complete the course entirely and allocated more of my free time for studying.",
    'Hi! My name is Ksyusha, I am an architect by education and worked as an interior designer for several years. For a long time, I had a desire to try something new, and frontend seemed to be the direction that combines visual thinking and logic. The course was a real discovery for me: interesting, thoughtful, inspiring. Each lesson is like a step into a completely new world. Now I know for sure that I made the right choice.',
    'My name is Sasha, I’m from Minsk. After earning a degree in business administration and working for five years in the insurance field, I decided to change my career and started learning web development. I completed a retraining program at Belarusian State University and continued my studies at RS School. I’m currently focused on improving my front-end skills and looking for a job as a front-end developer',
  ],
  roles: ['Contributions:', 'Contributions:', 'Contributions:'],
  contribution: [
    'Making router, account page, about page, taking part in creating methods for working with api',
    'Making slider for products, registration page, basket, taking part in creating methods for working with api',
    'Implementing login, home, catalog pages, taking part in creating methods for working with api',
  ],
  github: ['https://github.com/MaximDudaryonok', 'https://github.com/KsushaSher', 'https://github.com/GSasha9'],
};
