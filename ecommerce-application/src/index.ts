import './styles/style.scss';

export function hello(): void {
  const root = document.body;

  const elem = document.createElement('div');

  elem.innerHTML = 'Hello!';
  root.append(elem);

  console.log('hello');
}
hello();

export function setTitle(title: string): void {
  document.title = title;
}
