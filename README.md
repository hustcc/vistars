# vistars

SVG-based data visualization style avatars from any username and color palette. Works in both browsers and Node.js.

## Install

```
npm install vistars
```

## Usage

```ts
import vistars from 'vistars';

const svg = vistars({ name: 'Alice Johnson', variant: 'bar' });

// Use in browser
document.getElementById('avatar').innerHTML = svg;

// Use in Node.js server-side rendering
fs.writeFileSync('avatar.svg', svg);
```

## CDN / Script Tag Usage

```html
<script src="https://unpkg.com/vistars/dist/index.umd.js"></script>
<script>
  const svg = Vistars.vistars({ name: 'Alice Johnson', variant: 'donut' });
  document.getElementById('avatar').innerHTML = svg;
</script>
```

## Props

| Prop      | Type                                                         | Default     |
|-----------|--------------------------------------------------------------|-------------|
| name      | string                                                       | `Clara Barton` |
| variant   | `bar` \| `donut` \| `radar` \| `line` \| `heatmap` \| `treemap` \| `boxplot` \| `pie` \| `area` \| `column` \| `scatter` \| `funnel` \| `liquid` \| `venn` | `bar` |
| colors    | string[]                                                     | `['#3b82f6', '#06b6d4', '#8b5cf6', '#f59e0b', '#ec4899']` |
| size      | number \| string                                             | `40`        |
| square    | boolean                                                      | `false`     |
| light     | boolean                                                      | `false`     |

## License

MIT
