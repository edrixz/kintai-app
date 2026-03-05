/**
 * Global application configuration.
 * Defines the default UI styling for Nuxt UI components.
 */
export default defineAppConfig({
  ui: {
    primary: "sky",
    gray: "slate",
    button: {
      defaultVariants: {
        size: "md" as const,
      },
    },
    card: {
      slots: {
        root: "rounded-xl shadow-sm",
      },
    },
  },
});
