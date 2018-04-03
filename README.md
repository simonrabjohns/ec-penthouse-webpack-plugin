# ec-penthouse-webpack-plugin

[Penthouse](https://github.com/pocketjoso/penthouse) can be used to create critical css files containing just the content required for above the fold content.

To use Penthouse with Webpack a custom plugin is required to hook into the build process and generate additional the bundle assets.

The plugin can be installed with yarn using

```
yarn add git+ssh://git@github.com/tempdev99/ec-penthouse-webpack-plugin.git --dev
``` 

The PenthousePlugin only needs to called for production build so it is only inlcuded in the `webpack.prod.js` config file. 


#####Plugin Arguments #####

`entryUrls` 

An object which maps entry points to a URL that will be analysed to generate the critical css. The keys used must match the name of a valid entry point. 
Once the CSS has been compiled for the entry point Penthouse will analyse the URL and work out which CSS rules are required to render the above the fold content.
These rules will then be written to a new css asset named [chunk].critical.css.

`height`

Height can optionally be passed to restrict the critical css to elements that appear within the portion of the page up to the height specified

If the entire html content fits within the height specified no critical css file is generated.

Example config:
```
new PenthousePlugin({
 entryUrls: {
   app: 'http://boilerplate.local',
   page: 'http://boilerplate.local/critical-css-demo.html',
 },
 height: 200,
}),
```