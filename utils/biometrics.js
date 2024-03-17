import { 
    hasHardwareAsync,
    isEnrolledAsync,
    authenticateAsync 
} from 'expo-local-authentication';

const biometricsAuth = async () => {
    try {
        const compatible = await hasHardwareAsync();
        if (!compatible) throw 'This device is not compatible for biometric authentication';

        const enrolled = await isEnrolledAsync();
        if (!enrolled) throw 'This device doesn\'t have biometric authentication enabled';

        const result = await authenticateAsync();
        if (!result.success) throw `${result.error} - Authentication unsuccessful`;

        return { success: true }; 
    } catch (error) {
        return { success: false, error: error }; 
    }
};

export default biometricsAuth;
