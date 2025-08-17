import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { RootStackParamList } from '../../types';

type RegisterScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Register'>;

const RegisterScreen: React.FC = () => {
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const { register, isLoading, error, clearError } = useAuth();
  const { colors } = useTheme();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    role: 'Farmer' as 'Farmer' | 'Admin' | 'Researcher',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value) return 'Email is required';
        if (!emailRegex.test(value)) return 'Please enter a valid email';
        return '';
      
      case 'password':
        if (!value) return 'Password is required';
        if (value.length < 6) return 'Password must be at least 6 characters';
        return '';
      
      case 'confirmPassword':
        if (!value) return 'Please confirm your password';
        if (value !== formData.password) return 'Passwords do not match';
        return '';
      
      case 'firstName':
        if (!value) return 'First name is required';
        if (value.length < 2) return 'First name must be at least 2 characters';
        return '';
      
      case 'lastName':
        if (!value) return 'Last name is required';
        if (value.length < 2) return 'Last name must be at least 2 characters';
        return '';
      
      case 'phoneNumber':
        if (value && !/^\+?[\d\s\-\(\)]+$/.test(value)) {
          return 'Please enter a valid phone number';
        }
        return '';
      
      default:
        return '';
    }
  };

  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key as keyof typeof formData]);
      if (error) {
        newErrors[key] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    clearError();
    
    if (!validateForm()) {
      return;
    }

    const { confirmPassword, phoneNumber, ...registerData } = formData;
    
    // Only include phoneNumber if it's not empty
    if (phoneNumber && phoneNumber.trim() !== '') {
      registerData.phoneNumber = phoneNumber;
    }
    
    // Debug: Log the data being sent
    console.log('Sending registration data:', registerData);
    
    const success = await register(registerData);
    
    if (success) {
      Alert.alert(
        'Registration Successful',
        'Your account has been created successfully!',
        [{ text: 'OK' }]
      );
    } else {
      Alert.alert('Registration Failed', error || 'Please try again.');
    }
  };

  const handleLogin = () => {
    navigation.navigate('Login');
  };

  const renderInput = (
    name: string,
    label: string,
    placeholder: string,
    icon: string,
    options: {
      secureTextEntry?: boolean;
      keyboardType?: any;
      autoCapitalize?: any;
      showEye?: boolean;
    } = {}
  ) => {
    const { secureTextEntry = false, keyboardType = 'default', autoCapitalize = 'none', showEye = false } = options;
    const isPassword = name === 'password' || name === 'confirmPassword';
    const showEyeIcon = showEye && isPassword;
    const isPasswordVisible = (name === 'password' && !showPassword) || (name === 'confirmPassword' && !showConfirmPassword);

    return (
      <View style={styles.inputContainer}>
        <Text style={styles.label}>{label}</Text>
        <View style={[styles.inputWrapper, errors[name] ? styles.inputError : null]}>
          <Ionicons name={icon as any} size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder={placeholder}
            value={formData[name as keyof typeof formData]}
            onChangeText={(text) => handleInputChange(name, text)}
            secureTextEntry={isPassword ? isPasswordVisible : secureTextEntry}
            keyboardType={keyboardType}
            autoCapitalize={autoCapitalize}
            autoCorrect={false}
            onBlur={() => {
              const error = validateField(name, formData[name as keyof typeof formData]);
              if (error) {
                setErrors(prev => ({ ...prev, [name]: error }));
              }
            }}
          />
          {showEyeIcon && (
            <TouchableOpacity
              onPress={() => {
                if (name === 'password') setShowPassword(!showPassword);
                if (name === 'confirmPassword') setShowConfirmPassword(!showConfirmPassword);
              }}
              style={styles.eyeIcon}
            >
              <Ionicons
                name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color="#666"
              />
            </TouchableOpacity>
          )}
        </View>
        {errors[name] ? <Text style={styles.errorText}>{errors[name]}</Text> : null}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Ionicons name="leaf" size={80} color="#4CAF50" />
          <Text style={styles.title}>AgroMesh</Text>
          <Text style={styles.subtitle}>Join Smart Farming</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.formTitle}>Create Account</Text>
          
          {/* Name Fields */}
          <View style={styles.row}>
            <View style={styles.halfWidth}>
              {renderInput('firstName', 'First Name', 'Enter first name', 'person-outline', {
                autoCapitalize: 'words',
              })}
            </View>
            <View style={styles.halfWidth}>
              {renderInput('lastName', 'Last Name', 'Enter last name', 'person-outline', {
                autoCapitalize: 'words',
              })}
            </View>
          </View>

          {/* Email */}
          {renderInput('email', 'Email', 'Enter your email', 'mail-outline', {
            keyboardType: 'email-address',
          })}

          {/* Phone Number */}
          {renderInput('phoneNumber', 'Phone Number (Optional)', 'Enter phone number', 'call-outline', {
            keyboardType: 'phone-pad',
          })}

          {/* Role Selection */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Role</Text>
            <View style={styles.roleContainer}>
              {(['Farmer', 'Researcher', 'Admin'] as const).map((role) => (
                <TouchableOpacity
                  key={role}
                  style={[
                    styles.roleButton,
                    formData.role === role ? styles.roleButtonActive : null,
                  ]}
                  onPress={() => setFormData(prev => ({ ...prev, role }))}
                >
                  <Text style={[
                    styles.roleButtonText,
                    formData.role === role ? styles.roleButtonTextActive : null,
                  ]}>
                    {role}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Password */}
          {renderInput('password', 'Password', 'Enter your password', 'lock-closed-outline', {
            showEye: true,
          })}

          {/* Confirm Password */}
          {renderInput('confirmPassword', 'Confirm Password', 'Confirm your password', 'lock-closed-outline', {
            showEye: true,
          })}

          {/* Register Button */}
          <TouchableOpacity
            style={[styles.registerButton, isLoading ? styles.registerButtonDisabled : null]}
            onPress={handleRegister}
            disabled={isLoading}
          >
            {isLoading ? (
              <Text style={styles.registerButtonText}>Creating Account...</Text>
            ) : (
              <Text style={styles.registerButtonText}>Create Account</Text>
            )}
          </TouchableOpacity>

          {/* Login Link */}
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={handleLogin}>
              <Text style={styles.loginLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  form: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 24,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f9f9f9',
  },
  inputError: {
    borderColor: '#ff6b6b',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#333',
  },
  eyeIcon: {
    padding: 5,
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 14,
    marginTop: 5,
  },
  roleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  roleButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f9f9f9',
    alignItems: 'center',
  },
  roleButtonActive: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  roleButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  roleButtonTextActive: {
    color: 'white',
  },
  registerButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  registerButtonDisabled: {
    backgroundColor: '#ccc',
  },
  registerButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    color: '#666',
    fontSize: 14,
  },
  loginLink: {
    color: '#4CAF50',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default RegisterScreen; 