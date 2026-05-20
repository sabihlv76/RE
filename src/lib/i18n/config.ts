import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      "nav": {
        "tours": "Tours",
        "hotels": "Hotels",
        "packages": "Packages",
        "agencies": "Agencies",
        "about": "About Rwanda",
        "dashboard": "Dashboard",
        "signin": "Sign In"
      },
      "home": {
        "hero_title": "Discover the Heart of Africa",
        "hero_subtitle": "Book verified tours, luxury eco-lodges, and immersive experiences in Rwanda.",
        "search_placeholder": "Where do you want to go?",
        "explore": "Explore Now"
      }
    }
  },
  fr: {
    translation: {
      "nav": {
        "tours": "Circuits",
        "hotels": "Hôtels",
        "packages": "Forfaits",
        "agencies": "Agences",
        "about": "À propos du Rwanda",
        "dashboard": "Tableau de bord",
        "signin": "Se connecter"
      },
      "home": {
        "hero_title": "Découvrez le Coeur de l'Afrique",
        "hero_subtitle": "Réservez des circuits vérifiés, des écolodges de luxe et des expériences immersives au Rwanda.",
        "search_placeholder": "Où voulez-vous aller ?",
        "explore": "Explorer"
      }
    }
  },
  rw: {
    translation: {
      "nav": {
        "tours": "Ingendo",
        "hotels": "Amahoteli",
        "packages": "Pakeji",
        "agencies": "Ama-Agences",
        "about": "Ibiri mu Rwanda",
        "dashboard": "Aho Nkorera",
        "signin": "Injira"
      },
      "home": {
        "hero_title": "Menya Umutima wa Afurika",
        "hero_subtitle": "Bona ingendo zizewe, amahoteli agezweho, n'ibiruhuko bihebuje mu Rwanda.",
        "search_placeholder": "Wifuza kujya he?",
        "explore": "Tembera Ubu"
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en", // Default
    fallbackLng: "en",
    interpolation: {
      escapeValue: false 
    }
  });

export default i18n;
