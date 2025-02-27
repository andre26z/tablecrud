import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	/* config options here */

	// Add transpilePackages to handle the Ant Design modules properly
	transpilePackages: [
		'antd',
		'@ant-design',
		'rc-util',
		'rc-pagination',
		'rc-picker',
		'rc-table',
		'rc-field-form',
		'rc-dropdown',
	],

	// Webpack configuration to potentially handle compatibility issues
	webpack: (config, { isServer }) => {
		// You can add webpack configuration here if needed
		return config;
	},

	// Experimental features if you want to try them
	experimental: {
		// Add any experimental features here if needed
	},
};

export default nextConfig;
