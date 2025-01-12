import { action, Action } from 'easy-peasy';

export interface SiteSettings {
    name: string;
    locale: string;
    recaptcha: {
        enabled: boolean;
        siteKey: string;
    };
    analytics: string;
    userRegistration: string;
    usernameEdit: string;
    particles: string;
    rainbowBar: string;
    store: {
        enabled: string;
        cost: {
            slots: number;
            cpu: number;
            ram: number;
            storage: number;
            renewal: number;
        }
    }
}

export interface SettingsStore {
    data?: SiteSettings;
    setSettings: Action<SettingsStore, SiteSettings>;
}

const settings: SettingsStore = {
    data: undefined,

    setSettings: action((state, payload) => {
        state.data = payload;
    }),
};

export default settings;
