import { collection, config, fields, singleton } from "@keystatic/core";

/*
 * Content model for the portfolio.
 * GitHub mode whenever NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO ("owner/repo") is set
 * (on Vercel, or locally to run Keystatic's GitHub App setup), so only accounts
 * with write access to the repo can save changes. Without it: local files.
 */
const repo = process.env.NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO as
  | `${string}/${string}`
  | undefined;

const storage = repo
  ? ({ kind: "github", repo } as const)
  : ({ kind: "local" } as const);

const localized = (label: string, multiline = false) =>
  fields.object(
    {
      es: fields.text({ label: `${label} (Español)`, multiline }),
      en: fields.text({ label: `${label} (English)`, multiline }),
    },
    { label, layout: [6, 6] },
  );

const image = (folder: string, label: string) =>
  fields.image({
    label,
    directory: `public/content/${folder}`,
    publicPath: `/content/${folder}/`,
  });

// Fields every project type shares.
const base = (folder: string) => ({
  title: fields.slug({
    name: { label: "Título (Español)", validation: { isRequired: true } },
    slug: { label: "URL", description: "Se genera solo a partir del título." },
  }),
  titleEn: fields.text({ label: "Título (English)" }),
  summary: localized("Resumen corto"),
  description: localized("Descripción", true),
  cover: fields.image({
    label: "Imagen de portada",
    directory: `public/content/${folder}`,
    publicPath: `/content/${folder}/`,
    validation: { isRequired: true },
  }),
  gallery: fields.array(
    fields.object({
      image: image(folder, "Imagen"),
      caption: localized("Pie de foto"),
    }),
    {
      label: "Galería",
      itemLabel: (props) => props.fields.caption.fields.es.value || "Imagen",
    },
  ),
  tags: fields.array(fields.text({ label: "Etiqueta" }), {
    label: "Etiquetas",
    itemLabel: (props) => props.value,
  }),
  date: fields.date({ label: "Fecha", validation: { isRequired: true } }),
  featured: fields.checkbox({
    label: "Destacado",
    description: "Aparece en la página de inicio.",
  }),
});

const scriptKinds = [
  { label: "Script (servidor)", value: "Script" },
  { label: "LocalScript (cliente)", value: "LocalScript" },
  { label: "ModuleScript", value: "ModuleScript" },
] as const;

const scriptLocations = [
  "ServerScriptService",
  "ServerStorage",
  "ReplicatedStorage",
  "ReplicatedFirst",
  "StarterPlayerScripts",
  "StarterCharacterScripts",
  "StarterGui",
  "Workspace",
].map((value) => ({ label: value, value }));

export default config({
  storage,
  ui: {
    brand: { name: "Ath · Portafolio" },
    navigation: {
      Proyectos: ["modeling", "building", "scripting"],
      Perfil: ["profile"],
    },
  },
  collections: {
    modeling: collection({
      label: "Modelado 3D",
      slugField: "title",
      path: "content/modeling/*",
      columns: ["title", "date"],
      schema: {
        ...base("modeling"),
        model: fields.file({
          label: "Modelo 3D (.glb)",
          description: "Exporta desde Blender: File → Export → glTF 2.0 (.glb).",
          directory: "public/content/modeling",
          publicPath: "/content/modeling/",
        }),
        textures: fields.text({
          label: "Texturas",
          description: "Ej.: 1024×1024 · 2 materiales",
        }),
        software: fields.text({ label: "Software", defaultValue: "Blender" }),
        mobileOptimized: fields.checkbox({
          label: "Optimizado para móvil",
          defaultValue: true,
        }),
        before: image("modeling", "Antes (blockout o wireframe)"),
        after: image("modeling", "Después (render final)"),
      },
    }),

    building: collection({
      label: "Building",
      slugField: "title",
      path: "content/building/*",
      columns: ["title", "date"],
      schema: {
        ...base("building"),
        placeId: fields.text({
          label: "Place ID de Roblox",
          description:
            "El número en la URL de la experiencia (roblox.com/games/ESTE_NÚMERO/...). Muestra visitas y jugadores en vivo.",
        }),
        experienceUrl: fields.url({ label: "Enlace a la experiencia" }),
        video: fields.url({ label: "Video (YouTube)" }),
      },
    }),

    scripting: collection({
      label: "Scripting",
      slugField: "title",
      path: "content/scripting/*",
      columns: ["title", "date"],
      schema: {
        ...base("scripting"),
        scripts: fields.array(
          fields.object({
            name: fields.text({
              label: "Nombre del script",
              validation: { isRequired: true },
            }),
            kind: fields.select({
              label: "Tipo",
              options: scriptKinds,
              defaultValue: "Script",
            }),
            location: fields.select({
              label: "Ubicación",
              options: scriptLocations,
              defaultValue: "ServerScriptService",
            }),
            code: fields.text({ label: "Código (Luau)", multiline: true }),
            highlight: fields.text({
              label: "Líneas a resaltar",
              description: "Ej.: 3-5, 12",
            }),
          }),
          {
            label: "Scripts",
            itemLabel: (props) =>
              `${props.fields.location.value} / ${props.fields.name.value || "Script"}`,
          },
        ),
        repoUrl: fields.url({ label: "Repositorio (opcional)" }),
        video: fields.url({ label: "Video del sistema funcionando (YouTube)" }),
      },
    }),
  },

  singletons: {
    profile: singleton({
      label: "Perfil y contacto",
      path: "content/profile",
      schema: {
        available: fields.checkbox({
          label: "Disponible para proyectos",
          defaultValue: true,
        }),
        about: localized("Sobre mí", true),
        location: fields.text({ label: "Ubicación / zona horaria" }),
        discord: fields.text({ label: "Usuario de Discord" }),
        roblox: fields.url({ label: "Perfil de Roblox" }),
        talentHub: fields.url({ label: "Roblox Talent Hub" }),
        devforum: fields.url({ label: "DevForum" }),
        twitter: fields.url({ label: "X / Twitter" }),
        youtube: fields.url({ label: "YouTube" }),
        email: fields.text({ label: "Correo" }),
      },
    }),
  },
});
