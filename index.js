
const RawSource = require('webpack-sources').RawSource;
const penthouse = require('penthouse');

function PenthousePlugin(options) {
  this.options = options || {};
}

PenthousePlugin.prototype.apply = function (compiler) {

  const self = this;

  // run after bundle compilation as we need the css bundles to be generated first
  // https://webpack.js.org/api/compiler-hooks/#compilation

  compiler.hooks.compilation.tap('PenthousePlugin', (compilation) => {

    // use the additionalAssets hook to add the critcal css file
    // https://webpack.js.org/api/compilation-hooks/#additionalassets

    compilation.hooks.additionalAssets.tapAsync('PenthousePlugin', (callback) => {

      Promise.all( compilation.chunks.map( async (chunk) => {

        // an entry url matching the chunk name is required to continue

        const entryUrl = self.options.entryUrls[chunk.name];
        if (!entryUrl) return;

        // find the css file from the chunk.files array
        const cssFile = chunk.files.filter(file => /.(css)$/.test(file)).shift();

        // if no css file return
        if (!compilation.assets[cssFile] || !compilation.assets[cssFile].source()) {
          console.log(`${entryUrl} no css for ${cssFile} `);
          return;
        }

        try {

          // construct a css string from the common assets passed in the options

          cssCommonString = '';
          for(let commonCss of self.options.commonCss){
            cssCommonString += compilation.assets[commonCss].source();
          }

          // add generic and reset css content
          const cssString = cssCommonString + compilation.assets[cssFile].source();

          // call penthouse with the entry point url and the css source for the entry point

          const criticalCss = await penthouse({
            url: entryUrl,
            cssString: cssString,
            height: self.options.height,
          });

          // create a new .critical.css file containing just the critical css for the entry point

          const criticalFilename = cssFile.replace('.css', '.critical.css');

          // add new css file to the compilation assets

          compilation.assets[criticalFilename] = new RawSource(criticalCss);

          chunk.files.push(criticalFilename);

          console.log(`critical css extracted to ${criticalFilename} for entry point ${entryUrl}`);

        } catch (e) {

          console.log('critical css error:', e);

        }

      })).then(() => callback()).catch(err => callback(err));

    });
  });
};

module.exports = PenthousePlugin;
