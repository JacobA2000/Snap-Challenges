import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeToken = async (value) => {
    try {
        await AsyncStorage.setItem('@token', value)
    } catch (e) {
        // saving error
    }
}

export const getToken = async () => {
    try {
      const value = await AsyncStorage.getItem('@token')
      if(value !== null) {
        // value previously stored
        return value;
      }
    } catch(e) {
      // error reading value
    }
}

export const removeToken = async () => {
    try {
      await AsyncStorage.removeItem('token');
    } catch(e) {
      // remove error
    }
}

  