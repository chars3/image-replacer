# Image Replacer 

A WordPress plugin that allows users to easily find and replace images across posts.

## Description

Image Replacer is a powerful tool designed to help WordPress content managers and editors efficiently manage images across their website. With a modern React-based interface, the plugin makes it straightforward to locate posts containing images and replace them with new ones without having to edit each post individually.

## Features

- **Visual Image Management**: Browse through all images in your posts with a clean, intuitive interface
- **Quick Image Replacement**: Replace images with new ones from your Media Library or via direct URL
- **Real-time Preview**: See how the new image will look before confirming the replacement
- **Post Navigation**: Easily navigate between posts containing images
- **WordPress Media Library Integration**: Seamlessly select replacement images from your existing media library

## Technical Details

The plugin is built with:
- WordPress Plugin API for backend integration
- React for the admin interface
- TypeScript for type safety
- React Query for state management and API calls
- Tailwind CSS for styling
- Vite for modern build tooling
- Vitest for testing

## Installation

### Option 1: Install from GitHub Releases (Recommended)
1. Download the latest release ZIP file from the [Releases page](https://github.com/chars3/image-replacer/releases)
2. In your WordPress admin, go to Plugins > Add New > Upload Plugin
3. Choose the downloaded ZIP file and click "Install Now"
4. Activate the plugin through the 'Plugins' menu in WordPress
5. Navigate to 'Tools > Image Replacer' to start managing your images

### Option 2: Manual Installation
1. Download and unzip the plugin files
2. Upload the `image-replacer` folder to the `/wp-content/plugins/` directory on your server
3. Activate the plugin through the 'Plugins' menu in WordPress
4. Navigate to 'Tools > Image Replacer' to start managing your images

## Usage

1. After installation, go to "Tools" > "Image Replacer" in your WordPress admin menu
2. The plugin will display all posts containing images
3. Click on any image thumbnail to select it for replacement
4. Choose a new image from your Media Library or enter a direct URL
5. Preview the change and click "Replace" to update the image across your content

## Requirements

- WordPress 5.9 or higher
- PHP 7.4 or higher

## Development

### Setting up the development environment

1. Clone the repository
2. Navigate to the admin/js directory
3. Install JavaScript dependencies: `npm install`
4. Start the development build: `npm run dev`

### Building for production

```bash
# Navigate to the admin/js directory
cd admin/js

# Build the production version
npm run build
```

### Release Process

This project uses GitHub Actions to automate the build and release process:

1. Update the version number in `image-replacer.php` in the plugin header
2. Commit your changes and push to GitHub
3. Create and push a new tag with the version number:
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```
4. GitHub Actions will automatically:
   - Build the JavaScript assets
   - Create a ZIP file with all necessary files
   - Create a new GitHub Release with the ZIP attached

The resulting ZIP file will be available on the [Releases page](https://github.com/chars3/image-replacer/releases) and ready for installation in WordPress.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the GPL v2 or later.

## Support

For support questions, please open an issue on the GitHub repository or contact the plugin author.

## Acknowledgements

- Built with the [WordPress Plugin Boilerplate](https://github.com/DevinVinson/WordPress-Plugin-Boilerplate)
- Uses modern JavaScript tooling for an optimal development experience