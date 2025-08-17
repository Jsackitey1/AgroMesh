import AsyncStorage from '@react-native-async-storage/async-storage';

export interface ProfileFeatureTest {
  name: string;
  test: () => Promise<boolean>;
  description: string;
}

export const testProfileFeatures = async (): Promise<{
  results: { [key: string]: boolean };
  summary: string;
}> => {
  const tests: ProfileFeatureTest[] = [
    {
      name: 'Theme Storage',
      description: 'Test if theme preference can be saved and loaded',
      test: async () => {
        try {
          await AsyncStorage.setItem('theme', 'dark');
          const savedTheme = await AsyncStorage.getItem('theme');
          await AsyncStorage.setItem('theme', 'light'); // Reset
          return savedTheme === 'dark';
        } catch (error) {
          console.error('Theme storage test failed:', error);
          return false;
        }
      }
    },
    {
      name: 'Language Storage',
      description: 'Test if language preference can be saved and loaded',
      test: async () => {
        try {
          await AsyncStorage.setItem('language', 'es');
          const savedLanguage = await AsyncStorage.getItem('language');
          await AsyncStorage.setItem('language', 'en'); // Reset
          return savedLanguage === 'es';
        } catch (error) {
          console.error('Language storage test failed:', error);
          return false;
        }
      }
    },
    {
      name: 'Notification Preference',
      description: 'Test if notification preference can be saved and loaded',
      test: async () => {
        try {
          await AsyncStorage.setItem('notificationsEnabled', 'false');
          const savedPreference = await AsyncStorage.getItem('notificationsEnabled');
          await AsyncStorage.setItem('notificationsEnabled', 'true'); // Reset
          return savedPreference === 'false';
        } catch (error) {
          console.error('Notification preference test failed:', error);
          return false;
        }
      }
    }
  ];

  const results: { [key: string]: boolean } = {};
  let passedTests = 0;

  for (const test of tests) {
    try {
      console.log(`🧪 Testing: ${test.name}`);
      const result = await test.test();
      results[test.name] = result;
      if (result) {
        passedTests++;
        console.log(`✅ ${test.name}: PASSED`);
      } else {
        console.log(`❌ ${test.name}: FAILED`);
      }
    } catch (error) {
      console.error(`❌ ${test.name}: ERROR`, error);
      results[test.name] = false;
    }
  }

  const summary = `Profile Features Test Results: ${passedTests}/${tests.length} tests passed`;

  return { results, summary };
};

export const clearProfilePreferences = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove([
      'theme',
      'language',
      'notificationsEnabled'
    ]);
    console.log('✅ Profile preferences cleared');
  } catch (error) {
    console.error('❌ Failed to clear profile preferences:', error);
  }
};

export const getProfilePreferences = async (): Promise<{
  theme: string | null;
  language: string | null;
  notificationsEnabled: string | null;
}> => {
  try {
    const [theme, language, notificationsEnabled] = await AsyncStorage.multiGet([
      'theme',
      'language',
      'notificationsEnabled'
    ]);

    return {
      theme: theme[1],
      language: language[1],
      notificationsEnabled: notificationsEnabled[1]
    };
  } catch (error) {
    console.error('❌ Failed to get profile preferences:', error);
    return {
      theme: null,
      language: null,
      notificationsEnabled: null
    };
  }
};
