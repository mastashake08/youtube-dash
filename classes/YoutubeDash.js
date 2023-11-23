import { MPD } from '@mastashake08/dash-manifest-creator'
class YoutubeDash {
  startNumber;
  livestream;
  constructor (token) {
    this.token = token
    this.broadcasts = []
    this.baseUrl = 'https://upload.youtube.com/dash_upload'
    this.startNumber = 1
    this.bind = {}
    this.broadcast = {}
    this.livestream = {}
  }
  gup(url, name) {
  name = name.replace(/[/,"\\").replace(/[\]]/,"\\");
  var regexS = "[\\#&]"+name+"=([^&#]*)";
            var regex = new RegExp( regexS );
            var results = regex.exec( url );
            if( results == null )
                return "";
            else
                return results[1];
        }
  async uploadVideo (blob) {
    console.log(blob)
    let data = new FormData()
    let resData = {
        title: 'Screen Recorder Pro Recording - ' + new Date(),
        description: 'This screen recording was created with Screen Recorder Pro https://recorder.jcompsolu.com',
        categoryId: '28'
    }
    data.append('snippet', JSON.stringify(resData))
    //data.append('filename', blob)
    const req = await this.makeRequest('https://youtube.googleapis.com/youtube/v3/videos?part=snippet,id', 'POST', data)
    console.log(req.json())
  }
  //

  async createNewLiveStream (title = "Getting Started With Screen Recorder") {
    try {

      let data = {
        "snippet": {
          "title": title
        },
        "cdn": {
          "frameRate": "variable",
          "ingestionType": "dash",
          "resolution": "variable"
        }
      }
      const headers = {
        Authorization: `Bearer ${this.token}`
      }
      const broadCastTitle = prompt('Give your broadcast a title!')
      this.broadcast = await this.createBroadcast(broadCastTitle)
      this.livestream = await this.makeRequest('https://www.googleapis.com/youtube/v3/liveStreams?part=cdn&part=snippet', 'POST', JSON.stringify(data), headers)
      this.bind = await this.bindBroadCast(this.broadcast.id, this.livestream.id)
      sessionStorage.setItem("cid", this.livestream.cdn.ingestionInfo.ingestionAddress)
      return this.livestream.cdn.ingestionInfo.ingestionAddress
    } catch (e) {
      console.log(e)
    }
  }
  async getBroadcasts () {
    try {
      const res = await fetch('https://www.googleapis.com/youtube/v3/liveBroadcasts?broadcastStatus=all', {
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      })
      const results = await res.json()
      this.broadcasts = results.items
      return results.items
    } catch (e) {
      console.log(e)
    }
  }
  async createBroadcast (title) {
    try {

      let data = {
        "snippet": {
          "scheduledStartTime": new Date(Date.now()).toISOString(),
          "title": title
        },
        "contentDetails": {
          "enableDvr": true,
          "enableAutoStart": true,
          "enableAutoStop": true,
          "recordFromStart": true
        },
        "status": {
          "privacyStatus": "unlisted",
          "selfDeclaredMadeForKids": false
        }
      }
      const headers = {
        Authorization: `Bearer ${this.token}`
      }
      const res = await this.makeRequest('https://youtube.googleapis.com/youtube/v3/liveBroadcasts?part=contentDetails&part=snippet&part=status','POST', JSON.stringify(data), headers)
    return res
    } catch (e) {
      console.log(e)
    }
  }
  async bindBroadCast (broadcastId, streamId) {
    const url = `https://www.googleapis.com/youtube/v3/liveBroadcasts/bind?id=${broadcastId}&part=snippet&streamId=${streamId}`
    try {
      const headers = {
        Authorization: `Bearer ${this.token}`
      }
      const res = await this.makeRequest(url, 'POST', JSON.stringify({}), headers)
      return res
    } catch (e) {
      console.log(e)
    }
  }
  async endBroadcast() {}
  async makeRequest(url, method, data, headers ) {
    try {
      const res = await fetch(url, {
        method: method, // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache',
        headers: headers,
        body: data
      })
      const ret = await res.json()
      return ret
    } catch (e) {
      console.log(e.message)
    }

  }

  uploadStream() {
    return new TransformStream({
      transform(chunk, controller) {
        const file = new File([chunk], "file.webm")
        this.uploadDashData(file)
        controller.enqueue(chunk);
      },
    });
  }
  
  async uploadDashData (data) {
    const url = sessionStorage.cid+data.name
    const formData  = new FormData()
    formData.append('file', data)
    //formData.append('url', url)

    const headers = {
      Authorization: `Bearer ${this.token}`
    }
    //await this.makeRequest('https://screen-recorder-micro.jcompsolu.com/api/stream-to-youtube', 'POST', formData, headers)
    await this.makeRequest(url, 'PUT', headers)
  }
  async createDashManifest(initVideo, filename, cid) {
    if(this.startNumber === 1) {
      console.log('CID', cid)
      const url = `${cid}media-$Number%09d$.webm`
      const mpd = new MPD(null, document.implementation.createDocument("", "", null))
      mpd.createMpd(initVideo, url, this.startNumber)

      const upload = mpd.getBlob()
      mpd.downloadXML()
      this.uploadDashData(filename,upload)

    } else {
      this.uploadDashData(`media00${this.startNumber-1}.webm`,initVideo)
    }
    this.startNumber = this.startNumber + 1
  }
}

export {
  YoutubeDash
}