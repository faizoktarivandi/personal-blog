let articlesDB = {};

// 1. Ambil data dari JSON
async function loadArticles() {
    try {
        const response = await fetch('articles.json');
        articlesDB = await response.json();
        renderBlogList();
        
        // Cek URL kalau-kalau diakses lewat direct link (misal: ?post=post-1)
        const urlParams = new URLSearchParams(window.location.search);
        const postId = urlParams.get('post');
        if (postId && articlesDB[postId]) {
            openPost(postId, false);
        }
    } catch (error) {
        console.error("Gagal memuat artikel:", error);
        document.getElementById('blog-list-view').innerHTML = '<p style="text-align:center;">Gagal memuat artikel. Coba refresh.</p>';
    }
}

// 2. Render kartu artikel ke HTML
function renderBlogList() {
    const container = document.getElementById('blog-list-view');
    container.innerHTML = ''; 

    // Looping semua artikel di JSON untuk dibikin card-nya
    for (const [id, data] of Object.entries(articlesDB)) {
        const card = document.createElement('div');
        card.className = 'post-card';
        card.onclick = () => openPost(id);
        
        card.innerHTML = `
            <div class="post-meta">${data.date}</div>
            <h2>${data.title}</h2>
            <p class="post-excerpt">${data.excerpt}</p>
        `;
        container.appendChild(card);
    }
}

// 3. Fungsi Buka Artikel
function openPost(postId, pushHistory = true) {
    const data = articlesDB[postId];
    if (!data) return;

    document.getElementById('article-title').innerText = data.title;
    document.getElementById('article-date').innerText = data.date;
    document.getElementById('article-body').innerHTML = data.content;

    document.getElementById('blog-list-view').style.display = 'none';
    document.getElementById('single-post-view').style.display = 'block';
    
    if (pushHistory) {
        history.pushState({ postId: postId }, '', `?post=${postId}`);
    }
    window.scrollTo(0, 0);
}

// 4. Fungsi Tutup Artikel
function closePost() {
    document.getElementById('single-post-view').style.display = 'none';
    document.getElementById('blog-list-view').style.display = 'block';
    
    history.pushState(null, '', window.location.pathname);
    window.scrollTo(0, 0);
}

// Handle tombol Back di browser
window.addEventListener('popstate', (event) => {
    if (event.state && event.state.postId) {
        openPost(event.state.postId, false);
    } else {
        closePost();
    }
});

// Jalankan saat script pertama kali dimuat
loadArticles();