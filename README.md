# Stylish Text Generator

Use the generated text for shit like Instagram where you're not allowed to use markup. Here because (a) I'm too lazy to Google existing ones and (b) I cannot stand the ads and trackers in the modern web app. 

Will do letters and numbers: `abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890`

## Development

Uses ParcelJS.

```bash
# Install dependencies
yarn

# Start live-reloading server
yarn start

# Clean built artifacts
yarn clean

# Build
yarn build

# I do this with
yarn clean
yarn build --public-url https://public.nikhil.io/text-generator
aws s3 sync --delete dist/ s3://public.nikhil.io/text-generator/
```

## Resources

AKA "Where I took all the glyphs from."

* https://lingojam.com/FontsForInstagram
* https://www.fontget.com/instagram-fonts/
* https://instagram-fonts.top/instagram-fonts.php

## License 

[WTFPL](http://www.wtfpl.net/)
