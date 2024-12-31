# Cachetur assistant 2

This is a complete re-write of original [https://github.com/cachetur-no/cachetur-assistant](https://github.com/cachetur-no/cachetur-assistant)

This is a user-script, it modifies other websites. Errors may occur, especially after changes on geocaching.com. You assume all risks when using this script This script makes it easy to add caches to your trips. You can add caches directly from the map on geocaching.com, and from maps on project-gc.com.

The script is tested on the newest version of Tampermonkey and Vivaldi (Chromium based browser). The Cachetur Assistant should also work in other browsers TamperMonkey support (Edge, Opera Next, Dolphin and UC), but this is not tested.

This script will only work if you select Leaflet as your map provider on geocaching.com.

Due to potential security issues, script was splitted into two parts:
- [https://github.com/MakroCZ/cachetur-assistant-2](https://github.com/MakroCZ/cachetur-assistant-2) (`main part`)
  - Responsible for communication with Cachetur servers
  - Modify DOM elements
  - Communication with `map connector`
- [https://github.com/MakroCZ/cachetur-assistant-2-map-connector](https://github.com/MakroCZ/cachetur-assistant-2-map-connector) (`map connector`)
  - Responsible for showing data on map received from `main part`

For all functionality you have to install **both** scripts


## Installation

To install the script, open `userscripts` folder, click the `cacheturassistant2.prod.user.js` in GitHub and then click the **`Raw`** button. Your userscript manager should automatically give you the option to install the script. Alternatively, you can just follow the link below:
**[»» Install Cachetur assistant 2 ««](https://github.com/MakroCZ/cachetur-assistant-2/raw/main/userscripts/cacheturassistant2.prod.user.js)**

## Built using userscript-typescript-template
[https://github.com/pboymt/userscript-typescript-template](https://github.com/pboymt/userscript-typescript-template)

Without this template this script probably wouldn't exists, at least not in this shape. Thanks