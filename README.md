# ec-penthouse-webpack-plugin

[Penthouse](https://github.com/pocketjoso/penthouse) can be used to create critical css files containing just the content required for above the fold content.

To use Penthouse with Webpack a custom plugin is required to hook into the build process and generate additional the bundle assets.

The plugin can be installed with yarn using

```
yarn add git+ssh://git@github.com/tempdev99/ec-penthouse-webpack-plugin.git --dev
``` 

The PenthousePlugin only needs to called for production build so it is only inlcuded in the `webpack.prod.js` config file. 


#####Plugin Arguments #####

`commonCss`

An array of paths to css files that should be considered when generating the critical css in a addition to the entry point chunk.
This can be useful when the commonsChunk plugin removes modules from teh entry point but you still want them to be included in the critical css.

`entryUrls` 

An object which maps entry points to a URL that will be analysed to generate the critical css. The keys used must match the name of a valid entry point. 
Once the CSS has been compiled for the entry point Penthouse will analyse the URL and work out which CSS rules are required to render the above the fold content.
These rules will then be written to a new css asset named [chunk].critical.css.

`height and width`

Height and width values override the default 1300 x 900 viewport and restrict the critical css to elements that appear within the portion of the page up to the sizes specified

If the entire html content fits within the size specified no critical css file is generated.

`keepLargerMediaQueries`

By default Penthouse will exclude media queries that do not apply within the defined height and width. Setting this to true will include all media queries related to the elements within the critical viewport.

Example config:
```
new PenthousePlugin({
commonCss: [
        'resources/stylesheets/reset.bundle.css',
        'resources/stylesheets/commons.bundle.css',
      ],
 entryUrls: {
   app: 'http://boilerplate.local',
   page: 'http://boilerplate.local/critical-css-demo.html',
 },
 height: 600,
 width: 1440,
 keepLargerMediaQueries: true,
}),
```

#### Why do I not see a .critical.css file generated for my entry point? ####

If you use the commonsChunkPlugin with a low minChunks setting you may find all the scss modules in your entry point have been extracted to a commons css file. 

If this is the case the css file that Penthouse would have used to generate the critical.css will not exist so no file will be created. 

Including the commons css file in the commonCss array should resolve this.