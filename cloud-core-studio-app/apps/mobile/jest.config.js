module.exports = {
  preset: "jest-expo",
  testMatch: ["**/*.test.ts"],
  transformIgnorePatterns: [
    "node_modules/(?!((jest-)?react-native|@react-native|expo(nent)?|@expo(nent)?/.*|expo-.*|@expo/.*|@cloud-core/shared)/)"
  ]
};
