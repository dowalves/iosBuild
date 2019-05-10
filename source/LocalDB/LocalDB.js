import { AsyncStorage, Alert } from "react-native"

class LocalDB {

    static async saveProfile(email, password, data) {
        console.warn('data==>>', data);
        try {
            await AsyncStorage.setItem('email', email);
            await AsyncStorage.setItem('password', password);
            await AsyncStorage.setItem('profile', JSON.stringify(data));
            return true;
        } catch (error) {
            // Error retrieving data
            console.warn(error.message);
            return false;
        }
    }

    static async getUserProfile() {
        let item = {};
        try {
            var emial = await AsyncStorage.getItem('email') || null;
            var password = await AsyncStorage.getItem('password') || null;
            item = await AsyncStorage.getItem('profile') || null;
            const userProfile = JSON.parse(item);
            return userProfile;
        }
        catch (error) {
            console.warn(error.message);
            return null;
        }
    }

    static async saveIsProfilePublic(isPublic) {
        try {
            await AsyncStorage.setItem('isPublic', isPublic);
        }
        catch (error) {
            console.warn(error.message);
        }
    }
    static async isProfilePublic() {

        const isPublic = await AsyncStorage.getItem('isPublic') || null;
        if (isPublic === '1')
            return true;
        else
            return false;
    }

}

export default LocalDB; 