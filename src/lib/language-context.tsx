"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "en" | "hi";

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

// Translation dictionary
const translations = {
  en: {
    // Navigation
    "nav.home": "Home",
    "nav.dashboard": "Dashboard",
    "nav.gallery": "Gallery",
    "nav.create": "Create Gallery",
    "nav.marketplace": "Marketplace",
    "nav.create_content": "Create Content",
    "nav.content_studio": "Content Studio",
    "nav.schedule": "Schedule Posts",
    "nav.analytics": "Analytics",
    "nav.integrations": "Integrations",
    "nav.login": "Login",
    "nav.settings": "Settings",
    "nav.cart": "Shopping Cart",
    "nav.orders": "My Orders",
    "nav.admin": "Admin Dashboard",

    // Dashboard
    "dashboard.title": "Dashboard",
    "dashboard.welcome": "Welcome back!",
    "dashboard.subtitle":
      "Ready to create amazing content for your social media?",
    "dashboard.create_content": "Create Content",
    "dashboard.metrics.posts_created": "Posts Created",
    "dashboard.metrics.scheduled_posts": "Scheduled Posts",
    "dashboard.metrics.total_reach": "Total Reach",
    "dashboard.metrics.engagement_rate": "Engagement Rate",
    "dashboard.metrics.new_followers": "New Followers",
    "dashboard.actions.create_content": "Create Content",
    "dashboard.actions.schedule_posts": "Schedule Posts",
    "dashboard.actions.view_analytics": "View Analytics",
    "dashboard.actions.create_gallery": "Create Gallery",
    "dashboard.recent_posts": "Recent Posts",
    "dashboard.recent_subtitle": "Your latest content across all platforms",
    "dashboard.view_all": "View All",

    // Marketplace
    "marketplace.title": "Marketplace",
    "marketplace.subtitle": "Discover amazing products from trusted sellers",
    "marketplace.showing": "Showing {count} of {total} products",
    "marketplace.categories": "All Categories",
    "marketplace.popular": "Popular",
    "marketplace.filters": "Filters",
    "marketplace.add_to_cart": "Add to Cart",
    "marketplace.view_details": "View Details",
    "marketplace.by": "by",
    "marketplace.reviews": "reviews",
    "marketplace.views": "views",
    "marketplace.sold": "sold",

    // Content Studio
    "content_studio.title": "Content Studio",
    "content_studio.subtitle":
      "Professional image enhancement and content generation",
    "content_studio.upload_image": "Upload Image",
    "content_studio.upload_text": "Click to upload or drag and drop",
    "content_studio.upload_formats": "PNG, JPG, GIF up to 10MB",
    "content_studio.enhanced_variations": "Enhanced Variations",
    "content_studio.enhanced_text":
      "Upload an image and click 'Generate Enhancements' to see professional variations",
    "content_studio.styles": "Enhancement Styles",
    "content_studio.styles_subtitle":
      "Each style applies different professional techniques to your image",
    "content_studio.professional": "Professional Product",
    "content_studio.professional_desc":
      "Studio lighting, clean background, commercial quality",
    "content_studio.lifestyle": "Lifestyle",
    "content_studio.lifestyle_desc":
      "Natural lighting, authentic feel, social media ready",
    "content_studio.editorial": "Editorial",
    "content_studio.editorial_desc":
      "Dramatic lighting, artistic composition, magazine style",
    "content_studio.minimalist": "Minimalist",
    "content_studio.minimalist_desc":
      "Clean lines, soft lighting, modern aesthetic",

    // Analytics
    "analytics.title": "Analytics",
    "analytics.subtitle": "Track your social media performance and engagement",
    "analytics.date_range": "Last 7 days",
    "analytics.export": "Export Report",
    "analytics.metrics.total_posts": "Total Posts",
    "analytics.metrics.total_reach": "Total Reach",
    "analytics.metrics.engagement_rate": "Engagement Rate",
    "analytics.metrics.new_followers": "New Followers",
    "analytics.platform_performance": "Platform Performance",
    "analytics.platform_subtitle":
      "Performance metrics across all your social media platforms",
    "analytics.engagement_metrics": "Engagement Metrics",
    "analytics.engagement_subtitle":
      "Detailed breakdown of engagement across all platforms",
    "analytics.top_posts": "Top Performing Posts",
    "analytics.top_subtitle": "Your best performing content from the last 7d",
    "analytics.view_details": "View Details",
    "analytics.likes": "Likes",
    "analytics.comments": "Comments",
    "analytics.shares": "Shares",
    "analytics.saves": "Saves",

    // Create Content
    "create_content.title": "Content Creator",
    "create_content.subtitle":
      "Chat with AI to create amazing social media content",
    "create_content.clear_chat": "Clear Chat",
    "create_content.content_studio": "Content Studio",
    "create_content.ai_message":
      "Hi! I'm your AI content assistant. You can ask me to create social media content, upload images for enhancement, or get content suggestions. What would you like to create today?",
    "create_content.copy": "Copy",
    "create_content.save": "Save",
    "create_content.type_message":
      "Type your message... (e.g., 'Create a post about sustainable living' or 'Enhance this image for Instagram')",
    "create_content.ai_powered": "AI-Powered",
    "create_content.upload_images": "Upload images for enhancement",
    "create_content.multi_platform": "Multi-platform content",

    // Gallery
    "gallery.title": "3D Art Gallery",
    "gallery.description": "Explore your personal 3D art gallery",
    "gallery.back": "Back to Home",
    "gallery.artworks": "artwork",
    "gallery.artworks_plural": "artworks",
    "gallery.views": "view",
    "gallery.views_plural": "views",
    "gallery.loading": "Loading 3D Gallery...",
    "gallery.controls": "Gallery Controls",
    "gallery.move": "W/A/S/D: Move around",
    "gallery.look": "Mouse: Look around",
    "gallery.click": "Click: Lock pointer & start moving",
    "gallery.escape": "ESC: Unlock pointer",

    // Create Gallery
    "create.title": "Create New Gallery",
    "create.subtitle":
      "Upload your images and create an immersive 3D gallery experience",
    "create.settings": "Gallery Settings",
    "create.settings_desc": "Configure your gallery name and description",
    "create.name": "Gallery Name",
    "create.name_placeholder": "My Art Gallery",
    "create.description": "Description",
    "create.description_placeholder": "Describe your gallery...",
    "create.upload": "Upload Images",
    "create.create": "Create Gallery",
    "create.cancel": "Cancel",
    "create.success": "Gallery created successfully!",
    "create.error": "Error creating gallery",
    "create.view_demo": "View Demo Gallery",

    // Common
    "common.loading": "Loading...",
    "common.error": "Error",
    "common.success": "Success",
    "common.save": "Save",
    "common.cancel": "Cancel",
    "common.delete": "Delete",
    "common.edit": "Edit",
    "common.close": "Close",
    "common.optional": "Optional",
    "common.search": "Search content, posts, or analytics...",
    "common.get_started": "Get Started",
    "common.schedule_now": "Schedule Now",
    "common.view_reports": "View Reports",
    "common.create_gallery": "Create Gallery",
    "common.published": "Published",
    "common.scheduled": "Scheduled",
    "common.draft": "Draft",
    "common.featured": "Featured",
    "common.off": "OFF",
    "common.sign_out": "Sign Out",
  },
  hi: {
    // Navigation
    "nav.home": "होम",
    "nav.dashboard": "डैशबोर्ड",
    "nav.gallery": "गैलरी",
    "nav.create": "गैलरी बनाएं",
    "nav.marketplace": "मार्केटप्लेस",
    "nav.create_content": "सामग्री बनाएं",
    "nav.content_studio": "कंटेंट स्टूडियो",
    "nav.schedule": "पोस्ट शेड्यूल करें",
    "nav.analytics": "एनालिटिक्स",
    "nav.integrations": "एकीकरण",
    "nav.login": "लॉगिन",
    "nav.settings": "सेटिंग्स",
    "nav.cart": "शॉपिंग कार्ट",
    "nav.orders": "मेरे ऑर्डर",
    "nav.admin": "एडमिन डैशबोर्ड",

    // Dashboard
    "dashboard.title": "डैशबोर्ड",
    "dashboard.welcome": "वापस स्वागत है!",
    "dashboard.subtitle":
      "अपने सोशल मीडिया के लिए अद्भुत सामग्री बनाने के लिए तैयार हैं?",
    "dashboard.create_content": "सामग्री बनाएं",
    "dashboard.metrics.posts_created": "पोस्ट बनाए गए",
    "dashboard.metrics.scheduled_posts": "शेड्यूल किए गए पोस्ट",
    "dashboard.metrics.total_reach": "कुल पहुंच",
    "dashboard.metrics.engagement_rate": "एंगेजमेंट दर",
    "dashboard.metrics.new_followers": "नए फॉलोअर्स",
    "dashboard.actions.create_content": "सामग्री बनाएं",
    "dashboard.actions.schedule_posts": "पोस्ट शेड्यूल करें",
    "dashboard.actions.view_analytics": "एनालिटिक्स देखें",
    "dashboard.actions.create_gallery": "गैलरी बनाएं",
    "dashboard.recent_posts": "हाल के पोस्ट",
    "dashboard.recent_subtitle": "सभी प्लेटफॉर्म पर आपकी नवीनतम सामग्री",
    "dashboard.view_all": "सभी देखें",

    // Marketplace
    "marketplace.title": "मार्केटप्लेस",
    "marketplace.subtitle": "विश्वसनीय विक्रेताओं से अद्भुत उत्पाद खोजें",
    "marketplace.showing": "{total} में से {count} उत्पाद दिखाए जा रहे हैं",
    "marketplace.categories": "सभी श्रेणियां",
    "marketplace.popular": "लोकप्रिय",
    "marketplace.filters": "फिल्टर",
    "marketplace.add_to_cart": "कार्ट में जोड़ें",
    "marketplace.view_details": "विवरण देखें",
    "marketplace.by": "द्वारा",
    "marketplace.reviews": "समीक्षाएं",
    "marketplace.views": "दृश्य",
    "marketplace.sold": "बेचे गए",

    // Content Studio
    "content_studio.title": "कंटेंट स्टूडियो",
    "content_studio.subtitle": "पेशेवर छवि संवर्धन और सामग्री निर्माण",
    "content_studio.upload_image": "छवि अपलोड करें",
    "content_studio.upload_text":
      "अपलोड करने के लिए क्लिक करें या खींचकर छोड़ें",
    "content_studio.upload_formats": "PNG, JPG, GIF 10MB तक",
    "content_studio.enhanced_variations": "संवर्धित वेरिएशन",
    "content_studio.enhanced_text":
      "पेशेवर वेरिएशन देखने के लिए एक छवि अपलोड करें और 'संवर्धन उत्पन्न करें' पर क्लिक करें",
    "content_studio.styles": "संवर्धन शैलियां",
    "content_studio.styles_subtitle":
      "प्रत्येक शैली आपकी छवि पर विभिन्न पेशेवर तकनीक लागू करती है",
    "content_studio.professional": "पेशेवर उत्पाद",
    "content_studio.professional_desc":
      "स्टूडियो लाइटिंग, साफ पृष्ठभूमि, वाणिज्यिक गुणवत्ता",
    "content_studio.lifestyle": "लाइफस्टाइल",
    "content_studio.lifestyle_desc":
      "प्राकृतिक लाइटिंग, प्रामाणिक भावना, सोशल मीडिया के लिए तैयार",
    "content_studio.editorial": "संपादकीय",
    "content_studio.editorial_desc":
      "नाटकीय लाइटिंग, कलात्मक रचना, पत्रिका शैली",
    "content_studio.minimalist": "मिनिमलिस्ट",
    "content_studio.minimalist_desc": "साफ लाइनें, नरम लाइटिंग, आधुनिक सौंदर्य",

    // Analytics
    "analytics.title": "एनालिटिक्स",
    "analytics.subtitle":
      "अपने सोशल मीडिया प्रदर्शन और एंगेजमेंट को ट्रैक करें",
    "analytics.date_range": "पिछले 7 दिन",
    "analytics.export": "रिपोर्ट निर्यात करें",
    "analytics.metrics.total_posts": "कुल पोस्ट",
    "analytics.metrics.total_reach": "कुल पहुंच",
    "analytics.metrics.engagement_rate": "एंगेजमेंट दर",
    "analytics.metrics.new_followers": "नए फॉलोअर्स",
    "analytics.platform_performance": "प्लेटफॉर्म प्रदर्शन",
    "analytics.platform_subtitle":
      "आपके सभी सोशल मीडिया प्लेटफॉर्म पर प्रदर्शन मेट्रिक्स",
    "analytics.engagement_metrics": "एंगेजमेंट मेट्रिक्स",
    "analytics.engagement_subtitle":
      "सभी प्लेटफॉर्म पर एंगेजमेंट का विस्तृत विवरण",
    "analytics.top_posts": "शीर्ष प्रदर्शन करने वाले पोस्ट",
    "analytics.top_subtitle":
      "पिछले 7 दिनों से आपकी सर्वश्रेष्ठ प्रदर्शन करने वाली सामग्री",
    "analytics.view_details": "विवरण देखें",
    "analytics.likes": "लाइक्स",
    "analytics.comments": "टिप्पणियां",
    "analytics.shares": "शेयर",
    "analytics.saves": "सेव",

    // Create Content
    "create_content.title": "कंटेंट क्रिएटर",
    "create_content.subtitle":
      "अद्भुत सोशल मीडिया सामग्री बनाने के लिए AI के साथ चैट करें",
    "create_content.clear_chat": "चैट साफ करें",
    "create_content.content_studio": "कंटेंट स्टूडियो",
    "create_content.ai_message":
      "नमस्ते! मैं आपका AI कंटेंट असिस्टेंट हूं। आप मुझसे सोशल मीडिया सामग्री बनाने, छवियों को बेहतर बनाने के लिए अपलोड करने, या सामग्री सुझाव प्राप्त करने के लिए कह सकते हैं। आज आप क्या बनाना चाहते हैं?",
    "create_content.copy": "कॉपी करें",
    "create_content.save": "सहेजें",
    "create_content.type_message":
      "अपना संदेश टाइप करें... (जैसे, 'टिकाऊ जीवन के बारे में पोस्ट बनाएं' या 'इस छवि को Instagram के लिए बेहतर बनाएं')",
    "create_content.ai_powered": "AI-संचालित",
    "create_content.upload_images": "बेहतर बनाने के लिए छवियां अपलोड करें",
    "create_content.multi_platform": "मल्टी-प्लेटफॉर्म सामग्री",

    // Gallery
    "gallery.title": "3D कला गैलरी",
    "gallery.description": "अपनी व्यक्तिगत 3D कला गैलरी का अन्वेषण करें",
    "gallery.back": "होम पर वापस जाएं",
    "gallery.artworks": "कलाकृति",
    "gallery.artworks_plural": "कलाकृतियां",
    "gallery.views": "दृश्य",
    "gallery.views_plural": "दृश्य",
    "gallery.loading": "3D गैलरी लोड हो रही है...",
    "gallery.controls": "गैलरी नियंत्रण",
    "gallery.move": "W/A/S/D: चारों ओर घूमें",
    "gallery.look": "माउस: चारों ओर देखें",
    "gallery.click": "क्लिक: पॉइंटर लॉक करें और चलना शुरू करें",
    "gallery.escape": "ESC: पॉइंटर अनलॉक करें",

    // Create Gallery
    "create.title": "नई गैलरी बनाएं",
    "create.subtitle":
      "अपनी छवियां अपलोड करें और एक आकर्षक 3D गैलरी अनुभव बनाएं",
    "create.settings": "गैलरी सेटिंग्स",
    "create.settings_desc": "अपनी गैलरी का नाम और विवरण कॉन्फ़िगर करें",
    "create.name": "गैलरी का नाम",
    "create.name_placeholder": "मेरी कला गैलरी",
    "create.description": "विवरण",
    "create.description_placeholder": "अपनी गैलरी का वर्णन करें...",
    "create.upload": "छवियां अपलोड करें",
    "create.create": "गैलरी बनाएं",
    "create.cancel": "रद्द करें",
    "create.success": "गैलरी सफलतापूर्वक बनाई गई!",
    "create.error": "गैलरी बनाने में त्रुटि",
    "create.view_demo": "डेमो गैलरी देखें",

    // Common
    "common.loading": "लोड हो रहा है...",
    "common.error": "त्रुटि",
    "common.success": "सफलता",
    "common.save": "सहेजें",
    "common.cancel": "रद्द करें",
    "common.delete": "हटाएं",
    "common.edit": "संपादित करें",
    "common.close": "बंद करें",
    "common.optional": "वैकल्पिक",
    "common.search": "सामग्री, पोस्ट या एनालिटिक्स खोजें...",
    "common.get_started": "शुरू करें",
    "common.schedule_now": "अभी शेड्यूल करें",
    "common.view_reports": "रिपोर्ट देखें",
    "common.create_gallery": "गैलरी बनाएं",
    "common.published": "प्रकाशित",
    "common.scheduled": "शेड्यूल किया गया",
    "common.draft": "ड्राफ्ट",
    "common.featured": "फीचर्ड",
    "common.off": "ऑफ",
    "common.sign_out": "साइन आउट",
  },
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");

  useEffect(() => {
    // Load language from localStorage on mount
    const savedLanguage = localStorage.getItem("language") as Language;
    if (savedLanguage && (savedLanguage === "en" || savedLanguage === "hi")) {
      setLanguage(savedLanguage);
    }
  }, []);

  useEffect(() => {
    // Save language to localStorage whenever it changes
    localStorage.setItem("language", language);

    // Update document direction for RTL support if needed
    document.documentElement.setAttribute("lang", language);
    if (language === "hi") {
      document.documentElement.setAttribute("dir", "ltr"); // Hindi still uses LTR
    } else {
      document.documentElement.setAttribute("dir", "ltr");
    }
  }, [language]);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "en" ? "hi" : "en"));
  };

  const t = (key: string): string => {
    return (
      translations[language][
        key as keyof (typeof translations)[typeof language]
      ] || key
    );
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
