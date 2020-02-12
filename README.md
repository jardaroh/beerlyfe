# BeerLyfe (beerlyfe)

A Quasar Framework app

## Open in browser from disk
The application works standalone as a static site loaded from your local disk.
Just open a new tab and `CTRL+O` to open.

## Install the dependencies
```bash
npm install
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)
```bash
quasar dev
```

### Lint the files
```bash
npm run lint
```

### Build the app for production
```bash
quasar build
```

### Customize the configuration
See [Configuring quasar.conf.js](https://quasar.dev/quasar-cli/quasar-conf-js).


### NOTES
I took to heart that this task was a frontend development task and not a UX / design task.
However I did try to at least have it look clean, if not customizing the look and feel of
material design of the quasar components.

I chose the following technologies
* Vue
* Vuex
* Vuex ORM
* Quasar framework
  * and accompanying quasar components
* uuid v4 for pseudo unique IDs

I chose to use Quasar because it is a framework that has worked splendidly for me and one I take
every opportunity to explore further.

Vuex ORM was chosen because of the simplicity of state management.

The application is only tested using Chromium based browsers and V8 JS engine.

#### Flaws
QEditor component is throwing exceptions when used in a popup edit and the user made any changes.
It is unfortunate, however, it does not stop the application from working properly.

#### Stolen code
Using Quasar there is naturally a bit of markup that is taken from the documentation pages for
the various components. However, this is the only "stolen" code the way I see it :)
