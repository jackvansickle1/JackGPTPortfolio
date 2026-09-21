export const projectCategories = {
  all: "All projects",
  ai: "AI and creative tools",
  finance: "Finance and automation",
  infrastructure: "Infrastructure",
  games: "Games",
};

const categoryIds = {
  ai: ["jackgpt", "automatic1111", "jackgpt-search"],
  finance: ["market-desk", "kalshi-temperature-bot", "moomoo-paper-trader", "kalshi-btc-bot", "ninjatrader-bot"],
  infrastructure: ["ops-control-room", "pearl-desk", "meshcentral", "salad-compute-node"],
  games: ["casino"],
};

export function filterProjects(projects, query, category) {
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  return projects.filter((project) => {
    if (category !== "all" && !categoryIds[category]?.includes(project.id)) return false;
    const text = [project.name, project.subtitle, project.summary, ...project.tags, ...project.tech].join(" ").toLowerCase();
    return terms.every((term) => text.includes(term));
  });
}

export function publicServices(links) {
  return links
    .filter((link) => ["public", "signup", "featured"].includes(link.accessTone))
    .sort((left, right) => {
      const rank = (link) => link.accessTone === "featured" ? -1 : new URL(link.href).hostname === "casino.jackgpt.org" ? 1 : 0;
      return rank(left) - rank(right);
    });
}
