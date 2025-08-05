# Socky CDN Files

This directory contains CDN-ready builds of Socky.js for use with jsDelivr.

## Usage

### Via jsDelivr CDN

**Latest version:**
```html
<!-- Minified -->
<script src="https://cdn.jsdelivr.net/gh/bilte-co/socky-js@release/cdn/latest/socky.min.js"></script>

<!-- Unminified -->
<script src="https://cdn.jsdelivr.net/gh/bilte-co/socky-js@release/cdn/latest/socky.js"></script>

<!-- ES Module -->
<script type="module">
  import { Socky } from 'https://cdn.jsdelivr.net/gh/bilte-co/socky-js@release/cdn/latest/socky.esm.js';
</script>
```

**Specific version (v0.2.5):**
```html
<!-- Minified -->
<script src="https://cdn.jsdelivr.net/gh/bilte-co/socky-js@release/cdn/v0.2.5/socky.min.js"></script>

<!-- Unminified -->
<script src="https://cdn.jsdelivr.net/gh/bilte-co/socky-js@release/cdn/v0.2.5/socky.js"></script>

<!-- ES Module -->
<script type="module">
  import { Socky } from 'https://cdn.jsdelivr.net/gh/bilte-co/socky-js@release/cdn/v0.2.5/socky.esm.js';
</script>
```

### Usage Example

```html
<script src="https://cdn.jsdelivr.net/gh/bilte-co/socky-js@release/cdn/latest/socky.min.js"></script>
<script>
  const socky = new Socky({
    apiKey: 'your-api-key'
  });

  // Use the API
  socky.locations.search('NYC').then(console.log);
</script>
```
