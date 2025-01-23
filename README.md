# a simple script to fetch appstore reviews

Hi! I have built multiple apps and always wondered if it would be possible to embed the reviews I get for my apps on my landing page. Initially I would copy/paste the reviews into the page but I wanted a cleaner solution. This is how this script was born. It is a simple code that fetches the reviews from the App Store and adds them to your website. All you have to do is to add the following div to the place you would like to display the reviews:

	<div id="app-reviews-widget" data-app-id="6445867241" data-country="us" data-count="4" data-see-more="false" data-app-store-url="https://apps.apple.com/app/id6445867241"></div>


## how does it work?

the script searches for a div with the id **"app-reviews-widget"** and reads its data attributes to display the results. following attributes are possible:

|                     |description                                     |example        |
|---------------------|------------------------------------------------|---------------|
|data-app-id.         |the apps id used by apple to identify your app  |`6445867241`   |
|data-country         |country code to filter out results              |`us`           |
|data-count           |amount of review to display                     |`5`            |
|data-see-more        |displays link to your apps page in App Store    |`false`        |
|data-app-store-url   |App Store link to your app                      |`false`        |

thats how simple it is to use. I have hosted a version with a configurator on https://sugarit.web.app you can check it out there and use it from there.
