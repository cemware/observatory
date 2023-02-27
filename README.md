Observatory
=================================
# Description
**[Observatory](https://observatory.cemware.com)** is the space observation application with blockcoding. You can create various contents with this app. And you can change the observation time and location. It was developed based on [Stellarium Web Engine](https://github.com/Stellarium/stellarium-web-engine).

# Open with query options
ex) https://observatory.cemware.com?noHeader=true&lang=en
* noHeader: 'true' | 'false' (default 'false')
* lang: 'ko' | 'en' (default 'ko')


# Data exchange
### Post data to other windows
```javascript
/* preadd message event listener */
window.addEventListener('message', (event) => {
  if (typeof event.data === 'object' && event.data.type === 'save-skydata') {
    console.log(e.data.data); // blob data
  }
});

const newWindow = window.open('https://observatory.cemware.com', '_blank');
newWindow.postMessage({
  type: 'save',
  origin: window.location.origin,
}, 'https://observatory.cemware.com');
```

### Load data from other windows
```javascript
newWindow.postMessage({
  type: 'load',
  blob: blob, // blob data
  title: 'myTitle.obs',
}, 'https://observatory.cemware.com');
```