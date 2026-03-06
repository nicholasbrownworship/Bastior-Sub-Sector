# Bastior Sub-Sector — Tyrannic War Crusade

A fully custom campaign website for a Warhammer 40,000 Tyrannic War Crusade campaign set in the Bastior Sub-Sector.

## Pages

| File | Description |
|------|-------------|
| `index.html` | Home / campaign hub |
| `lore.html` | Sub-sector lore, world descriptions, faction background |
| `sector-map.html` | Interactive SVG sector map with clickable systems |
| `roster.html` | Force roster — add/track units, XP, and ranks |
| `battle-log.html` | Log battles with results, notes, and honours earned |
| `crusade-order.html` | Order of Battle — player force cards and campaign rules |
| `agendas.html` | All crusade agendas (universal + Tyrannic War specific) |
| `honour-roll.html` | Battle Honours and Battle Scars reference table |
| `rules-ref.html` | Quick-reference for Tyrannic War special rules |
| `tracker.html` | Interactive CP tracker, dice roller, wound counter |

## Assets

- `css/style.css` — Full grimdark gothic stylesheet
- `js/main.js` — Navigation, animations, localStorage trackers, dice roller

## Hosting on GitHub Pages

1. Create a new GitHub repository
2. Upload all files maintaining the folder structure
3. Go to **Settings → Pages**
4. Set Source to **Deploy from a branch**, Branch: `main`, Folder: `/ (root)`
5. Your site will be live at `https://yourusername.github.io/your-repo-name/`

## Customisation

- Edit `crusade-order.html` to add your players' force cards
- Edit `lore.html` to add your own campaign narrative
- The roster, battle log, and tracker all save data to `localStorage` in the browser

## Credits

Built for the Bastior Sub-Sector Tyrannic War Crusade — 999.M41
*"For the glory of the Emperor and the preservation of Mankind."*
