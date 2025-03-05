# Developing iTwin CLI plugin

## Plugins creation
To generate a new plugin that will be used in the itwin-cli , you need to start with the fresh project and execute:
```
// Install oclif package
npm install -g oclif

// Start oclif project wizard
npx oclif generate <new plugin name> 
```
This will provide you with configuration wizard. All the options are free to choose, except "Module type" must be "CommonJS". This is to match `iTwin CLI`

Starting from this, you can use implement any type of command you want, while also calling commands that are already available in the original `iTwin CLI`, just make sure that the commands do not have overlapping naming

You can develop the plugin as a stand-alone command line interface or you can use the existing commands in the `iTwin CLI`. 
Most of the documantation around the oclif framework development can be found here [oclif docs](https://oclif.io/docs/features)

## Plugin installation

### NPM package
To install a plugin you need to execute this command

```
itp plugins install <npm package name>
```
Example:
```
itp plugins install @oclif/plugin-not-found
```

### Local file
If the plugin is not yet published to npm, you can link to your local storage with this command

```
itp plugins link <plugin path>
```

Example:

```
itp plugins link C:/Development/export-plugin/
```

Make sure the directory is pointing to the root folder of `package.json`

More in depth information about plugins could be found here : [oclif plugin-plugins](https://github.com/oclif/plugin-plugins)