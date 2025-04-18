export interface CompanySettings {
  companyName: string;
  address: string;
  postalCode: string;
  city: string;
  country: string;
  email: string;
  phone: string;
  organizationNumber: string;
  contactName: string;
  logo?: string;
}

export interface UserSettings {
  name: string;
  email: string;
  phone: string;
}

export interface PasswordChange {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface SettingsState {
  company: CompanySettings;
  user: UserSettings;
  password: PasswordChange;
} 