import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeValueInAsyncStorage = async (key, value) => {
    try {
        await AsyncStorage.setItem(key, value)
    } catch (e) {
        // saving error
    }
}

export const getValueFromAsyncStorage = async (key) => {
    try {
      const value = await AsyncStorage.getItem(key)
      if(value !== null) {
        // value previously stored
        return value;
      }
    } catch(e) {
      // error reading value
    }
}

// GET MULTIPLE VALUES FROM ASYNC STORAGE
export const getMultipleValuesFromAsyncStorage = async (keys) => {
  try {
    const values = await AsyncStorage.multiGet(keys);
    return values;
  } catch(e) {
    // error reading value
  }
}

export const removeValueFromAsyncStorage = async (key) => {
    try {
      await AsyncStorage.removeItem(key);
    } catch(e) {
      // remove error
    }
}

