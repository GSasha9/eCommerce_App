const hello = (): void => {
  const root = document.body;

  const elem = document.createElement('div');

  elem.innerHTML = 'Hello!';
  root.append(elem);

  console.log('hello');
};

hello();
