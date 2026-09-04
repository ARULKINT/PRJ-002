/**
 * Built-in outreach templates.
 *
 * Every fresh browser/device that opens the app starts with these — no
 * export/import needed for these specific ones. They are seeded into
 * TemplateStore once (see js/template-store.js -> ensureSeeded()); after
 * that they behave like any other saved template, including being fully
 * removable without coming back.
 *
 * Each entry: { id, name, passage, marker, seed }
 *   - passage: the message text, containing the literal word named by
 *     "marker" somewhere in it (e.g. "xyz").
 *   - marker:  the word inside passage that gets swapped out.
 *   - seed:    newline-separated list of replacement values for marker.
 */
export const DEFAULT_TEMPLATES = [
  {
    "id": "1788430565356-4bv1s",
    "name": "intial msg",
    "passage": "Hi Sir/Madam, this is Arul from Forge & Flint.\n\nWe help small and growing businesses improve the way they manage customers, billing, inventory, websites and business operations through practical digital solutions.\n\nI came across xyz and thought there may be a few areas where technology could make your day-to-day work easier.\n\nI’d like to understand how you currently manage your business and see whether we can help.\n\nWould you be available for a 10-minute call sometime this week?",
    "marker": "xyz",
  },
  {
    "id": "1788430656736-9jggs",
    "name": "initial msg taml",
    "passage": "வணக்கம் Sir/Madam, நான் Forge & Flint நிறுவனத்திலிருந்து அருள் பேசுகிறேன்.\n\nசிறிய மற்றும் வளர்ந்து வரும் வணிகங்கள் வாடிக்கையாளர் நிர்வாகம், பில்லிங், சரக்கு மேலாண்மை, இணையதளம் மற்றும் அன்றாட வணிக செயல்பாடுகளை சிறப்பாக நிர்வகிக்க நடைமுறை டிஜிட்டல் தீர்வுகளை வழங்குகிறோம்.\n\nxyxz பற்றி பார்த்தபோது, தொழில்நுட்பத்தின் மூலம் உங்கள் அன்றாட வணிகப் பணிகளை இன்னும் எளிதாகவும் திறமையாகவும் செய்யக்கூடிய சில வாய்ப்புகள் இருக்கலாம் என்று நினைத்தேன்.\n\nதற்போது உங்கள் வணிகத்தை எவ்வாறு நிர்வகித்து வருகிறீர்கள் என்பதைப் புரிந்துகொண்டு, எங்களால் எந்த வகையில் உதவ முடியும் என்பதைப் பற்றி தெரிந்துகொள்ள விரும்புகிறேன்.\n\nஇந்த வாரம் 10 நிமிடங்கள் பேசுவதற்கு உங்களுக்கு வசதியான நேரம் இருக்குமா?",
    "marker": "xyxz",
  },
  {
    "id": "1788430756955-gluxg",
    "name": "follow up - 1 eng",
    "passage": "Hi Sir/Madam, just following up on my previous message.\n\nI wanted to understand how you currently manage your customers, billing, inventory and day-to-day business operations at xyzzzz.\n\nIf you're available, I'd be happy to have a quick 10-minute call sometime this week.",
    "marker": "xyzzzz",
  },
  {
    "id": "1788430869771-ee4d9",
    "name": "follow up -1 tam",
    "passage": "வணக்கம் Sir/Madam, முன்பு அனுப்பிய செய்தியைத் தொடர்ந்து தொடர்பு கொள்கிறேன்.\n\nxyzzz -ல் தற்போது வாடிக்கையாளர்கள், பில்லிங், சரக்கு மற்றும் அன்றாட வணிக செயல்பாடுகளை எவ்வாறு நிர்வகித்து வருகிறீர்கள் என்பதைப் புரிந்துகொள்ள விரும்புகிறேன்.\n\nஉங்களுக்கு வசதியாக இருந்தால், இந்த வாரம் 10 நிமிடங்கள் சுருக்கமாக பேசலாம்.",
    "marker": "xyzzz",
  },
  {
    "id": "1788430960363-r3xj4",
    "name": "follow-up - final eng",
    "passage": "Hi xyz , just one last follow-up from my side.\n\nIf you're looking to improve any part of your business management, billing, inventory, customer handling or online presence, I'd be happy to understand your requirements and see if we can help.\n\nIf this isn't something you're looking for right now, no problem at all.",
    "marker": "xyz",
  },
  {
    "id": "1788431030539-9cdsu",
    "name": "follow up_final -tamil",
    "passage": "வணக்கம் xyz, என்னுடைய தரப்பிலிருந்து இது ஒரு இறுதி follow-up.\n\nஉங்கள் வணிக நிர்வாகம், பில்லிங், சரக்கு மேலாண்மை, வாடிக்கையாளர் நிர்வாகம் அல்லது ஆன்லைன் செயல்பாடுகளில் ஏதேனும் பகுதியை மேம்படுத்த திட்டமிட்டு இருந்தால், உங்கள் தேவைகளைப் புரிந்துகொண்டு எங்களால் உதவ முடியுமா என்பதைப் பற்றி பேச விரும்புகிறேன்.\n\nதற்போது இதற்கான தேவை இல்லை என்றாலும் பரவாயில்லை.",
    "marker": "xyz",
  }
];
