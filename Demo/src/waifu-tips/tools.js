import faCameraRetro from '@fortawesome/fontawesome-free/svgs/solid/camera-retro.svg';
import faComment from '@fortawesome/fontawesome-free/svgs/solid/comment.svg';
import faInfoCircle from '@fortawesome/fontawesome-free/svgs/solid/circle-info.svg';
import faPaperPlane from '@fortawesome/fontawesome-free/svgs/solid/paper-plane.svg';
import faSmileWink from '@fortawesome/fontawesome-free/svgs/solid/face-smile-wink.svg';
import faStreetView from '@fortawesome/fontawesome-free/svgs/solid/street-view.svg';
import faUserCircle from '@fortawesome/fontawesome-free/svgs/solid/circle-user.svg';
import faXmark from '@fortawesome/fontawesome-free/svgs/solid/xmark.svg';

import showMessage from './message.js';
import { downloadBlobToPng } from './utils';

function showHitokoto() {
  fetch('https://v1.hitokoto.cn')
    .then(response => response.json())
    .then(result => {
      const text = `这句一言来自 <span>「${result.from}」</span>，是 <span>${result.creator}</span> 在 hitokoto.cn 投稿的。`;
      showMessage(result.hitokoto, 6000, 9);
      setTimeout(() => {
        showMessage(text, 4000, 9);
      }, 6000);
    });
}

const tools = {
  hitokoto: {
    icon: faComment,
    callback: showHitokoto
  },
  asteroids: {
    icon: faPaperPlane,
    callback: () => {
      if (window.Asteroids) {
        window.ASTEROIDSPLAYERS ??= [];
        window.ASTEROIDSPLAYERS.push(new Asteroids());
        return;
      }

      const script = document.createElement('script');
      script.src =
        'https://fastly.jsdelivr.net/gh/stevenjoezhang/asteroids/asteroids.js';
      document.head.appendChild(script);
    }
  },
  express: {
    icon: faSmileWink,
    callback: () => {
      window.live2d.randomExpression();
    }
  },
  'switch-model': {
    icon: faUserCircle,
    callback: () => {}
  },
  'switch-texture': {
    icon: faStreetView,
    callback: () => {}
  },
  info: {
    icon: faInfoCircle,
    callback: () => {
      open('https://github.com/yunmoxing/yan_live2d-widget-v3');
    }
  },
  photo: {
    icon: faCameraRetro,
    callback: async () => {
      showMessage('照好了嘛，是不是很可爱呢？', 6000, 9);
      downloadBlobToPng(await window.live2d.getCanvasBlob());
    }
  },
  quit: {
    icon: faXmark,
    callback: () => {
      const waifu = document.getElementById('waifu');
      const toggle = document.getElementById('waifu-toggle');

      localStorage.setItem('waifu-display', String(Date.now()));
      showMessage('愿你有一天能与重要的人重逢。', 2000, 11);

      if (!waifu || !toggle) {
        return;
      }

      waifu.style.bottom = '-500px';
      setTimeout(() => {
        waifu.style.display = 'none';
        toggle.classList.add('waifu-toggle-active');
      }, 3000);
    }
  }
};

export default tools;
