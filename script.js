const username = new URLSearchParams(window.location.search).get('user') || 'octocat';

async function loadGitHubProfile() {
  try {
    const profileRes = await fetch(`https://api.github.com/users/${username}`);
    if (!profileRes.ok) throw new Error('profile failed');
    const profile = await profileRes.json();

    const reposRes = await fetch(
      `https://api.github.com/users/${username}/repos?sort=updated&per_page=6&type=owner`
    );
    const repos = reposRes.ok ? await reposRes.json() : [];

    document.querySelector('[data-gh="name"]').textContent = profile.name || profile.login;
    document.querySelector('[data-gh="bio"]').textContent =
      profile.bio || '热爱创造清晰、克制、优雅的数字产品体验。';
    document.querySelector('[data-gh="avatar"]').src = profile.avatar_url;
    document.querySelector('[data-gh="avatar"]').alt = `${profile.login} avatar`;
    document.querySelector('[data-gh="followers"]').textContent = `${profile.followers}+`;
    document.querySelector('[data-gh="repos"]').textContent = `${profile.public_repos}+`;
    document.querySelector('[data-gh="location"]').textContent = profile.location || 'Earth';
    document.querySelector('[data-gh="github-link"]').href = profile.html_url;
    document.querySelector('[data-gh="github-link"]').textContent = `github.com/${profile.login}`;
    document.title = `${profile.name || profile.login} | 个人网站`;

    const cards = document.querySelector('.cards');
    cards.innerHTML = '';
    repos.slice(0, 3).forEach((repo) => {
      const item = document.createElement('article');
      item.className = 'card reveal';
      item.innerHTML = `
        <h3>${repo.name}</h3>
        <p>${repo.description || '这个仓库暂时还没有描述。'}</p>
        <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer">查看仓库 →</a>
      `;
      cards.appendChild(item);
    });
    observeReveal();
  } catch (error) {
    console.error(error);
  }
}

function observeReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18 }
  );

  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
}

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  document.querySelectorAll('[data-parallax]').forEach((el) => {
    const speed = Number(el.getAttribute('data-parallax'));
    el.style.transform = `translate3d(0, ${y * speed}px, 0)`;
  });
});

loadGitHubProfile();
observeReveal();
