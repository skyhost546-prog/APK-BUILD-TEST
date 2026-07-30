import { PresetTemplate } from '../types';

export const PRESET_TEMPLATES: PresetTemplate[] = [
  {
    id: 'mobile-store',
    title: 'Boutique E-Commerce Mobile',
    category: 'E-Commerce',
    description: 'Une application de vente en ligne complète avec catalogue, panier interactif et thèmes modernes.',
    icon: 'ShoppingBag',
    config: {
      appName: 'UrbanStyle Store',
      packageName: 'com.urbanstyle.mobile',
      primaryColor: '#6366f1',
      orientation: 'portrait',
      displayMode: 'standard',
      pullToRefresh: true,
      permissions: {
        internet: true,
        camera: true,
        location: true,
        microphone: false,
        storage: true,
        notifications: true,
        vibrate: true,
      },
    },
    html: `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>UrbanStyle Mobile</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
  <style>
    body { font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; -webkit-tap-highlight-color: transparent; }
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  </style>
</head>
<body class="bg-slate-50 text-slate-800 pb-20">
  <!-- Android Header -->
  <header class="sticky top-0 z-30 bg-indigo-600 text-white px-4 py-3 shadow-md flex justify-between items-center">
    <div class="flex items-center space-x-3">
      <div class="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center font-bold">U</div>
      <h1 class="font-bold text-lg tracking-wide">UrbanStyle</h1>
    </div>
    <div class="flex items-center space-x-4">
      <button onclick="alert('Recherche active!')" class="p-1"><i class="fa-solid fa-magnifying-glass"></i></button>
      <div class="relative">
        <button onclick="toggleCart()" class="p-1"><i class="fa-solid fa-cart-shopping"></i></button>
        <span id="cart-count" class="absolute -top-1 -right-2 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">2</span>
      </div>
    </div>
  </header>

  <!-- Banner Slider -->
  <div class="p-4">
    <div class="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-5 text-white shadow-lg relative overflow-hidden">
      <span class="bg-white/20 text-xs px-2.5 py-1 rounded-full font-medium uppercase tracking-wider">Offre Spéciale</span>
      <h2 class="text-2xl font-black mt-2 mb-1">Collection Été -30%</h2>
      <p class="text-indigo-100 text-sm mb-3">Découvrez nos derniers arrivages urbains.</p>
      <button onclick="alert('Promotions appliquées!')" class="bg-white text-indigo-600 text-xs font-bold px-4 py-2 rounded-xl shadow-md active:scale-95 transition">Explorer</button>
      <div class="absolute -right-4 -bottom-6 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
    </div>
  </div>

  <!-- Categories -->
  <div class="px-4 mb-4">
    <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Catégories</h3>
    <div class="flex space-x-3 overflow-x-auto no-scrollbar pb-1">
      <button class="bg-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-semibold shrink-0 shadow-sm">Tout</button>
      <button class="bg-white text-slate-600 border border-slate-200 px-4 py-2 rounded-xl text-xs font-semibold shrink-0">Sneakers</button>
      <button class="bg-white text-slate-600 border border-slate-200 px-4 py-2 rounded-xl text-xs font-semibold shrink-0">Hoodies</button>
      <button class="bg-white text-slate-600 border border-slate-200 px-4 py-2 rounded-xl text-xs font-semibold shrink-0">Accessoires</button>
    </div>
  </div>

  <!-- Products Grid -->
  <div class="px-4 grid grid-cols-2 gap-3">
    <!-- Item 1 -->
    <div class="bg-white rounded-2xl p-3 border border-slate-100 shadow-sm flex flex-col justify-between">
      <div>
        <div class="w-full h-32 bg-slate-100 rounded-xl mb-2 flex items-center justify-center text-3xl text-slate-400">👟</div>
        <span class="text-[10px] text-indigo-600 font-bold uppercase">Sneakers</span>
        <h4 class="font-bold text-sm text-slate-800 line-clamp-1">Runner Pro Neon</h4>
      </div>
      <div class="flex justify-between items-center mt-3">
        <span class="font-extrabold text-sm text-slate-900">89,99 €</span>
        <button onclick="addToCart('Runner Pro', 89.99)" class="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center active:bg-indigo-600 active:text-white transition">
          <i class="fa-solid fa-plus text-xs"></i>
        </button>
      </div>
    </div>

    <!-- Item 2 -->
    <div class="bg-white rounded-2xl p-3 border border-slate-100 shadow-sm flex flex-col justify-between">
      <div>
        <div class="w-full h-32 bg-slate-100 rounded-xl mb-2 flex items-center justify-center text-3xl text-slate-400">🧥</div>
        <span class="text-[10px] text-indigo-600 font-bold uppercase">Vetements</span>
        <h4 class="font-bold text-sm text-slate-800 line-clamp-1">Veste Street Oversize</h4>
      </div>
      <div class="flex justify-between items-center mt-3">
        <span class="font-extrabold text-sm text-slate-900">64,50 €</span>
        <button onclick="addToCart('Veste Street', 64.50)" class="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center active:bg-indigo-600 active:text-white transition">
          <i class="fa-solid fa-plus text-xs"></i>
        </button>
      </div>
    </div>
  </div>

  <!-- Bottom Navigation Bar -->
  <nav class="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-6 py-2.5 flex justify-between items-center z-40">
    <button class="flex flex-col items-center text-indigo-600">
      <i class="fa-solid fa-house text-lg"></i>
      <span class="text-[10px] font-medium mt-0.5">Accueil</span>
    </button>
    <button onclick="alert('Favoris')" class="flex flex-col items-center text-slate-400">
      <i class="fa-regular fa-heart text-lg"></i>
      <span class="text-[10px] font-medium mt-0.5">Favoris</span>
    </button>
    <button onclick="alert('Commandes')" class="flex flex-col items-center text-slate-400">
      <i class="fa-solid fa-box text-lg"></i>
      <span class="text-[10px] font-medium mt-0.5">Achats</span>
    </button>
    <button onclick="alert('Profil Utilisateur')" class="flex flex-col items-center text-slate-400">
      <i class="fa-regular fa-user text-lg"></i>
      <span class="text-[10px] font-medium mt-0.5">Profil</span>
    </button>
  </nav>

  <script>
    let cartCount = 2;
    function addToCart(item, price) {
      cartCount++;
      document.getElementById('cart-count').innerText = cartCount;
      if (navigator.vibrate) navigator.vibrate(40);
    }
    function toggleCart() {
      alert("Votre panier contient " + cartCount + " articles!");
    }
  </script>
</body>
</html>`,
  },
  {
    id: 'canvas-game',
    title: 'Jeu Arcade Tap & Jump 2D',
    category: 'Jeux Mobile',
    description: 'Jeu HTML5 Canvas réactif avec effets sonores, vibrations haptiques Android et gestion de score.',
    icon: 'Gamepad2',
    config: {
      appName: 'Cyber Dash 2D',
      packageName: 'com.cyberdash.game',
      primaryColor: '#06b6d4',
      orientation: 'portrait',
      displayMode: 'fullscreen',
      showSplashScreen: true,
      permissions: {
        internet: false,
        camera: false,
        location: false,
        microphone: false,
        storage: false,
        notifications: false,
        vibrate: true,
      },
    },
    html: `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>Cyber Dash 2D</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; touch-action: none; user-select: none; }
    body { background: #0f172a; color: white; font-family: sans-serif; overflow: hidden; height: 100vh; display: flex; flex-direction: column; }
    canvas { background: #1e293b; width: 100%; height: 100%; display: block; }
    #overlay { position: absolute; inset: 0; display: flex; flex-direction: column; justify-content: center; items-center; background: rgba(15,23,42,0.85); backdrop-filter: blur(4px); text-align: center; p: 20px; }
    .btn { background: #06b6d4; color: #0f172a; font-weight: bold; border: none; padding: 14px 28px; border-radius: 12px; font-size: 18px; cursor: pointer; margin-top: 15px; box-shadow: 0 4px 12px rgba(6,182,212,0.4); }
  </style>
</head>
<body>
  <div id="overlay">
    <h1 style="font-size: 32px; color: #38bdf8; margin-bottom: 8px;">⚡ CYBER DASH</h1>
    <p style="color: #94a3b8; font-size: 14px;">Touchez l'écran pour sauter et esquiver les obstacles !</p>
    <button class="btn" onclick="startGame()">JOUER MAINTENANT</button>
  </div>
  <canvas id="gameCanvas"></canvas>

  <script>
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    let width, height, player, obstacles, score, gameRunning, frame;

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    function startGame() {
      document.getElementById('overlay').style.display = 'none';
      player = { x: 50, y: height - 100, size: 24, vy: 0, gravity: 0.8, jumping: false };
      obstacles = [];
      score = 0;
      frame = 0;
      gameRunning = true;
      loop();
    }

    function jump() {
      if (!gameRunning) return;
      if (!player.jumping) {
        player.vy = -14;
        player.jumping = true;
        if (navigator.vibrate) navigator.vibrate(25);
      }
    }

    window.addEventListener('pointerdown', jump);

    function loop() {
      if (!gameRunning) return;
      frame++;
      ctx.clearRect(0, 0, width, height);

      // Sol
      const groundY = height - 60;
      ctx.fillStyle = '#334155';
      ctx.fillRect(0, groundY, width, 60);

      // Joueur
      player.vy += player.gravity;
      player.y += player.vy;
      if (player.y >= groundY - player.size) {
        player.y = groundY - player.size;
        player.jumping = false;
      }
      ctx.fillStyle = '#06b6d4';
      ctx.shadowColor = '#06b6d4';
      ctx.shadowBlur = 10;
      ctx.fillRect(player.x, player.y, player.size, player.size);
      ctx.shadowBlur = 0;

      // Obstacles
      if (frame % 90 === 0) {
        obstacles.push({ x: width, width: 20, height: 35 + Math.random() * 25 });
      }

      for (let i = obstacles.length - 1; i >= 0; i--) {
        const obs = obstacles[i];
        obs.x -= 5;
        ctx.fillStyle = '#f43f5e';
        ctx.fillRect(obs.x, groundY - obs.height, obs.width, obs.height);

        // Collision
        if (
          player.x < obs.x + obs.width &&
          player.x + player.size > obs.x &&
          player.y + player.size > groundY - obs.height
        ) {
          gameOver();
          return;
        }

        if (obs.x + obs.width < 0) {
          obstacles.splice(i, 1);
          score += 10;
        }
      }

      // Score Display
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 20px sans-serif';
      ctx.fillText('Score: ' + score, 20, 40);

      requestAnimationFrame(loop);
    }

    function gameOver() {
      gameRunning = false;
      if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
      document.getElementById('overlay').innerHTML = \`
        <h1 style="font-size: 30px; color: #f43f5e; margin-bottom: 8px;">GAME OVER</h1>
        <p style="color: #cbd5e1; font-size: 18px;">Score Final: <strong>\${score}</strong></p>
        <button class="btn" onclick="startGame()">REJOUER</button>
      \`;
      document.getElementById('overlay').style.display = 'flex';
    }
  </script>
</body>
</html>`,
  },
  {
    id: 'notes-pwa',
    title: 'Gestionnaire de Tâches & Notes',
    category: 'Productivité',
    description: 'Application de prise de notes hors-ligne avec sauvegarde LocalStorage et mode sombre natif.',
    icon: 'CheckSquare',
    config: {
      appName: 'TaskMaster Pro',
      packageName: 'com.taskmaster.app',
      primaryColor: '#10b981',
      orientation: 'portrait',
      displayMode: 'standard',
      enableOfflinePage: true,
      permissions: {
        internet: false,
        camera: false,
        location: false,
        microphone: false,
        storage: true,
        notifications: true,
        vibrate: true,
      },
    },
    html: `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>TaskMaster Pro</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
</head>
<body class="bg-zinc-900 text-zinc-100 min-h-screen p-4 flex flex-col justify-between">
  <div>
    <!-- Title -->
    <div class="flex items-center justify-between mb-6 pt-2">
      <div>
        <h1 class="text-2xl font-bold text-emerald-400">Mes Tâches</h1>
        <p class="text-xs text-zinc-400">Stockage 100% local sur votre appareil Android</p>
      </div>
      <div class="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black">
        <i class="fa-solid fa-list-check"></i>
      </div>
    </div>

    <!-- Input Form -->
    <div class="flex space-x-2 mb-6">
      <input id="taskInput" type="text" placeholder="Ajouter une tâche..." class="flex-1 bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500">
      <button onclick="addTask()" class="bg-emerald-500 text-zinc-900 px-5 font-bold rounded-xl active:scale-95 transition">
        <i class="fa-solid fa-plus"></i>
      </button>
    </div>

    <!-- Task List -->
    <div id="taskList" class="space-y-2.5">
      <!-- Generated items -->
    </div>
  </div>

  <!-- Footer Stats -->
  <div class="bg-zinc-800/80 backdrop-blur rounded-xl p-3 border border-zinc-700/50 flex justify-between items-center text-xs text-zinc-400">
    <span id="statsText">0 tâches complétées</span>
    <button onclick="clearAll()" class="text-rose-400 font-semibold hover:underline">Effacer tout</button>
  </div>

  <script>
    let tasks = JSON.parse(localStorage.getItem('tm_tasks') || '[{"id":1,"title":"Activer la synchronisation APK","done":true},{"id":2,"title":"Tester la vibration haptique","done":false}]');

    function save() {
      localStorage.setItem('tm_tasks', JSON.stringify(tasks));
      render();
    }

    function render() {
      const list = document.getElementById('taskList');
      list.innerHTML = '';
      let doneCount = 0;

      tasks.forEach((task, index) => {
        if (task.done) doneCount++;
        const item = document.createElement('div');
        item.className = \`p-3.5 rounded-xl border flex justify-between items-center transition \${task.done ? 'bg-zinc-800/40 border-zinc-800 text-zinc-500 line-through' : 'bg-zinc-800 border-zinc-700 text-zinc-200'}\`;
        item.innerHTML = \`
          <div onclick="toggleTask(\${index})" class="flex items-center space-x-3 flex-1 cursor-pointer">
            <div class="w-5 h-5 rounded-md border flex items-center justify-center \${task.done ? 'bg-emerald-500 border-emerald-500 text-zinc-900' : 'border-zinc-500'}\">
              \${task.done ? '<i class="fa-solid fa-check text-xs"></i>' : ''}
            </div>
            <span class="text-sm font-medium">\${task.title}</span>
          </div>
          <button onclick="deleteTask(\${index})" class="text-zinc-500 hover:text-rose-400 p-1"><i class="fa-solid fa-trash-can text-xs"></i></button>
        \`;
        list.appendChild(item);
      });

      document.getElementById('statsText').innerText = doneCount + " / " + tasks.length + " complétées";
    }

    function addTask() {
      const input = document.getElementById('taskInput');
      if (!input.value.trim()) return;
      tasks.push({ id: Date.now(), title: input.value.trim(), done: false });
      input.value = '';
      if (navigator.vibrate) navigator.vibrate(30);
      save();
    }

    function toggleTask(i) {
      tasks[i].done = !tasks[i].done;
      if (navigator.vibrate) navigator.vibrate(20);
      save();
    }

    function deleteTask(i) {
      tasks.splice(i, 1);
      save();
    }

    function clearAll() {
      if (confirm("Supprimer toutes les tâches?")) {
        tasks = [];
        save();
      }
    }

    render();
  </script>
</body>
</html>`,
  },
];
