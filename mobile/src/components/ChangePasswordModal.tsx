import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { useTheme, ThemeColors } from '../contexts/ThemeContext';

interface ChangePasswordModalProps {
  visible: boolean;
  onClose: () => void;
}

interface ValidationErrors {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ visible, onClose }) => {
  const { changePassword } = useAuth();
  const { colors } = useTheme();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [passwordStrength, setPasswordStrength] = useState<{
    score: number;
    feedback: string[];
  }>({ score: 0, feedback: [] });

  // Password strength validation
  const validatePasswordStrength = (password: string) => {
    const feedback: string[] = [];
    let score = 0;

    if (password.length >= 8) {
      score += 1;
    } else {
      feedback.push('At least 8 characters');
    }

    if (/[a-z]/.test(password)) {
      score += 1;
    } else {
      feedback.push('Include lowercase letter');
    }

    if (/[A-Z]/.test(password)) {
      score += 1;
    } else {
      feedback.push('Include uppercase letter');
    }

    if (/[0-9]/.test(password)) {
      score += 1;
    } else {
      feedback.push('Include number');
    }

    if (/[^A-Za-z0-9]/.test(password)) {
      score += 1;
    } else {
      feedback.push('Include special character');
    }

    return { score, feedback };
  };

  // Real-time validation
  useEffect(() => {
    const newErrors: ValidationErrors = {};

    // Current password validation
    if (currentPassword.trim() && currentPassword.length < 1) {
      newErrors.currentPassword = 'Current password is required';
    }

    // New password validation
    if (newPassword.trim()) {
      if (newPassword.length < 8) {
        newErrors.newPassword = 'Password must be at least 8 characters';
      } else if (currentPassword && newPassword === currentPassword) {
        newErrors.newPassword = 'New password must be different from current password';
      } else {
        const strength = validatePasswordStrength(newPassword);
        setPasswordStrength(strength);
        if (strength.score < 3) {
          newErrors.newPassword = 'Password is too weak';
        }
      }
    }

    // Confirm password validation
    if (confirmPassword.trim() && newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
  }, [currentPassword, newPassword, confirmPassword]);

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    // Current password validation
    if (!currentPassword.trim()) {
      newErrors.currentPassword = 'Current password is required';
    }

    // New password validation
    if (!newPassword.trim()) {
      newErrors.newPassword = 'New password is required';
    } else if (newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
    } else if (newPassword === currentPassword) {
      newErrors.newPassword = 'New password must be different from current password';
    } else {
      const strength = validatePasswordStrength(newPassword);
      if (strength.score < 3) {
        newErrors.newPassword = 'Password is too weak';
      }
    }

    // Confirm password validation
    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your new password';
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const success = await changePassword(currentPassword, newPassword);
      if (success) {
        Alert.alert(
          'Success',
          'Password changed successfully! Please log in again with your new password.',
          [{ text: 'OK', onPress: handleClose }]
        );
      } else {
        Alert.alert('Error', 'Failed to change password. Please check your current password and try again.');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to change password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
    setErrors({});
    setPasswordStrength({ score: 0, feedback: [] });
    onClose();
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength.score >= 4) return colors.success;
    if (passwordStrength.score >= 3) return colors.warning;
    return colors.error;
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength.score >= 4) return 'Strong';
    if (passwordStrength.score >= 3) return 'Good';
    if (passwordStrength.score >= 2) return 'Fair';
    return 'Weak';
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <View style={[styles.overlay, { backgroundColor: colors.modalOverlay }]}>
        <View style={[styles.modalContent, { backgroundColor: colors.modalBackground }]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]}>Change Password</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={styles.form}>
            {/* Current Password */}
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors.text }]}>Current Password</Text>
              <View style={[styles.passwordInput, { 
                backgroundColor: colors.inputBackground,
                borderColor: errors.currentPassword ? colors.error : colors.inputBorder 
              }]}>
                <TextInput
                  style={[styles.textInput, { color: colors.inputText }]}
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  placeholder="Enter current password"
                  placeholderTextColor={colors.inputPlaceholder}
                  secureTextEntry={!showCurrentPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                  style={styles.eyeButton}
                >
                  <Ionicons
                    name={showCurrentPassword ? 'eye-off' : 'eye'}
                    size={20}
                    color={colors.textSecondary}
                  />
                </TouchableOpacity>
              </View>
              {errors.currentPassword && (
                <Text style={[styles.errorText, { color: colors.error }]}>{errors.currentPassword}</Text>
              )}
            </View>

            {/* New Password */}
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors.text }]}>New Password</Text>
              <View style={[styles.passwordInput, { 
                backgroundColor: colors.inputBackground,
                borderColor: errors.newPassword ? colors.error : colors.inputBorder 
              }]}>
                <TextInput
                  style={[styles.textInput, { color: colors.inputText }]}
                  value={newPassword}
                  onChangeText={setNewPassword}
                  placeholder="Enter new password"
                  placeholderTextColor={colors.inputPlaceholder}
                  secureTextEntry={!showNewPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  onPress={() => setShowNewPassword(!showNewPassword)}
                  style={styles.eyeButton}
                >
                  <Ionicons
                    name={showNewPassword ? 'eye-off' : 'eye'}
                    size={20}
                    color={colors.textSecondary}
                  />
                </TouchableOpacity>
              </View>
              {errors.newPassword && (
                <Text style={[styles.errorText, { color: colors.error }]}>{errors.newPassword}</Text>
              )}
              {newPassword && passwordStrength.score > 0 && (
                <View style={styles.strengthIndicator}>
                  <Text style={[styles.strengthText, { color: getPasswordStrengthColor() }]}>
                    Password Strength: {getPasswordStrengthText()}
                  </Text>
                </View>
              )}
            </View>

            {/* Confirm New Password */}
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors.text }]}>Confirm New Password</Text>
              <View style={[styles.passwordInput, { 
                backgroundColor: colors.inputBackground,
                borderColor: errors.confirmPassword ? colors.error : colors.inputBorder 
              }]}>
                <TextInput
                  style={[styles.textInput, { color: colors.inputText }]}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Confirm new password"
                  placeholderTextColor={colors.inputPlaceholder}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={styles.eyeButton}
                >
                  <Ionicons
                    name={showConfirmPassword ? 'eye-off' : 'eye'}
                    size={20}
                    color={colors.textSecondary}
                  />
                </TouchableOpacity>
              </View>
              {errors.confirmPassword && (
                <Text style={[styles.errorText, { color: colors.error }]}>{errors.confirmPassword}</Text>
              )}
            </View>

            {/* Password Requirements */}
            <View style={[styles.requirements, { backgroundColor: colors.info + '10' }]}>
              <Text style={[styles.requirementsTitle, { color: colors.text }]}>Password Requirements:</Text>
              <Text style={[styles.requirement, { color: colors.textSecondary }]}>• At least 8 characters long</Text>
              <Text style={[styles.requirement, { color: colors.textSecondary }]}>• Include uppercase and lowercase letters</Text>
              <Text style={[styles.requirement, { color: colors.textSecondary }]}>• Include at least one number</Text>
              <Text style={[styles.requirement, { color: colors.textSecondary }]}>• Include at least one special character</Text>
              <Text style={[styles.requirement, { color: colors.textSecondary }]}>• Must be different from current password</Text>
            </View>
          </View>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton, { 
                backgroundColor: colors.buttonSecondary,
                borderColor: colors.border 
              }]}
              onPress={handleClose}
              disabled={isLoading}
            >
              <Text style={[styles.cancelButtonText, { color: colors.buttonSecondaryText }]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.submitButton, { 
                backgroundColor: isLoading || Object.keys(errors).length > 0 ? colors.textTertiary : colors.buttonPrimary 
              }]}
              onPress={handleSubmit}
              disabled={isLoading || Object.keys(errors).length > 0}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color={colors.buttonPrimaryText} />
              ) : (
                <Text style={[styles.submitButtonText, { color: colors.buttonPrimaryText }]}>Change Password</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 5,
  },
  form: {
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  passwordInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
  },
  textInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
  },
  eyeButton: {
    padding: 12,
  },
  requirements: {
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  requirementsTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  requirement: {
    fontSize: 12,
    marginBottom: 2,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    borderWidth: 1,
  },
  submitButton: {
    // backgroundColor will be set dynamically
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
  },
  strengthIndicator: {
    marginTop: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  strengthText: {
    fontSize: 12,
    fontWeight: '600',
  },
});

export default ChangePasswordModal;
