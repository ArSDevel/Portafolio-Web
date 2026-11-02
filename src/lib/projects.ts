import {
  getBuildingProjects,
  getModelingProjects,
  getScriptingProjects,
  type Area,
} from "./content";

const loaders = {
  modeling: getModelingProjects,
  building: getBuildingProjects,
  scripting: getScriptingProjects,
} as const;

/** Card-level data for any area (fields every project type shares). */
export async function getProjectsByArea(area: Area) {
  const items = await loaders[area]();
  return items.map(({ slug, entry }) => ({ area, slug, entry }));
}

/** Featured projects across all areas, newest first. */
export async function getFeaturedProjects(limit = 6) {
  const all = (
    await Promise.all((Object.keys(loaders) as Area[]).map(getProjectsByArea))
  ).flat();
  return all
    .filter((p) => p.entry.featured)
    .sort((a, b) => (b.entry.date ?? "").localeCompare(a.entry.date ?? ""))
    .slice(0, limit);
}

/**
 * Params for a project route. Cache Components fails the build on an empty list,
 * so when an area has no projects yet we emit a placeholder slug that 404s.
 */
export async function staticSlugs(area: Area) {
  const items = await loaders[area]();
  return items.length > 0 ? items.map(({ slug }) => ({ slug })) : [{ slug: "_" }];
}

export async function getProjectCounts(): Promise<Record<Area, number>> {
  const [modeling, building, scripting] = await Promise.all([
    getModelingProjects(),
    getBuildingProjects(),
    getScriptingProjects(),
  ]);
  return { modeling: modeling.length, building: building.length, scripting: scripting.length };
}
