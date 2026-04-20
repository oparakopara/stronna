# Oparka – Rozkład Jazdy 🚌

Wyszukiwarka kursów na trasie **Gnieździska – Kielce**.  
Działa jako **PWA** — można zainstalować na telefonie jak aplikację.

🌐 **Strona:** `https://TWOJA-NAZWA.github.io/NAZWA-REPO/oparka.html`

## Funkcje

- Wyszukiwarka kursów z podpowiedziami (fuzzy search)
- Rozkład Pon–Pt / Sobota / Niedziela
- Najbliższy odjazd z odliczaniem
- Zamiana trasy jednym kliknięciem
- Tryb ciemny / jasny (zapamiętywany)
- Działa **offline** (service worker / PWA)

## Struktura

```
├── index.html        ← przekierowanie
├── oparka.html       ← główna aplikacja
├── app.js            ← logika i dane rozkładu
├── manifest.json     ← konfiguracja PWA
├── sw.js             ← service worker
├── icon-192.svg      ← ikona apki
├── icon-512.svg      ← ikona duża
└── .github/workflows/deploy.yml
```

## Wrzucenie na GitHub

```bash
git init
git add .
git commit -m "init: oparka PWA"
git branch -M main
git remote add origin https://github.com/TWOJA-NAZWA/NAZWA-REPO.git
git push -u origin main
```

Potem: **Settings → Pages → Source: GitHub Actions**

## Instalacja jako apka

- **Android / Chrome:** menu → *Dodaj do ekranu głównego*
- **iPhone / Safari:** *Udostępnij* → *Do ekranu początkowego*
