/**
 * Configuration for head elements added during the creation of index.html.
 *
 * All path attributes are added the publicPath (if exists) by default.
 * You can explicitly hint to prefix a publicPath by setting a boolean value to a key that has
 * the same name as the attribute you want to operate on, but prefix with =
 *
 * Example:
 * { name: 'msapplication-TileImage', content: '/assets/favicon/ms-icon-144x144.png', '=content': true },
 * Will prefix the publicPath to content.
 *
 * { rel: 'apple-touch-icon', sizes: '57x57', path: '/assets/favicon/apple-icon-57x57.png', '=path': false },
 * Will not prefix the publicPath on path (path attributes are added by default
 *
 */
module.exports = {
  links: [
    /**
     * <link> tags for 'apple-touch-icon' (AKA Web Clips).
     */
    {
      rel: "apple-touch-icon",
      sizes: "57x57",
      path: "/assets/favicon/apple-icon-57x57.png",
    },
    {
      rel: "apple-touch-icon",
      sizes: "60x60",
      path: "/assets/favicon/apple-icon-60x60.png",
    },
    {
      rel: "apple-touch-icon",
      sizes: "72x72",
      path: "/assets/favicon/apple-icon-72x72.png",
    },
    {
      rel: "apple-touch-icon",
      sizes: "76x76",
      path: "/assets/favicon/apple-icon-76x76.png",
    },
    {
      rel: "apple-touch-icon",
      sizes: "114x114",
      path: "/assets/favicon/apple-icon-114x114.png",
    },
    {
      rel: "apple-touch-icon",
      sizes: "120x120",
      path: "/assets/favicon/apple-icon-120x120.png",
    },
    {
      rel: "apple-touch-icon",
      sizes: "144x144",
      path: "/assets/favicon/apple-icon-144x144.png",
    },
    {
      rel: "apple-touch-icon",
      sizes: "152x152",
      path: "/assets/favicon/apple-icon-152x152.png",
    },
    {
      rel: "apple-touch-icon",
      sizes: "180x180",
      path: "/assets/favicon/apple-icon-180x180.png",
    },

    /**
     * <link> tags for android web app icons
     */
    {
      rel: "icon",
      type: "image/png",
      sizes: "192x192",
      path: "/assets/favicon/android-icon-192x192.png",
    },

    /**
     * <link> tags for favicons
     */
    {
      rel: "icon",
      type: "image/png",
      sizes: "32x32",
      path: "/assets/favicon/favicon-32x32.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "96x96",
      path: "/assets/favicon/favicon-96x96.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "16x16",
      path: "/assets/favicon/favicon-16x16.png",
    },

    /**
     * <link> tags for a Web App Manifest
     */
    //{ rel: "manifest", path: "/assets/manifest.json" },
  ],
  // metas: [
  //   { name: "msapplication-TileColor", content: "#00bcd4" },
  //   {
  //     name: "msapplication-TileImage",
  //     content: "/assets/favicon/ms-icon-144x144.png",
  //     "=content": true,
  //   },
  //   { name: "theme-color", content: "#00bcd4" },
  // ],
};
