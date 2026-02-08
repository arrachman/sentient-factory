# Sentient Factory Documentation

This is the documentation website for **Sentient Factory** - an intelligent manufacturing platform. Built with [Docusaurus](https://docusaurus.io/), a modern static website generator.

## About Sentient Factory

Sentient Factory is an AI-powered manufacturing platform that enables:
- Real-time production monitoring
- Predictive maintenance
- Automated quality control
- Supply chain optimization

## Development

### Installation

```bash
npm install
```

### Local Development

```bash
npm start
```

This command starts a local development server at `http://localhost:3000`. Most changes are reflected live without having to restart the server.

### Build

```bash
npm run build
```

This command generates static content into the `build` directory for production deployment.

## Documentation Structure

- **Getting Started**: Introduction and quick start guide
- **Architecture**: System design and deployment guides
- **API Reference**: Complete API documentation
- **Contributing**: Guidelines for contributors

## Deployment

### GitHub Pages

Using SSH:
```bash
USE_SSH=true npm run deploy
```

Not using SSH:
```bash
GIT_USER=<Your GitHub username> npm run deploy
```

### Other Hosting Options

- **Vercel**: `vercel --prod`
- **Netlify**: `netlify deploy --prod`
- **AWS S3**: Upload `build` directory to S3 bucket
- **Docker**: Build and run as container

## Contributing

See [Contributing Guide](/docs/contributing) for details on how to contribute to the documentation.

## License

This documentation is licensed under the MIT License.
