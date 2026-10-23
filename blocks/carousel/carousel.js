export default function decorate(block) {
  const rows = [...block.children];

  if (rows.length < 3) return;

  const nextRow = rows.shift();
  const previousRow = rows.pop();
  const slides = rows;

  const carouselLayout = document.createElement('div');
  carouselLayout.className = 'carousel-layout';

  const viewport = document.createElement('div');
  viewport.className = 'carousel-viewport';

  const track = document.createElement('div');
  track.className = 'carousel-track';

  slides.forEach((row) => {
    row.classList.add('carousel-slide');
    track.append(row);
  });

  viewport.append(track);

  nextRow.classList.add('carousel-next-row');
  previousRow.classList.add('carousel-previous-row');

  // Left button: << (last authored row)
  carouselLayout.append(previousRow);

  // Center: images
  carouselLayout.append(viewport);

  // Right button: >> (first authored row)
  carouselLayout.append(nextRow);

  block.replaceChildren(carouselLayout);

  const getButton = (row) => {
    const cell = row.querySelector(':scope > div');
    if (!cell) return null;

    let button = cell.querySelector('button');

    if (!button) {
      const text = cell.textContent.trim();
      button = document.createElement('button');
      button.type = 'button';
      button.textContent = text;
      cell.replaceChildren(button);
    }

    return button;
  };

  const previous = getButton(previousRow);
  const next = getButton(nextRow);

  let index = 0;

  const update = () => {
    const slideWidth = viewport.clientWidth;
    track.style.transform = `translateX(-${index * slideWidth}px)`;

    if (previous) previous.disabled = index === 0;
    if (next) next.disabled = index === slides.length - 1;
  };

  previous?.addEventListener('click', () => {
    if (index > 0) {
      index -= 1;
      update();
    }
  });

  next?.addEventListener('click', () => {
    if (index < slides.length - 1) {
      index += 1;
      update();
    }
  });

  window.addEventListener('resize', update);
  update();
}
