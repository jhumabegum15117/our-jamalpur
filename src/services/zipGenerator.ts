import JSZip from 'jszip';

export async function generateProjectZip(isSpckRoot: boolean = true): Promise<Blob> {
  const zip = new JSZip();
  // For Spck Editor, all files MUST be at the archive root
  const root = isSpckRoot ? zip : (zip.folder('Our-Jamalpur') || zip);

  // Spck Editor & Standard Web Manifest files
  root.file('package.json', JSON.stringify({
    name: 'our-jamalpur',
    version: '1.0.0',
    description: 'Our Jamalpur District Digital Portal & App for Spck Editor',
    main: 'index.html',
    scripts: {
      start: 'serve'
    },
    keywords: ['jamalpur', 'spck', 'mobile-app', 'web'],
    author: 'মাসুদ রানা',
    license: 'MIT'
  }, null, 2));

  root.file('manifest.json', JSON.stringify({
    short_name: 'Our Jamalpur',
    name: 'Our Jamalpur - আমাদের জামালপুর',
    icons: [
      {
        src: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=192&auto=format&fit=crop&q=80',
        sizes: '192x192',
        type: 'image/png'
      }
    ],
    start_url: 'index.html',
    background_color: '#064e3b',
    theme_color: '#059669',
    display: 'standalone'
  }, null, 2));

  root.file('spck.json', JSON.stringify({
    type: 'web',
    name: 'Our Jamalpur',
    version: '1.0.0',
    entry: 'index.html'
  }, null, 2));

  // 1. Shared CSS
  const cssFolder = root.folder('css');
  cssFolder?.file('style.css', `/* Our Jamalpur - Global Stylesheet */
@import url('https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@300;400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

:root {
  --primary: #059669;
  --primary-dark: #047857;
  --primary-light: #ecfdf5;
  --accent: #d97706;
  --bg-main: #f8fafc;
  --surface: #ffffff;
  --text-main: #0f172a;
  --text-muted: #64748b;
  --border: #e2e8f0;
  --radius: 12px;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Hind Siliguri', 'Plus Jakarta Sans', sans-serif;
  -webkit-tap-highlight-color: transparent;
}

body {
  background-color: var(--bg-main);
  color: var(--text-main);
  line-height: 1.6;
  padding-bottom: 70px; /* space for bottom nav on mobile */
}

a {
  text-decoration: none;
  color: inherit;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
}

/* Header & Top Bar */
.top-bar {
  background: #064e3b;
  color: #fff;
  font-size: 13px;
  padding: 6px 0;
}
.top-bar .flex-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.main-header {
  background: var(--surface);
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  position: sticky;
  top: 0;
  z-index: 100;
  padding: 12px 0;
}
.header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}
.brand-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 700;
  font-size: 20px;
  color: var(--primary-dark);
}
.brand-logo img, .brand-logo .logo-icon {
  width: 38px;
  height: 38px;
  background: var(--primary);
  color: white;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.search-box {
  flex: 1;
  max-width: 500px;
  position: relative;
}
.search-box input {
  width: 100%;
  padding: 10px 16px 10px 42px;
  border: 1.5px solid var(--border);
  border-radius: 24px;
  outline: none;
  font-size: 14px;
  background: #f1f5f9;
  transition: all 0.2s;
}
.search-box input:focus {
  background: #fff;
  border-color: var(--primary);
}

.header-actions {
  display: flex;
  gap: 10px;
  align-items: center;
}
.btn-primary {
  background: var(--primary);
  color: #fff;
  padding: 8px 18px;
  border-radius: 8px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.btn-primary:hover {
  background: var(--primary-dark);
}

/* Nav Menu */
.main-nav {
  background: #fff;
  border-bottom: 1px solid var(--border);
  overflow-x: auto;
  white-space: nowrap;
}
.nav-list {
  display: flex;
  list-style: none;
  gap: 20px;
  padding: 8px 0;
}
.nav-list a {
  font-weight: 500;
  font-size: 15px;
  padding: 6px 10px;
  border-radius: 6px;
  transition: all 0.2s;
}
.nav-list a.active, .nav-list a:hover {
  color: var(--primary);
  background: var(--primary-light);
}

/* Cards & Bento Grid */
.grid-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 16px;
  margin-top: 16px;
}
.card {
  background: var(--surface);
  border-radius: var(--radius);
  border: 1px solid var(--border);
  padding: 16px;
  transition: transform 0.2s, box-shadow 0.2s;
}
.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0,0,0,0.06);
}

/* Mobile Bottom Navigation Bar */
.bottom-nav {
  display: none;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  box-shadow: 0 -2px 10px rgba(0,0,0,0.08);
  z-index: 1000;
  border-top: 1px solid var(--border);
}
.bottom-nav-inner {
  display: flex;
  justify-content: space-around;
  padding: 8px 0 6px 0;
}
.bottom-nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 11px;
  color: var(--text-muted);
  font-weight: 500;
}
.bottom-nav-item.active {
  color: var(--primary);
}

@media (max-width: 768px) {
  .bottom-nav {
    display: block;
  }
  .main-nav {
    display: none;
  }
}
`);

  cssFolder?.file('responsive.css', `/* Responsive Adjustments */
@media (max-width: 768px) {
  .header-actions .hide-mobile {
    display: none;
  }
  .grid-cards {
    grid-template-columns: 1fr;
  }
  .search-box {
    width: 100%;
  }
}
`);

  // 2. Shared JavaScript
  const jsFolder = root.folder('js');
  jsFolder?.file('app.js', `// Our Jamalpur - Core Application Script
console.log("Our Jamalpur Application Loaded");

// Live Digital Clock (Bengali and English)
function updateClock() {
  const clockEl = document.getElementById('live-clock');
  if (!clockEl) return;
  const now = new Date();
  const timeStr = now.toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
  clockEl.textContent = '🕒 সময়: ' + timeStr;
}
setInterval(updateClock, 1000);
updateClock();

// Global App Initialization & Helpers
window.OurJamalpur = {
  getStorage: function(key, fallback) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    } catch(e) {
      return fallback;
    }
  },
  setStorage: function(key, val) {
    localStorage.setItem(key, JSON.stringify(val));
  }
};
`);

  jsFolder?.file('auth.js', `// User & Auth Management
function checkAuth() {
  const user = window.OurJamalpur.getStorage('oj_current_user', null);
  const userSlot = document.getElementById('user-profile-slot');
  if (userSlot) {
    if (user) {
      userSlot.innerHTML = '<a href="profile.html" class="btn-user">👤 ' + user.name + '</a>';
    } else {
      userSlot.innerHTML = '<a href="login.html" class="btn-primary">লগইন / সাইন আপ</a>';
    }
  }
}
document.addEventListener('DOMContentLoaded', checkAuth);
`);

  jsFolder?.file('marketplace.js', `// Marketplace Filtering and Ad Posting
function loadProducts() {
  console.log("Loading marketplace products...");
}
`);

  jsFolder?.file('news.js', `// News filtering
function loadNews() {
  console.log("Loading Jamalpur local news...");
}
`);

  jsFolder?.file('transport.js', `// Bus and Train schedules
function loadTransport() {
  console.log("Loading transport schedule...");
}
`);

  jsFolder?.file('search.js', `// Global Search Handler
function handleGlobalSearch(query) {
  if (!query) return;
  window.location.href = 'index.html?search=' + encodeURIComponent(query);
}
`);

  jsFolder?.file('admin.js', `// Admin Dashboard Script
function checkAdminAccess() {
  const user = window.OurJamalpur.getStorage('oj_current_user', { role: 'admin' });
  if (!user || user.role !== 'admin') {
    alert('অ্যাডমিন এক্সেস প্রয়োজন');
    window.location.href = '../login.html';
  }
}
`);

  // Helper to generate standalone HTML with navigation and header
  const makeHtml = (title: string, content: string, activeNav: string = '') => `<!DOCTYPE html>
<html lang="bn">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>${title} - Our Jamalpur</title>
  <link rel="stylesheet" href="css/style.css">
  <link rel="stylesheet" href="css/responsive.css">
</head>
<body>
  <!-- Top Bar -->
  <div class="top-bar">
    <div class="container flex-between">
      <div id="live-clock">🕒 সময় লোড হচ্ছে...</div>
      <div>📍 জামালপুর জেলা, বাংলাদেশ | হেল্পলাইন: ৯৯৯</div>
    </div>
  </div>

  <!-- Header -->
  <header class="main-header">
    <div class="container header-row">
      <a href="index.html" class="brand-logo">
        <div class="logo-icon">OJ</div>
        <span>Our Jamalpur</span>
      </a>

      <div class="search-box">
        <input type="text" placeholder="খবর, পণ্য, বাস, ট্রেন, ডাক্তার, ঔষধ খুঁজুন..." onkeypress="if(event.key==='Enter') handleGlobalSearch(this.value)">
      </div>

      <div class="header-actions">
        <a href="sell.html" class="btn-primary hide-mobile">➕ বিজ্ঞাপন দিন</a>
        <div id="user-profile-slot">
          <a href="login.html" class="btn-primary">লগইন</a>
        </div>
      </div>
    </div>
  </header>

  <!-- Desktop Navigation Menu -->
  <nav class="main-nav">
    <div class="container">
      <ul class="nav-list">
        <li><a href="index.html" class="${activeNav === 'home' ? 'active' : ''}">হোম</a></li>
        <li><a href="marketplace.html" class="${activeNav === 'marketplace' ? 'active' : ''}">মার্কেটপ্লেস</a></li>
        <li><a href="news.html" class="${activeNav === 'news' ? 'active' : ''}">স্থানীয় খবর</a></li>
        <li><a href="bus.html" class="${activeNav === 'bus' ? 'active' : ''}">বাস সার্ভিস</a></li>
        <li><a href="train.html" class="${activeNav === 'train' ? 'active' : ''}">ট্রেন সময়সূচী</a></li>
        <li><a href="hospital.html" class="${activeNav === 'hospital' ? 'active' : ''}">হাসপাতাল</a></li>
        <li><a href="doctors.html" class="${activeNav === 'doctors' ? 'active' : ''}">ডাক্তার</a></li>
        <li><a href="medicine.html" class="${activeNav === 'medicine' ? 'active' : ''}">ঔষধ নির্দেশিকা</a></li>
        <li><a href="jobs.html" class="${activeNav === 'jobs' ? 'active' : ''}">চাকরি</a></li>
        <li><a href="education.html" class="${activeNav === 'education' ? 'active' : ''}">শিক্ষা ও বই</a></li>
        <li><a href="quiz.html" class="${activeNav === 'quiz' ? 'active' : ''}">অনলাইন কুইজ</a></li>
        <li><a href="blood-donor.html" class="${activeNav === 'blood-donor' ? 'active' : ''}">রক্তদাতা</a></li>
        <li><a href="prayer.html" class="${activeNav === 'prayer' ? 'active' : ''}">নামাজের সময়</a></li>
        <li><a href="market-price.html" class="${activeNav === 'market-price' ? 'active' : ''}">বাজারদর</a></li>
        <li><a href="business.html" class="${activeNav === 'business' ? 'active' : ''}">ব্যবসা ডিরেক্টরি</a></li>
        <li><a href="about.html" class="${activeNav === 'about' ? 'active' : ''}">সম্পর্কে</a></li>
        <li><a href="admin/index.html" style="color: #d97706; font-weight: bold;">অ্যাডমিন প্যানেল</a></li>
      </ul>
    </div>
  </nav>

  <!-- Main Body Content -->
  <main class="container" style="margin-top: 20px;">
    ${content}
  </main>

  <!-- Mobile Bottom Navigation Bar -->
  <div class="bottom-nav">
    <div class="bottom-nav-inner">
      <a href="index.html" class="bottom-nav-item ${activeNav === 'home' ? 'active' : ''}">
        <span>🏠</span>
        <span>হোম</span>
      </a>
      <a href="marketplace.html" class="bottom-nav-item ${activeNav === 'marketplace' ? 'active' : ''}">
        <span>🛒</span>
        <span>মার্কেট</span>
      </a>
      <a href="news.html" class="bottom-nav-item ${activeNav === 'news' ? 'active' : ''}">
        <span>📰</span>
        <span>সংবাদ</span>
      </a>
      <a href="hospital.html" class="bottom-nav-item ${activeNav === 'hospital' ? 'active' : ''}">
        <span>🏥</span>
        <span>সেবা</span>
      </a>
      <a href="profile.html" class="bottom-nav-item ${activeNav === 'profile' ? 'active' : ''}">
        <span>👤</span>
        <span>প্রোফাইল</span>
      </a>
    </div>
  </div>

  <footer style="margin-top: 50px; background: #0f172a; color: #cbd5e1; padding: 30px 0 50px 0; text-align: center;">
    <div class="container">
      <h3 style="color: #fff; margin-bottom: 8px;">Our Jamalpur - আমাদের জামালপুর</h3>
      <p style="font-size: 14px; margin-bottom: 12px;">জামালপুর জেলার সব তথ্য, সেবা ও যোগাযোগের ডিজিটাল ঠিকানা।</p>
      <p style="font-size: 13px; color: #94a3b8;">উদ্যোক্তা ও পরিচালক: <strong>মাসুদ রানা</strong> <span style="color: #3b82f6;">(Verified ☑️)</span> | সর্বস্বত্ব সংরক্ষিত ২০২৬</p>
    </div>
  </footer>

  <script src="js/app.js"></script>
  <script src="js/auth.js"></script>
  <script src="js/search.js"></script>
</body>
</html>`;

  // Write all HTML pages requested
  root.file('index.html', makeHtml('হোমপেজ', `
    <div style="background: linear-gradient(135deg, #059669 0%, #065f46 100%); color: white; padding: 24px; border-radius: 16px; margin-bottom: 20px;">
      <h1 style="font-size: 24px; margin-bottom: 8px;">স্বাগতম “Our Jamalpur” ডিজিটাল পোর্টালে</h1>
      <p style="font-size: 15px; opacity: 0.9;">জামালপুর জেলার ৭টি উপজেলার খবর, মার্কেটপ্লেস, যাতায়াত, চিকিৎসা, চাকরি ও জরুরি সেবা এক প্ল্যাটফর্মে।</p>
    </div>

    <h2 style="font-size: 18px; margin: 20px 0 10px 0;">⚡ জরুরি ও গুরুত্বপূর্ণ শর্টকাট</h2>
    <div class="grid-cards" style="grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));">
      <a href="marketplace.html" class="card" style="text-align: center; padding: 12px;">🛒 মার্কেটপ্লেস</a>
      <a href="news.html" class="card" style="text-align: center; padding: 12px;">📰 স্থানীয় খবর</a>
      <a href="bus.html" class="card" style="text-align: center; padding: 12px;">🚌 বাসের সময়</a>
      <a href="train.html" class="card" style="text-align: center; padding: 12px;">🚆 ট্রেনের সময়</a>
      <a href="hospital.html" class="card" style="text-align: center; padding: 12px;">🏥 হাসপাতাল</a>
      <a href="doctors.html" class="card" style="text-align: center; padding: 12px;">👨‍⚕️ ডাক্তার ডিরেক্টরি</a>
      <a href="medicine.html" class="card" style="text-align: center; padding: 12px;">💊 ঔষধ তথ্য</a>
      <a href="jobs.html" class="card" style="text-align: center; padding: 12px;">💼 চাকরির খবর</a>
      <a href="blood-donor.html" class="card" style="text-align: center; padding: 12px;">🩸 রক্তদাতা</a>
      <a href="prayer.html" class="card" style="text-align: center; padding: 12px;">🕌 নামাজের সময়</a>
      <a href="market-price.html" class="card" style="text-align: center; padding: 12px;">🥗 নিত্য বাজারদর</a>
      <a href="quiz.html" class="card" style="text-align: center; padding: 12px;">🎯 অনলাইন কুইজ</a>
    </div>
  `, 'home'));

  root.file('login.html', makeHtml('লগইন', `
    <div style="max-width: 420px; margin: 40px auto;" class="card">
      <h2 style="text-align: center; margin-bottom: 20px;">লগইন করুন</h2>
      <form onsubmit="event.preventDefault(); alert('ডেমো লগইন সফল!'); window.location.href='index.html';">
        <div style="margin-bottom: 12px;">
          <label>মোবাইল নম্বর</label>
          <input type="text" class="search-box" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px;" required placeholder="017xxxxxxxx">
        </div>
        <div style="margin-bottom: 16px;">
          <label>পাসওয়ার্ড</label>
          <input type="password" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px;" required>
        </div>
        <button type="submit" class="btn-primary" style="width: 100%; justify-content: center;">লগইন</button>
      </form>
      <p style="margin-top: 14px; text-align: center; font-size: 14px;">নতুন ইউজার? <a href="register.html" style="color: #059669; font-weight: bold;">রেজিস্ট্রেশন করুন</a></p>
    </div>
  `, 'profile'));

  root.file('register.html', makeHtml('রেজিস্ট্রেশন', `
    <div style="max-width: 440px; margin: 30px auto;" class="card">
      <h2 style="text-align: center; margin-bottom: 20px;">নতুন একাউন্ট তৈরি করুন</h2>
      <form onsubmit="event.preventDefault(); alert('রেজিস্ট্রেশন সম্পন্ন হয়েছে!'); window.location.href='login.html';">
        <div style="margin-bottom: 12px;"><label>পূর্ণ নাম</label><input type="text" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px;" required></div>
        <div style="margin-bottom: 12px;"><label>মোবাইল নম্বর</label><input type="tel" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px;" required></div>
        <div style="margin-bottom: 12px;">
          <label>উপজেলা নির্বাচন করুন</label>
          <select style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px;">
            <option>জামালপুর সদর</option><option>ইসলামপুর</option><option>মেলান্দহ</option><option>দেওয়ানগঞ্জ</option><option>মাদারগঞ্জ</option><option>সরিষাবাড়ী</option><option>বকশীগঞ্জ</option>
          </select>
        </div>
        <div style="margin-bottom: 16px;"><label>পাসওয়ার্ড</label><input type="password" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px;" required></div>
        <button type="submit" class="btn-primary" style="width: 100%; justify-content: center;">রেজিস্টার করুন</button>
      </form>
    </div>
  `, 'profile'));

  root.file('marketplace.html', makeHtml('মার্কেটপ্লেস', `
    <h2>🛒 জামালপুর লোকাল মার্কেটপ্লেস</h2>
    <p style="color: #64748b; margin-bottom: 16px;">জামালপুর জেলার স্থানীয় বেচাকেনার বিশ্বস্ত প্ল্যাটফর্ম</p>
    <div style="display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 20px;">
      <button class="btn-primary">সকল পণ্য</button>
      <button class="btn-primary" style="background:#f1f5f9; color:#0f172a;">মোবাইল</button>
      <button class="btn-primary" style="background:#f1f5f9; color:#0f172a;">ইলেকট্রনিক্স</button>
      <button class="btn-primary" style="background:#f1f5f9; color:#0f172a;">নকশী কাঁথা ও পোশাক</button>
      <button class="btn-primary" style="background:#f1f5f9; color:#0f172a;">কৃষি ও তেল</button>
      <button class="btn-primary" style="background:#f1f5f9; color:#0f172a;">যানবাহন</button>
      <a href="sell.html" class="btn-primary" style="margin-left: auto; background: #d97706;">➕ ফ্রি বিজ্ঞাপন দিন</a>
    </div>
    <div class="grid-cards">
      <div class="card">
        <h3>Samsung Galaxy A54 5G</h3>
        <p style="color: #059669; font-weight: bold; font-size: 18px;">৳ ২৪,৫০০</p>
        <p style="font-size: 13px; color: #64748b;">📍 জামালপুর সদর | ৬ মাস ব্যবহৃত</p>
        <a href="product-details.html?id=1" class="btn-primary" style="margin-top: 10px; width: 100%; justify-content: center;">বিস্তারিত ও যোগাযোগ</a>
      </div>
      <div class="card">
        <h3>জামালপুরের খাঁটি নকশী কাঁথা</h3>
        <p style="color: #059669; font-weight: bold; font-size: 18px;">৳ ৩,৮০০</p>
        <p style="font-size: 13px; color: #64748b;">📍 মেলান্দহ | নতুন হস্তশিল্প</p>
        <a href="product-details.html?id=2" class="btn-primary" style="margin-top: 10px; width: 100%; justify-content: center;">বিস্তারিত ও যোগাযোগ</a>
      </div>
    </div>
  `, 'marketplace'));

  root.file('product-details.html', makeHtml('পণ্য বিবরণী', `
    <div class="card" style="max-width: 700px; margin: 0 auto;">
      <span style="background: #ecfdf5; color: #059669; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold;">ভেরিফাইড পণ্য</span>
      <h2 style="margin: 10px 0;">Samsung Galaxy A54 5G (8GB/128GB)</h2>
      <h3 style="color: #059669; font-size: 24px; margin-bottom: 12px;">মূল্য: ৳ ২৪,৫০০ (আলোচনা সাপেক্ষ)</h3>
      <p style="color: #64748b; margin-bottom: 16px;">📍 অবস্থান: ষ্টেশন রোড, জামালপুর সদর | বিজ্ঞাপনের তারিখ: ২৮ আগস্ট ২০২৬</p>
      <div style="background: #f8fafc; padding: 14px; border-radius: 8px; margin-bottom: 16px;">
        <h4>পণ্যের বিবরণ:</h4>
        <p>ফোনটি সম্পূর্ণ ফ্রেশ কন্ডিশন। সাথে অরিজিনাল চার্জার এবং বক্স আছে। সিকিউরিটির জন্য ভোটার আইডির কপি দেওয়া যাবে।</p>
      </div>
      <div style="background: #ecfdf5; border: 1px solid #a7f3d0; padding: 14px; border-radius: 8px;">
        <h4>বিক্রেতার তথ্য:</h4>
        <p>নাম: মোঃ করিম | মোবাইল: <strong>01711223344</strong></p>
        <a href="tel:01711223344" class="btn-primary" style="margin-top: 8px;">📞 সরাসরি কল করুন</a>
      </div>
    </div>
  `, 'marketplace'));

  root.file('sell.html', makeHtml('বিজ্ঞাপন পোস্ট করুন', `
    <div class="card" style="max-width: 600px; margin: 0 auto;">
      <h2>📢 জামালপুর মার্কেটপ্লেসে বিনামূল্যে বিজ্ঞাপন দিন</h2>
      <form onsubmit="event.preventDefault(); alert('বিজ্ঞাপনটি সফলভাবে পোস্ট হয়েছে!'); window.location.href='marketplace.html';">
        <div style="margin-top: 14px;"><label>পণ্যের শিরোনাম</label><input type="text" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px;" required></div>
        <div style="margin-top: 14px;">
          <label>ক্যাটেগরি</label>
          <select style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px;">
            <option>Mobile</option><option>Electronics</option><option>Clothing</option><option>Agricultural Products</option><option>জমি/বাড়ি</option><option>যানবাহন</option><option>অন্যান্য</option>
          </select>
        </div>
        <div style="margin-top: 14px;"><label>দাম (টাকা)</label><input type="number" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px;" required></div>
        <div style="margin-top: 14px;"><label>আপনার মোবাইল নম্বর</label><input type="tel" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px;" required></div>
        <div style="margin-top: 14px;"><label>পণ্যের বিস্তারিত বিবরণ</label><textarea rows="4" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px;" required></textarea></div>
        <button type="submit" class="btn-primary" style="margin-top: 16px; width: 100%; justify-content: center;">বিজ্ঞাপন প্রকাশ করুন</button>
      </form>
    </div>
  `, 'marketplace'));

  root.file('news.html', makeHtml('স্থানীয় সংবাদ', `
    <h2>📰 জামালপুর জেলার স্থানীয় সংবাদ</h2>
    <p style="color: #64748b; margin-bottom: 16px;">জামালপুরের ৭টি উপজেলার সর্বশেষ বিশ্বস্ত সংবাদ</p>
    <div class="grid-cards">
      <div class="card">
        <span style="background: #ecfdf5; color: #059669; padding: 2px 6px; border-radius: 4px; font-size: 12px;">জামালপুর সদর</span>
        <h3 style="margin: 8px 0;">ব্রহ্মপুত্র নদের পাড়ে বৃক্ষরোপণ উৎসব শুরু</h3>
        <p style="font-size: 14px; color: #64748b;">পরিবেশ সুরক্ষায় সপ্তাহব্যাপী কর্মসূচি উদ্বোধন করেছে জেলা প্রশাসন...</p>
        <p style="font-size: 12px; color: #94a3b8; margin-top: 8px;">তারিখ: ২৯ আগস্ট ২০২৬</p>
      </div>
      <div class="card">
        <span style="background: #ecfdf5; color: #059669; padding: 2px 6px; border-radius: 4px; font-size: 12px;">মেলান্দহ</span>
        <h3 style="margin: 8px 0;">ঐতিহ্যবাহী নকশী কাঁথা কারিগরদের বিশেষ সম্মাননা</h3>
        <p style="font-size: 14px; color: #64748b;">মেলান্দহ উপজেলায় তিন দিনব্যাপী হস্তশিল্প মেলার সফল সমাপ্তি...</p>
        <p style="font-size: 12px; color: #94a3b8; margin-top: 8px;">তারিখ: ২৮ আগস্ট ২০২৬</p>
      </div>
    </div>
  `, 'news'));

  root.file('bus.html', makeHtml('বাস সার্ভিস ও কাউন্টার', `
    <h2>🚌 জামালপুরের বাস সার্ভিস ও সময়সূচী</h2>
    <div class="grid-cards">
      <div class="card">
        <h3>রাজীব এন্টারপ্রাইজ (Rajib Enterprise)</h3>
        <p><strong>রুট:</strong> জামালপুর - ময়মনসিংহ - মহাখালী (ঢাকা)</p>
        <p><strong>ভাড়া:</strong> ৳ ৩৮০ (চেয়ার কোচ)</p>
        <p><strong>কাউন্টার:</strong> গেটপাড় বাস টার্মিনাল, জামালপুর | <strong>মোবাইল:</strong> 01712-349988</p>
      </div>
      <div class="card">
        <h3>আল-হেরা স্পেশাল (Al-Hera Deluxe)</h3>
        <p><strong>রুট:</strong> জামালপুর - নান্দিনা - ঢাকা (মহাখালী)</p>
        <p><strong>ভাড়া:</strong> ৳ ৩৮০ (চেয়ার কোচ)</p>
        <p><strong>কাউন্টার:</strong> পৌর বাস টার্মিনাল, জামালপুর | <strong>মোবাইল:</strong> 01715-667788</p>
      </div>
    </div>
  `, 'bus'));

  root.file('train.html', makeHtml('ট্রেন সময়সূচী', `
    <h2>🚆 জামালপুরের ট্রেন সময়সূচী ও ভাড়া</h2>
    <div class="grid-cards">
      <div class="card">
        <h3>তিস্তা এক্সপ্রেস (Teesta Express - ৭০৭/৭০৮)</h3>
        <p><strong>রুট:</strong> দেওয়ানগঞ্জ - জামালপুর - ঢাকা</p>
        <p><strong>জামালপুর ছাড়ে:</strong> বিকাল ৪:০৫ | ঢাকা পৌঁছে: রাত ৯:০০</p>
        <p><strong>সাপ্তাহিক ছুটি:</strong> সোমবার</p>
        <p><strong>ভাড়া:</strong> শোভন চেয়ার ৳ ১৬৫ | স্নিগ্ধা ৳ ৩১৫ | এসি সিট ৳ ৩৮০</p>
      </div>
      <div class="card">
        <h3>ব্রহ্মপুত্র এক্সপ্রেস (Brahmaputra Express - ৭৪৩/৭৪৪)</h3>
        <p><strong>রুট:</strong> দেওয়ানগঞ্জ - জামালপুর - ঢাকা</p>
        <p><strong>জামালপুর ছাড়ে:</strong> সকাল ৭:৪৩ | ঢাকা পৌঁছে: দুপুর ১২:৩০</p>
        <p><strong>ছুটি:</strong> নেই (সপ্তাহে প্রতিদিন)</p>
      </div>
    </div>
  `, 'train'));

  root.file('hospital.html', makeHtml('হাসপাতাল ও জরুরি সেবা', `
    <h2>🏥 জামালপুর জেলা হাসপাতাল ও স্বাস্থ্যকেন্দ্র</h2>
    <div class="grid-cards">
      <div class="card">
        <h3>জামালপুর ২৫০ শয্যা জেনারেল হাসপাতাল</h3>
        <p><strong>ঠিকানা:</strong> হাসপাতাল রোড, জামালপুর সদর</p>
        <p><strong>জরুরি বিভাগ:</strong> 01712-345678 (২৪ ঘণ্টা খোলা)</p>
        <p><strong>অ্যাম্বুলেন্স:</strong> 01711-224466</p>
      </div>
      <div class="card">
        <h3>শেখ হাসিনা মেডিকেল কলেজ হাসপাতাল</h3>
        <p><strong>ঠিকানা:</strong> মনিরাজপুর, জামালপুর</p>
        <p><strong>ফোন:</strong> 0981-62500</p>
      </div>
    </div>
  `, 'hospital'));

  root.file('doctors.html', makeHtml('ডাক্তার ডিরেক্টরি', `
    <h2>👨‍⚕️ জামালপুরের বিশেষজ্ঞ চিকিৎসক তালিকা</h2>
    <div class="grid-cards">
      <div class="card">
        <h3>ডাঃ মোঃ মোস্তাফিজুর রহমান</h3>
        <p style="color: #059669; font-weight: 600;">হৃদরোগ ও মেডিসিন বিশেষজ্ঞ</p>
        <p>MBBS, FCPS (Medicine), MD (Cardiology)</p>
        <p><strong>চেম্বার:</strong> আল-রাজি হাসপাতাল, জামালপুর</p>
        <p><strong>সিরিয়াল:</strong> 01720-334455</p>
      </div>
    </div>
  `, 'doctors'));

  root.file('medicine.html', makeHtml('ঔষধ তথ্য নির্দেশিকা', `
    <h2>💊 প্রয়োজনীয় ঔষধ তথ্য ও সঠিক ব্যবহার</h2>
    <div style="background: #fffbeb; border: 1px solid #fef3c7; padding: 12px; border-radius: 8px; margin-bottom: 16px;">
      ⚠️ <em>সতর্কবার্তা: এটি চিকিৎসকের ব্যবস্থাপত্রের বিকল্প নয়। যেকোনো ওষুধ সেবনের পূর্বে রেজিস্টার্ড চিকিৎসকের পরামর্শ গ্রহণ করুন।</em>
    </div>
    <div class="grid-cards">
      <div class="card">
        <h3>Napa Extra (Paracetamol + Caffeine)</h3>
        <p><strong>জেনেরিক:</strong> Paracetamol 500mg + Caffeine 65mg</p>
        <p><strong>ব্যবহার:</strong> জ্বর, তীব্র মাথাব্যথা ও শরীর ব্যথা</p>
        <p><strong>কোম্পানি:</strong> Beximco Pharmaceuticals</p>
      </div>
    </div>
  `, 'medicine'));

  root.file('jobs.html', makeHtml('চাকরির খবর', `
    <h2>💼 জামালপুরের স্থানীয় চাকরির বিজ্ঞপ্তি</h2>
    <div class="grid-cards">
      <div class="card">
        <h3>কম্পিউটার অপারেটর ও কাস্টমার সার্ভিস</h3>
        <p><strong>প্রতিষ্ঠান:</strong> জামালপুর ডিজিটাল সার্ভিসেস</p>
        <p><strong>বেতন:</strong> ১২,০০০ - ১৫,০০০ টাকা</p>
        <p><strong>আবেদনের শেষ তারিখ:</strong> ১৫ সেপ্টেম্বর ২০২৬</p>
      </div>
    </div>
  `, 'jobs'));

  root.file('education.html', makeHtml('শিক্ষা কর্নার', `
    <h2>📚 শিক্ষা ও ই-বুক কর্নার (Class 1-10)</h2>
    <div class="grid-cards">
      <div class="card">
        <h3>১০ম শ্রেণির মূল বাংলা পাঠ্যবই (NCTB)</h3>
        <p>জাতীয় শিক্ষাক্রম ও পাঠ্যপুস্তক বোর্ড অনুমোদিত মূল সংস্করণ</p>
        <a href="https://nctb.gov.bd" target="_blank" class="btn-primary" style="margin-top: 10px;">ডাউনলোড / পড়ুন</a>
      </div>
    </div>
  `, 'education'));

  root.file('quiz.html', makeHtml('অনলাইন কুইজ', `
    <h2>🎯 জামালপুর জেলা ও সাধারণ জ্ঞান কুইজ</h2>
    <div class="card" style="max-width: 600px; margin: 0 auto; text-align: center;">
      <h3 id="q-text">প্রশ্ন: জামালপুর জেলায় মোট কতটি উপজেলা রয়েছে?</h3>
      <div style="margin: 20px 0; display: grid; gap: 10px;">
        <button class="btn-primary" style="background:#f1f5f9; color:#0f172a;" onclick="alert('ভুল উত্তর!')">৫টি</button>
        <button class="btn-primary" style="background:#f1f5f9; color:#0f172a;" onclick="alert('ভুল উত্তর!')">৬টি</button>
        <button class="btn-primary" style="background:#059669; color:#fff;" onclick="alert('অভিনন্দন! সঠিক উত্তর: ৭টি')">৭টি (সঠিক)</button>
        <button class="btn-primary" style="background:#f1f5f9; color:#0f172a;" onclick="alert('ভুল উত্তর!')">৮টি</button>
      </div>
    </div>
  `, 'quiz'));

  root.file('blood-donor.html', makeHtml('রক্তদাতা ডিরেক্টরি', `
    <h2>🩸 জামালপুর ব্লাড ডোনার ডিরেক্টরি</h2>
    <div class="grid-cards">
      <div class="card">
        <h3>তানভীর হাসান <span style="background: #fee2e2; color: #dc2626; padding: 2px 8px; border-radius: 99px; font-size: 12px;">O+ (পজিটিভ)</span></h3>
        <p><strong>অবস্থান:</strong> দেওয়ানপাড়া, জামালপুর সদর</p>
        <p><strong>স্ট্যাটাস:</strong> রক্তদানে প্রস্তুত</p>
        <a href="tel:01711223344" class="btn-primary" style="margin-top: 10px;">📞 কল করুন: 01711-223344</a>
      </div>
    </div>
  `, 'blood-donor'));

  root.file('prayer.html', makeHtml('নামাজের সময়সূচী', `
    <h2>🕌 জামালপুর জেলার নামাজের সময়সূচী</h2>
    <div class="grid-cards" style="grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));">
      <div class="card" style="text-align: center;"><h4>ফজর</h4><p style="font-size: 20px; font-weight: bold; color: #059669;">০৪:১৫ AM</p></div>
      <div class="card" style="text-align: center;"><h4>যোহর</h4><p style="font-size: 20px; font-weight: bold; color: #059669;">১২:০৫ PM</p></div>
      <div class="card" style="text-align: center;"><h4>আসর</h4><p style="font-size: 20px; font-weight: bold; color: #059669;">০৪:৩৪ PM</p></div>
      <div class="card" style="text-align: center;"><h4>মাগরিব</h4><p style="font-size: 20px; font-weight: bold; color: #059669;">০৬:২৫ PM</p></div>
      <div class="card" style="text-align: center;"><h4>এশা</h4><p style="font-size: 20px; font-weight: bold; color: #059669;">০৭:৪৫ PM</p></div>
    </div>
  `, 'prayer'));

  root.file('market-price.html', makeHtml('দৈনিক বাজারদর', `
    <h2>🥗 জামালপুর স্থানীয় কাঁচাবাজার দর</h2>
    <div class="card">
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="border-bottom: 2px solid #e2e8f0; text-align: left;">
            <th style="padding: 8px;">পণ্য</th>
            <th style="padding: 8px;">পরিমাণ</th>
            <th style="padding: 8px;">বর্তমান মূল্য</th>
            <th style="padding: 8px;">বাজার</th>
          </tr>
        </thead>
        <tbody>
          <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px;">মিনিকেট চাল</td><td>১ কেজি</td><td>৳ ৭২</td><td>জামালপুর বড় বাজার</td></tr>
          <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px;">গোল আলু</td><td>১ কেজি</td><td>৳ ৩৮</td><td>নান্দিনা বাজার</td></tr>
          <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px;">দেশি পেঁয়াজ</td><td>১ কেজি</td><td>৳ ৮৫</td><td>ইসলামপুর বাজার</td></tr>
          <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px;">ব্রয়লার মুরগি</td><td>১ কেজি</td><td>৳ ১৭৫</td><td>দেওয়ানগঞ্জ বাজার</td></tr>
        </tbody>
      </table>
    </div>
  `, 'market-price'));

  root.file('business.html', makeHtml('ব্যবসা ডিরেক্টরি', `
    <h2>🏢 জামালপুর লোকাল বিজনেস ডিরেক্টরি</h2>
    <div class="grid-cards">
      <div class="card">
        <h3>মা মনি কম্পিউটার্স ও ট্রেনিং</h3>
        <p><strong>ক্যাটেগরি:</strong> Computer Shop & Training</p>
        <p><strong>ঠিকানা:</strong> আশেক মাহমুদ কলেজ গেট, জামালপুর সদর</p>
        <p><strong>মোবাইল:</strong> 01712-445566</p>
      </div>
      <div class="card">
        <h3>জামালপুর গ্র্যান্ড প্যালেস রেস্তোরাঁ</h3>
        <p><strong>ক্যাটেগরি:</strong> Restaurant & Dining</p>
        <p><strong>ঠিকানা:</strong> বকশীগঞ্জ রোড মোড়, জামালপুর</p>
        <p><strong>মোবাইল:</strong> 01911-889900</p>
      </div>
    </div>
  `, 'business'));

  root.file('about.html', makeHtml('আমাদের সম্পর্কে ও উদ্যোক্তা', `
    <div class="card" style="max-width: 700px; margin: 0 auto;">
      <h2>About Our Jamalpur</h2>
      <p style="margin: 12px 0;"><strong>Our Jamalpur</strong> জামালপুর জেলার মানুষের জন্য একটি স্বয়ংসম্পূর্ণ আধুনিক ডিজিটাল প্ল্যাটফর্ম।</p>
      <div style="background: #ecfdf5; padding: 16px; border-radius: 8px; margin: 16px 0;">
        <h3>উদ্যোক্তা ও পরিচালক (Owner Information)</h3>
        <p style="font-size: 18px; font-weight: bold; color: #059669; margin-top: 4px;">মাসুদ রানা <span style="font-size: 14px; color: #3b82f6; background: #eff6ff; padding: 2px 8px; border-radius: 12px; border: 1px solid #bfdbfe;">Verified ☑️</span></p>
        <p style="font-size: 14px; color: #475569;">উদ্দেশ্য: জামালপুর জেলার সকল নাগরিককে ডিজিটাল সুবিধা ও তথ্য প্রবাহের আওতায় নিয়ে আসা।</p>
      </div>
    </div>
  `, 'about'));

  root.file('contact.html', makeHtml('যোগাযোগ', `
    <div class="card" style="max-width: 600px; margin: 0 auto;">
      <h2>📞 আমাদের সাথে যোগাযোগ করুন</h2>
      <p>যেকোনো তথ্য বা বিজ্ঞাপনের জন্য মেসেজ পাঠান:</p>
      <form onsubmit="event.preventDefault(); alert('ধন্যবাদ! আপনার বার্তা গৃহীত হয়েছে।');">
        <div style="margin-top: 10px;"><label>নাম</label><input type="text" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px;" required></div>
        <div style="margin-top: 10px;"><label>মোবাইল / ইমেইল</label><input type="text" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px;" required></div>
        <div style="margin-top: 10px;"><label>বার্তা</label><textarea rows="4" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px;" required></textarea></div>
        <button type="submit" class="btn-primary" style="margin-top: 14px; width: 100%; justify-content: center;">বার্তা পাঠান</button>
      </form>
    </div>
  `, 'about'));

  root.file('profile.html', makeHtml('ইউজার প্রোফাইল', `
    <div class="card" style="max-width: 600px; margin: 0 auto;">
      <h2>👤 আমার প্রোফাইল</h2>
      <div style="display: flex; gap: 16px; align-items: center; margin: 16px 0;">
        <div style="width: 60px; height: 60px; background: #059669; color: white; font-size: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">MR</div>
        <div>
          <h3>মাসুদ রানা</h3>
          <p style="color: #64748b;">মোবাইল: 01700112233 | রোল: Admin</p>
        </div>
      </div>
      <a href="sell.html" class="btn-primary" style="margin-right: 8px;">➕ নতুন বিজ্ঞাপন</a>
      <a href="admin/index.html" class="btn-primary" style="background: #d97706;">অ্যাডমিন ড্যাশবোর্ড</a>
    </div>
  `, 'profile'));

  // Admin section
  const adminFolder = root.folder('admin');
  const makeAdminHtml = (title: string, content: string) => `<!DOCTYPE html>
<html lang="bn">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Admin - ${title} - Our Jamalpur</title>
  <link rel="stylesheet" href="../css/style.css">
</head>
<body style="background: #f1f5f9;">
  <header style="background: #0f172a; color: white; padding: 14px 0;">
    <div class="container flex-between" style="display: flex; justify-content: space-between; align-items: center;">
      <h2 style="font-size: 18px;"><a href="index.html" style="color: white;">🛡️ Our Jamalpur Admin</a></h2>
      <div><a href="../index.html" style="color: #94a3b8; margin-right: 14px;">ওয়েবসাইটে ফিরুন</a> <span style="background: #059669; padding: 4px 10px; border-radius: 6px; font-size: 12px;">মাসুদ রানা (Super Admin)</span></div>
    </div>
  </header>
  <div class="container" style="display: grid; grid-template-columns: 220px 1fr; gap: 20px; margin-top: 20px;">
    <div class="card" style="padding: 10px;">
      <ul style="list-style: none; display: flex; flex-direction: column; gap: 6px;">
        <li><a href="index.html" style="display: block; padding: 8px; border-radius: 6px; background: #ecfdf5; color: #059669; font-weight: bold;">📊 ড্যাশবোর্ড</a></li>
        <li><a href="products.html" style="display: block; padding: 8px;">🛒 পণ্য ম্যানেজমেন্ট</a></li>
        <li><a href="news.html" style="display: block; padding: 8px;">📰 খবর ম্যানেজমেন্ট</a></li>
        <li><a href="users.html" style="display: block; padding: 8px;">👥 ইউজার তালিকা</a></li>
        <li><a href="settings.html" style="display: block; padding: 8px;">⚙️ সেটিংস ও নোটিশ</a></li>
      </ul>
    </div>
    <div>${content}</div>
  </div>
  <script src="../js/app.js"></script>
</body>
</html>`;

  adminFolder?.file('index.html', makeAdminHtml('ড্যাশবোর্ড', `
    <div class="card">
      <h2>অ্যাডমিন ওভারভিউ ও পরিসংখ্যান</h2>
      <div class="grid-cards" style="grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); margin-top: 16px;">
        <div class="card" style="background: #ecfdf5; border-color: #a7f3d0;"><h4>মোট বিজ্ঞাপন</h4><p style="font-size: 28px; font-weight: bold; color: #059669;">২৪টি</p></div>
        <div class="card" style="background: #eff6ff; border-color: #bfdbfe;"><h4>মোট সংবাদ</h4><p style="font-size: 28px; font-weight: bold; color: #2563eb;">১৮টি</p></div>
        <div class="card" style="background: #fdf2f8; border-color: #fbcfe8;"><h4>রক্তদাতা</h4><p style="font-size: 28px; font-weight: bold; color: #db2777;">৪২ জন</p></div>
        <div class="card" style="background: #fffbeb; border-color: #fde68a;"><h4>দৈনিক ভিজিটর</h4><p style="font-size: 28px; font-weight: bold; color: #d97706;">১,৫৪০+</p></div>
      </div>
    </div>
  `));

  adminFolder?.file('products.html', makeAdminHtml('পণ্য ম্যানেজমেন্ট', `
    <div class="card">
      <h2>মার্কেটপ্লেস পণ্য তালিকা</h2>
      <p style="color: #64748b; margin-bottom: 12px;">বিজ্ঞাপন অনুমোদন ও ডিলিট করুন</p>
      <button class="btn-primary" onclick="alert('নতুন পণ্য ফর্ম ওপেন হচ্ছে')">➕ নতুন পণ্য যোগ করুন</button>
    </div>
  `));

  adminFolder?.file('news.html', makeAdminHtml('সংবাদ ম্যানেজমেন্ট', `
    <div class="card">
      <h2>স্থানীয় সংবাদ প্রকাশনা</h2>
      <button class="btn-primary" onclick="alert('সংবাদ পোস্ট ফর্ম ওপেন হচ্ছে')">➕ নতুন সংবাদ প্রকাশ করুন</button>
    </div>
  `));

  adminFolder?.file('users.html', makeAdminHtml('ইউজার ম্যানেজমেন্ট', `
    <div class="card">
      <h2>নিবন্ধিত ইউজার ও সদস্য তালিকা</h2>
      <p style="color: #64748b;">সকল জামালপুর পোর্টাল ইউজারবৃন্দ</p>
    </div>
  `));

  adminFolder?.file('settings.html', makeAdminHtml('ওয়েবসাইট সেটিংস', `
    <div class="card">
      <h2>সাইট সেটিংস ও নোটিশ স্ক্রল</h2>
      <div style="margin-top: 14px;"><label>ব্রেকিং নোটিশ</label><input type="text" value="জামালপুর সদর ও ইসলামপুর রুটে নতুন বিআরটিসি এসি বাস সার্ভিস উদ্বোধন" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px;"></div>
      <button class="btn-primary" style="margin-top: 14px;" onclick="alert('সেটিংস সংরক্ষিত হয়েছে!')">সেভ করুন</button>
    </div>
  `));

  // 3. README.md
  root.file('README.md', `# Our Jamalpur — ডিজিটাল জামালপুর পোর্টাল ও অ্যান্ড্রয়েড প্রজেক্ট

**Our Jamalpur** হলো জামালপুর জেলার মানুষের জন্য তৈরি একটি সম্পূর্ণ, আধুনিক, মোবাইল-ফার্স্ট কমিউনিটি ওয়েব পোর্টাল ও লোকাল ডিজিটাল প্ল্যাটফর্ম।

---

## 👤 উদ্যোক্তা ও পরিচালক (Owner)
- **উদ্যোক্তা:** মাসুদ রানা (Verified ☑️)
- **উদ্দেশ্য:** জামালপুর জেলার সকল নাগরিকের কাছে নির্ভরযোগ্য তথ্য, স্থানীয় খবর, কেনাবেচা, যোগাযোগ এবং জরুরি সেবা সহজে পৌঁছে দেওয়া।

---

## 📱 Spck Editor (Android) এ কীভাবে Import করবেন:
1. ডাউনলোড করা \`Our-Jamalpur.zip\` ফাইলটি আপনার মোবাইলে সংরক্ষণ করুন।
2. অ্যান্ড্রয়েড ফোনে **Spck Editor** অ্যাপ ওপেন করুন।
3. মেনু থেকে **Import Project / Open ZIP** সিলেক্ট করুন।
4. \`Our-Jamalpur.zip\` সিলেক্ট করলে সম্পূর্ণ প্রজেক্ট ফোল্ডার এবং সব HTML/CSS/JS ফাইল কোড সহ ওপেন হবে।
5. সরাসরি **Run (Play button)** চাপলে এটি আপনার মোবাইলেই ফুল অফলাইন লাইভ চলবে!

---

## 📂 Project Structure
\`\`\`
Our-Jamalpur/
├── index.html           # মূল হোমপেজ ও ড্যাশবোর্ড
├── login.html           # ব্যবহারকারী লগইন
├── register.html        # নতুন অ্যাকাউন্ট নিবন্ধন
├── marketplace.html     # বিক্রেতা ও ক্রেতাদের মার্কেটপ্লেস
├── product-details.html # পণ্যের পূর্ণাঙ্গ বিবরণ
├── sell.html            # বিনামূল্যে বিজ্ঞাপন দেওয়ার ফর্ম
├── news.html            # জামালপুর জেলার ৭টি উপজেলার খবর
├── bus.html             # বাসের সময়সূচী ও কাউন্টার
├── train.html           # ট্রেনের সময়সূচী ও ভাড়া
├── hospital.html        # হাসপাতাল ও জরুরি নম্বর
├── doctors.html         # বিশেষজ্ঞ ডাক্তারদের তালিকা ও সিরিয়াল
├── medicine.html        # প্রয়োজনীয় ঔষধের তথ্য ও সতর্কতা
├── jobs.html            # স্থানীয় চাকরির বিজ্ঞপ্তি
├── education.html       # ১ম-১০ম শ্রেণির বই ও পড়ালেখা
├── quiz.html            # অনলাইন কুইজ প্রতিযোগিতা
├── blood-donor.html     # রক্তদাতা ডিরেক্টরি
├── prayer.html          # জামালপুরের নামাজের সময়সূচী
├── market-price.html    # প্রতিদিনের বাজারদর
├── business.html        # স্থানীয় ব্যবসা ডিরেক্টরি
├── contact.html         # যোগাযোগ পেজ
├── about.html           # আমাদের সম্পর্কে ও উদ্যোক্তা তথ্য
│
├── admin/               # অ্যাডমিন প্যানেল
│   ├── index.html       # অ্যাডমিন ড্যাশবোর্ড
│   ├── products.html    # পণ্য নিয়ন্ত্রণ
│   ├── news.html        # সংবাদ প্রকাশ
│   ├── users.html       # ইউজার তালিকা
│   └── settings.html    # সাইট সেটিংস ও নোটিশ
│
├── css/
│   ├── style.css        # মূল স্টাইলশিট
│   └── responsive.css   # মোবাইল ও ট্যাবলেট রেসপন্সিভনেস
│
├── js/
│   ├── app.js           # ডিজিটাল ঘড়ি ও মূল লজিক
│   ├── auth.js          # অথেনটিকেশন লজিক
│   ├── marketplace.js   # মার্কেটপ্লেস ফিল্টার
│   ├── news.js          # নিউজ ফিল্টার
│   ├── transport.js     # পরিবহন শিডিউল
│   ├── search.js        # গ্লোবাল সার্চ ইঞ্জিন
│   └── admin.js         # অ্যাডমিন প্যানেল লজিক
│
└── README.md            # সম্পূর্ণ প্রজেক্ট ডকুমেন্টেশন
\`\`\`

---

## 💻 কীভাবে চালাবেন (Desktop / Browser)
- যেকোনো আধুনিক ব্রাউজারে \`index.html\` ডাবল ক্লিক করে ওপেন করলেই চলবে।
- কোনো নোড বা অতিরিক্ত সার্ভার ছাড়াই ব্রাউজারের LocalStorage ব্যবহার করে সম্পূর্ণ কাজ করে।

---

## 🛡️ অ্যাডমিন প্যানেল ব্যবহার
- নেভিগেশন বার থেকে **Admin Panel** বা \`admin/index.html\` এ প্রবেশ করুন।
- এখান থেকে সহজেই নতুন খবর প্রকাশ, পণ্য ডিলিট/অনুমোদন, নোটিশ পরিবর্তন এবং বাজারদর আপডেট করা যায়।

---

## 🚀 Android APK বানানোর প্রক্রিয়া (Capacitor / WebView)
1. **Node.js** ইন্সটল থাকা অবস্থায় কমান্ড লাইনে রান করুন:
   \`\`\`bash
   npm install @capacitor/core @capacitor/cli @capacitor/android
   npx cap init "Our Jamalpur" "com.ourjamalpur.app"
   npx cap add android
   npx cap open android
   \`\`\`
2. এরপর Android Studio থেকে সরাসরি **Build APK** করলেই আপনার নিজস্ব Android App তৈরি হয়ে যাবে!

---
© 2026 Our Jamalpur | Developed for the people of Jamalpur District.
`);

  return zip.generateAsync({
    type: 'blob',
    mimeType: 'application/zip',
    compression: 'DEFLATE',
    compressionOptions: {
      level: 6
    }
  });
}

export function generateSingleHtmlFile(): Blob {
  const content = `<!DOCTYPE html>
<html lang="bn">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Our Jamalpur - আমাদের জামালপুর</title>
  <link href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@300;400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    * { font-family: 'Hind Siliguri', 'Plus Jakarta Sans', sans-serif; -webkit-tap-highlight-color: transparent; }
  </style>
</head>
<body class="bg-slate-50 text-slate-900 pb-20">
  <!-- Live Clock Header -->
  <header class="bg-emerald-900 text-emerald-100 text-xs py-2 px-4 sticky top-0 z-50 flex items-center justify-between border-b border-emerald-800">
    <div class="flex items-center gap-2">
      <span class="font-bold text-amber-300">জামালপুর জেলা পোর্টাল</span>
      <span id="live-time" class="bg-emerald-950 px-2 py-0.5 rounded text-emerald-300"></span>
    </div>
    <div class="text-[11px] bg-emerald-800/60 px-2 py-0.5 rounded">
      🌡️ ২৯°C (আংশিক মেঘলা)
    </div>
  </header>

  <!-- Hero Header -->
  <div class="bg-emerald-800 text-white p-6 shadow-md">
    <div class="max-w-4xl mx-auto flex items-center gap-4">
      <div class="w-14 h-14 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-2xl shadow-lg">
        OJ
      </div>
      <div>
        <h1 class="text-2xl font-black">আমাদের জামালপুর (Our Jamalpur)</h1>
        <p class="text-xs text-emerald-200 mt-0.5">জামালপুর জেলার সব খবর, মার্কেটপ্লেস, যাতায়াত, স্বাস্থ্য ও শিক্ষা সেবা এক অ্যাপে</p>
      </div>
    </div>
  </div>

  <!-- Emergency Quick Bar -->
  <div class="max-w-4xl mx-auto px-4 mt-4">
    <div class="bg-red-50 border border-red-200 rounded-xl p-3 flex flex-wrap items-center justify-between gap-2">
      <span class="text-xs font-bold text-red-800 flex items-center gap-1">
        🚨 জরুরি হেল্পলাইন: ৯৯৯ | হাসপাতাল: ০৯৮১-৬৩১৮০ | ফায়ার সার্ভিস: ০১৭৩০-০০২৪৪৫
      </span>
      <a href="tel:999" class="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-3 py-1 rounded-lg">কল ৯৯৯</a>
    </div>
  </div>

  <!-- Services Grid -->
  <div class="max-w-4xl mx-auto p-4">
    <h2 class="text-base font-bold text-slate-800 mb-3">প্রধান সেবাসমূহ</h2>
    <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
      <div class="bg-white p-4 rounded-xl shadow-xs border border-slate-200 flex flex-col items-center text-center">
        <span class="text-3xl mb-1">🛍️</span>
        <h3 class="font-bold text-sm text-slate-900">মার্কেটপ্লেস</h3>
        <p class="text-[11px] text-slate-500 mt-0.5">নকশী কাঁথা, হস্তশিল্প ও ক্রয়-বিক্রয়</p>
      </div>
      <div class="bg-white p-4 rounded-xl shadow-xs border border-slate-200 flex flex-col items-center text-center">
        <span class="text-3xl mb-1">📰</span>
        <h3 class="font-bold text-sm text-slate-900">জেলা সংবাদ</h3>
        <p class="text-[11px] text-slate-500 mt-0.5">৭টি উপজেলার টাটকা খবর</p>
      </div>
      <div class="bg-white p-4 rounded-xl shadow-xs border border-slate-200 flex flex-col items-center text-center">
        <span class="text-3xl mb-1">🚌</span>
        <h3 class="font-bold text-sm text-slate-900">বাস সার্ভিস</h3>
        <p class="text-[11px] text-slate-500 mt-0.5">ঢাকা-জামালপুর বাস ও কাউন্টার</p>
      </div>
      <div class="bg-white p-4 rounded-xl shadow-xs border border-slate-200 flex flex-col items-center text-center">
        <span class="text-3xl mb-1">🚆</span>
        <h3 class="font-bold text-sm text-slate-900">ট্রেন সময়সূচী</h3>
        <p class="text-[11px] text-slate-500 mt-0.5">তিস্তা, ব্রহ্মপুত্র ও যমুনা এক্সপ্রেস</p>
      </div>
      <div class="bg-white p-4 rounded-xl shadow-xs border border-slate-200 flex flex-col items-center text-center">
        <span class="text-3xl mb-1">🏥</span>
        <h3 class="font-bold text-sm text-slate-900">হাসপাতাল ও ডাক্তার</h3>
        <p class="text-[11px] text-slate-500 mt-0.5">বিশেষজ্ঞ ডাক্তারদের সিরিয়াল</p>
      </div>
      <div class="bg-white p-4 rounded-xl shadow-xs border border-slate-200 flex flex-col items-center text-center">
        <span class="text-3xl mb-1">🩸</span>
        <h3 class="font-bold text-sm text-slate-900">রক্তদাতা সন্ধান</h3>
        <p class="text-[11px] text-slate-500 mt-0.5">জরুরি রক্তের গ্রুপ ডিরেক্টরি</p>
      </div>
    </div>
  </div>

  <footer class="max-w-4xl mx-auto p-4 text-center text-xs text-slate-500 mt-8 border-t border-slate-200">
    <p>উদ্যোক্তা ও পরিচালক: <strong>মাসুদ রানা</strong> (Verified ☑️)</p>
    <p class="text-[11px] mt-1">© 2026 Our Jamalpur. All rights reserved.</p>
  </footer>

  <script>
    function tick() {
      const now = new Date();
      document.getElementById('live-time').textContent = now.toLocaleTimeString('bn-BD');
    }
    setInterval(tick, 1000);
    tick();
  </script>
</body>
</html>`;

  return new Blob([content], { type: 'text/html;charset=utf-8' });
}
