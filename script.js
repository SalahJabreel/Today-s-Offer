
// بيانات المقاهي



const cafes = [
  {
    id: 1,
    name: "كوفي شوب المدينة",
    offer: "أمريكانو مجاني مع أي حلوى",
    distance: 500,
    type: "new",
    views: 0
  },
  {
    id: 2,
    name: "مقهى النخبة",
    offer: "كابتشينو + كرواسون بـ 25 ريال سعودي",
    distance: 350,
    type: "special",
    views: 0
  },
  {
    id: 3,
    name: "كافيه الأصالة",
    offer: "لاتيه بـ 15 ريال سعودي",
    distance: 200,
    type: "discount",
    views: 0
  },
  {
    id: 4,
    name: "مقهى الشرق",
    offer: "إسبريسو دبل + بسكويت بـ 12 ريال سعودي",
    distance: 900,
    type: "hot",
    views: 0
  },
  {
    id: 5,
    name: "كافيه البستان",
    offer: "قهوة تركية + معمول بـ 20 ريال سعودي",
    distance: 1200,
    type: "popular",
    views: 0
  },
  {
    id: 6,
    name: "مقهى الروشة",
    offer: "موكا بالشوكولاتة بـ 18 ريال سعودي",
    distance: 750,
    type: "limited",
    views: 0
  }
];

// المفضلة
const FAVORITES_KEY = 'cafeFavorites';
function getFavorites() {
  return JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]');
}
function saveFavorite(id) {
  let favs = getFavorites();
  if (!favs.includes(id)) {
    favs.push(id);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favs));
  }
}

// عرض المقاهي


function getCardType(cafe) {
  if (cafe.type === "new") return "card-new";
  if (cafe.type === "special") return "card-special";
  if (cafe.type === "discount") return "card-discount";
  if (cafe.type === "hot") return "card-hot";
  if (cafe.type === "popular") return "card-popular";
  if (cafe.type === "limited") return "card-limited";
  return "";
}

function getBadge(cafe) {
  if (cafe.type === "new") return '<span class="card-badge">جديد</span>';
  if (cafe.type === "special") return '<span class="card-badge">عرض خاص</span>';
  if (cafe.type === "discount") return '<span class="card-badge">% خصم 30</span>';
  if (cafe.type === "hot") return '<span class="card-badge">ساخن</span>';
  if (cafe.type === "popular") return '<span class="card-badge">الأكثر طلباً</span>';
  if (cafe.type === "limited") return '<span class="card-badge">محدود</span>';
  return "";
}

function getIcon(cafe) {
  if (cafe.type === "new") return '<span class="card-icon">🟪</span>';
  if (cafe.type === "special") return '<span class="card-icon">🟩</span>';
  if (cafe.type === "discount") return '<span class="card-icon">🟧</span>';
  if (cafe.type === "hot") return '<span class="card-icon">🟧</span>';
  if (cafe.type === "popular") return '<span class="card-icon">🟦</span>';
  if (cafe.type === "limited") return '<span class="card-icon">🟥</span>';
  return '<span class="card-icon">☕</span>';
}

function getBtnClass(cafe) {
  return "details-btn";
}

function getMainTextClass(cafe) {
  if (["new","special","discount","hot","popular","limited"].includes(cafe.type)) return "main-text";
  return "";
}

function renderCafes(list = cafes) {
  const container = document.getElementById("cafe-cards");
  container.innerHTML = '';
  list.forEach(cafe => {
    cafe.views++;
    console.log(`تم عرض ${cafe.name} ${cafe.views} مرات`);
    const cardType = getCardType(cafe);
    const badge = getBadge(cafe);
    const icon = getIcon(cafe);
    const btnClass = getBtnClass(cafe);
    const mainTextClass = getMainTextClass(cafe);
    const card = document.createElement("div");
    card.className = `cafe-card ${cardType} flex flex-col items-center relative`;
    card.innerHTML = `
      ${badge}
      ${icon}
      <div class="p-4 flex-1 w-full text-center">
        <h2 class="font-bold text-lg mb-1">${cafe.name}</h2>
        <p class="${mainTextClass} text-lg font-bold mb-1">${cafe.offer}</p>
        <p class="text-xs text-gray-400 mb-2">${cafe.distance < 1000 ? cafe.distance + ' متر' : (cafe.distance/1000).toFixed(1) + ' كم'} <span style="font-size:1.1em;vertical-align:middle;">📍</span></p>
        <button class="${btnClass}" data-id="${cafe.id}">عرض التفاصيل</button>
      </div>
    `;
    container.appendChild(card);
  });
}

// تفعيل زر المفضلة
document.addEventListener('click', function(e) {
  if (e.target.classList.contains('favorite-btn')) {
    const id = Number(e.target.getAttribute('data-id'));
    saveFavorite(id);
    e.target.textContent = '⭐ تمت الإضافة';
    e.target.disabled = true;
  }
});

// الموقع الجغرافي
document.getElementById("enable-location")?.addEventListener("click", () => {
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(
      function (pos) {
        document.querySelector('.bg-yellow-100').style.display = 'none';
      },
      function () {
        alert("تعذر الحصول على الموقع");
      }
    );
  } else {
    alert("المتصفح لا يدعم تحديد الموقع");
  }
});

// البحث والفرز
document.addEventListener('DOMContentLoaded', () => {
  renderCafes();
  const searchInput = document.querySelector('input[type="text"]');
  searchInput.addEventListener('input', function() {
    const val = this.value.trim();
    if (val === '') {
      renderCafes();
    } else {
      const filtered = cafes.filter(cafe => cafe.name.includes(val) || cafe.offer.includes(val));
      renderCafes(filtered);
    }
  });
  // فرز حسب الأقرب
  document.querySelectorAll('button').forEach(btn => {
    if (btn.textContent.includes('الأقرب')) {
      btn.addEventListener('click', () => {
        const sorted = [...cafes].sort((a,b) => a.distance - b.distance);
        renderCafes(sorted);
      });
    }
    if (btn.textContent.includes('الأحدث')) {
      btn.addEventListener('click', () => {
        renderCafes(cafes.reverse());
      });
    }
  });
});