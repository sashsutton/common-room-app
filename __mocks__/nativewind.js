// Mock NativeWind in test environment — className props are ignored
const React = require('react');

module.exports = {
  styled: (component) => component,
  useColorScheme: () => ({ colorScheme: 'light' }),
};
