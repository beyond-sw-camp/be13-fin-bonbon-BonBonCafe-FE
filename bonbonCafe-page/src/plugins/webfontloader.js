import WebFontLoader from 'webfontloader';

const loadFonts = () => {
  WebFontLoader.load({
    google: {
      families: ['Roboto:300,400,500,700&display=swap'],
    },
  });
};

export { loadFonts };
