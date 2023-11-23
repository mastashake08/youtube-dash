# youtube-dash

[![NPM](https://nodei.co/npm/@mastashake08/youtube-dash.png)](https://nodei.co/npm/@mastashake08/youtube-dash/)

[![NPM version](https://img.shields.io/npm/v/@mastashake08/youtube-dash.svg)](https://www.npmjs.com/package/@mastashake08/youtube-dash)
[![Build Status](https://travis-ci.org/mastashake08/youtube-dash.svg?branch=master)](https://travis-ci.org/mastashake08/youtube-dash)
[![Coverage Status](https://coveralls.io/repos/github/mastashake08/youtube-dash/badge.svg?branch=master)](https://coveralls.io/github/mastashake08/youtube-dash?branch=master)

NPM package for managing broadcasts and livestreaming from the browser using the Youtube Livestreaming API via DASH. Created and maintained by [Jyrone Parker](https://jyroneparker.com)

## Installation

Clone repository with Git:

```sh
git clone https://github.com/mastashake08/youtube-dash.git
cd youtube-dash
```

Use via NPM
```sh
npm i @mastashake08/youtube-dash
```

## Usage

Import the package in your Javascript application.

```javascript
import { YoutubeDash } from '@mastashake08/youtube-dash'

const yt = new YoutubeDash(api_token)

const title = "Getting Started With Screen Recorder"
yt.createNewLiveStream(title)

//readable video stream
readable.pipeThru(yt.uploadStream()).pipeTo(writable)
```


## Release

Only collaborators with credentials can release and publish:

```sh
npm run release
git push --follow-tags && npm publish
```

To see what files are going to be published, run the command:

```sh
npm pack --dry-run
# tar tvf $(npm pack)
```

## Support

- [Patreon](https://patreon.com/mastashake08)

## License

[MIT](https://github.com/mastashake08/youtube-dash/blob/master/LICENSE)
