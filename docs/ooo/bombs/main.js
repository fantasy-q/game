// Constants
const bombs = [
  'Idle',
  'Metroid',
  'Player',
  'Poop',
  'Pudding',
  'Record',
  'Skull',
  'Balloon',
  'Egg',
  'Emoji',
  'Hako',
];
const BASE_URL = '/game/assets/Ooo/sprites/sBomb/';

// App
const App = document.querySelector('#app');
for (const bomb of bombs) {
  const filename = `sBomb${bomb}`;

  App.insertAdjacentHTML(
    'beforeend',
    `<div class="bomb">
      <div class="big">
        <span>${bomb}</span>
        <div class="anim">
          <img src="${BASE_URL}/${filename}_0.png" style="--i: 0">
          <img src="${BASE_URL}/${filename}_1.png" style="--i: 1">
          <img src="${BASE_URL}/${filename}_2.png" style="--i: 2">
          <img src="${BASE_URL}/${filename}_3.png" style="--i: 3">
        </div>
        <img src="${BASE_URL}/${filename}Next_0.png">
      </div>

      <div class="small">
        <img src="${BASE_URL}/${filename}_0.png">
        <img src="${BASE_URL}/${filename}_1.png">
        <img src="${BASE_URL}/${filename}_2.png">
        <img src="${BASE_URL}/${filename}_3.png">
        <img src="${BASE_URL}/${filename}Next_0.png">
      </div>

    </div>`,
  );
}
