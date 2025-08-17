import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage, SUPPORTED_LANGUAGES, LanguageOption } from '../contexts/LanguageContext';
import { useTheme, ThemeColors } from '../contexts/ThemeContext';

interface LanguageSelectionModalProps {
  visible: boolean;
  onClose: () => void;
}

const LanguageSelectionModal: React.FC<LanguageSelectionModalProps> = ({ visible, onClose }) => {
  const { language, setLanguage } = useLanguage();
  const { colors } = useTheme();

  const handleLanguageSelect = (selectedLanguage: LanguageOption) => {
    if (selectedLanguage.code === language) {
      onClose();
      return;
    }

    Alert.alert(
      'Change Language',
      `Are you sure you want to change the language to ${selectedLanguage.name}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Change',
          onPress: () => {
            setLanguage(selectedLanguage.code);
            onClose();
            Alert.alert(
              'Language Changed',
              `Language has been changed to ${selectedLanguage.name}. Some changes may require a restart of the app.`
            );
          },
        },
      ]
    );
  };

  const renderLanguageItem = ({ item }: { item: LanguageOption }) => {
    const isSelected = item.code === language;
    
    return (
      <TouchableOpacity
        style={[
          styles.languageItem, 
          { borderBottomColor: colors.divider },
          isSelected && { backgroundColor: colors.primary + '10' }
        ]}
        onPress={() => handleLanguageSelect(item)}
      >
        <View style={styles.languageInfo}>
          <Text style={styles.languageFlag}>{item.flag}</Text>
          <View style={styles.languageText}>
            <Text style={[
              styles.languageName, 
              { color: colors.text },
              isSelected && { color: colors.primary, fontWeight: '600' }
            ]}>
              {item.name}
            </Text>
            <Text style={[
              styles.languageNative, 
              { color: colors.textSecondary },
              isSelected && { color: colors.primary }
            ]}>
              {item.nativeName}
            </Text>
          </View>
        </View>
        {isSelected && (
          <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={[styles.overlay, { backgroundColor: colors.modalOverlay }]}>
        <View style={[styles.modalContent, { backgroundColor: colors.modalBackground }]}>
          <View style={[styles.header, { borderBottomColor: colors.divider }]}>
            <Text style={[styles.title, { color: colors.text }]}>Select Language</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <FlatList
            data={SUPPORTED_LANGUAGES}
            renderItem={renderLanguageItem}
            keyExtractor={(item) => item.code}
            showsVerticalScrollIndicator={false}
            style={styles.languageList}
          />

          <View style={[styles.footer, { borderTopColor: colors.divider }]}>
            <Text style={[styles.footerText, { color: colors.textSecondary }]}>
              Language changes will be applied immediately. Some features may require a restart.
            </Text>
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
    width: '90%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 5,
  },
  languageList: {
    maxHeight: 400,
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
  },
  languageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  languageFlag: {
    fontSize: 24,
    marginRight: 12,
  },
  languageText: {
    flex: 1,
  },
  languageName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  languageNative: {
    fontSize: 14,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
  },
  footerText: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
  },
});

export default LanguageSelectionModal;
