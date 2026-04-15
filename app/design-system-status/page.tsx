"use client";

import React from "react";

const DesignSystemStatus = () => {
  const integrationStatus = {
    themeProvider: {
      status: "✅ Integrated",
      description: "ThemeProvider added to app layout",
      location: "app/layout.tsx",
    },
    loadingComponents: {
      status: "✅ Integrated",
      description: "LoadingDots component updated with new spinner",
      location: "components/loading-dots.tsx",
    },
    themeSwitcher: {
      status: "⚠️ Partially Integrated",
      description: "ThemeSwitcher component created but not fully connected",
      location: "components/design-system/theme-switcher.tsx",
    },
    designSystemFiles: {
      status: "✅ Created",
      description: "Complete design system structure implemented",
      location: "src/design-system/",
    },
    configuration: {
      status: "✅ Created",
      description: "Theme configuration files ready",
      location: "config/design-system/",
    },
    styles: {
      status: "✅ Added",
      description: "Design system styles added to globals.css",
      location: "app/globals.css",
    },
  };

  const availableComponents = [
    "Spinner (multiple sizes and colors)",
    "Skeleton loaders (text, card, list, table)",
    "Progress bars (linear and circular)",
    "Fade animations",
    "Theme provider with context",
    "Design tokens (colors, typography, spacing, animations)",
  ];

  const nextSteps = [
    "Connect ThemeSwitcher to actual theme system",
    "Replace existing loading states with design system components",
    "Add design system components to product pages",
    "Implement theme persistence",
    "Add more animation components",
    "Create design system documentation page",
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Design System Integration Status
          </h1>
          <p className="text-lg text-gray-600">
            Current state of the modular design system integration
          </p>
        </div>

        {/* Integration Status */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6">Integration Status</h2>
          <div className="space-y-4">
            {Object.entries(integrationStatus).map(([key, item]) => (
              <div
                key={key}
                className="border-b border-gray-200 pb-4 last:border-0"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold capitalize">
                      {key.replace(/([A-Z])/g, " $1")}
                    </h3>
                    <p className="text-gray-600">{item.description}</p>
                    <p className="text-sm text-gray-500">
                      Location: {item.location}
                    </p>
                  </div>
                  <div className="text-lg">{item.status}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Available Components */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6">
            Available Design System Components
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availableComponents.map((component, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-700">{component}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6">Next Steps</h2>
          <div className="space-y-3">
            {nextSteps.map((step, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold mt-0.5">
                  {index + 1}
                </div>
                <span className="text-gray-700">{step}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Demo Links */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-6">Demo & Documentation</h2>
          <div className="space-y-4">
            <div>
              <a
                href="/design-system-demo"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                🎨 Design System Demo Page
              </a>
              <p className="text-gray-600 text-sm mt-1">
                Interactive demo of design system components
              </p>
            </div>
            <div>
              <a
                href="/DESIGN_SYSTEM.md"
                className="text-blue-600 hover:text-blue-800 underline"
                target="_blank"
              >
                📚 Design System Documentation
              </a>
              <p className="text-gray-600 text-sm mt-1">
                Complete documentation and usage guide
              </p>
            </div>
          </div>
        </div>

        {/* Usage Example */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">
            Quick Usage Example
          </h3>
          <div className="bg-gray-900 text-gray-100 p-4 rounded-md overflow-x-auto">
            <pre className="text-sm">
              {`// Import design system components
import { ThemeProvider, Spinner } from 'src/design-system';

// Use in your app
function MyComponent() {
  return (
    <ThemeProvider>
      <Spinner size="md" color="primary" />
    </ThemeProvider>
  );
}`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignSystemStatus;
