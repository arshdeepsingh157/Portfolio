## Packages
(none needed)

## Notes
Uses existing shadcn/ui primitives already in repo (Button, Card, Dialog, Drawer, Tabs, Table, Sidebar, etc.)
Framer Motion is already installed and used for subtle page and widget transitions
All data is fetched from backend APIs defined in @shared/routes (no mock data)
SEO: document.title + meta description are set per page via a tiny hook (no extra deps)
Resume download button is disabled by default (no file provided). If you add /public/resume.pdf later, the button will enable automatically.
