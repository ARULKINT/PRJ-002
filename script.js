function parseOptionsWithRanges(raw) {
  const lines = raw.split(/\r\n|\r|\n/);
  const segments = [];

  if (lines.length === 1 && lines[0].includes(",")) {
    let pos = 0;
    raw.split(",").forEach((part) => {
      const start = pos;
      const end = pos + part.length;
      segments.push({ raw: part, start, end });
      pos = end + 1; // +1 for the comma
    });
  } else {
    let pos = 0;
    lines.forEach((line) => {
      const start = pos;
      const end = pos + line.length;
      segments.push({ raw: line, start, end });
      pos = end + 1; // +1 for the newline
    });
  }

  return segments
    .map((seg) => ({ text: seg.raw.trim(), start: seg.start, end: seg.end }))
    .filter((seg) => seg.text.length > 0);
}

function getDistinctWords(text) {
  const matches = text.match(/[A-Za-z0-9']+/g) || [];
  return [...new Set(matches)].sort();
}

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Built into the app so every fresh browser/device starts with these —
// no export/import needed for these specific templates. Seeded once (see
// TemplateStore.ensureSeeded below); after that they behave like any other
// saved template, including being fully removable.
const DEFAULT_TEMPLATES = [
  {
    "id": "1788430565356-4bv1s",
    "name": "intial msg",
    "passage": "Hi Sir/Madam, this is Arul from Forge & Flint.\n\nWe help small and growing businesses improve the way they manage customers, billing, inventory, websites and business operations through practical digital solutions.\n\nI came across xyz and thought there may be a few areas where technology could make your day-to-day work easier.\n\nI’d like to understand how you currently manage your business and see whether we can help.\n\nWould you be available for a 10-minute call sometime this week?",
    "marker": "xyz",
    "seed": "Rainbow Mobiles\nPAVITHRA MOBILES MULTI BRAND MOBILE SERVICE CENTER\nMobishoppi\nHello Mobiles\nJAY MOBILES\nMobishoppi\nFalcon Applefix\nRJ MOBILE SERVICE CENTER\nMCD Communication\nSRI SELVA VINAYAGAR MOBILES OR SSV MOBILES\nUdhaya Cell Service\nvivo & iQOO Authorised Service Center\nMobile Care\nSamsung Customer Services\nSangeetha Gadgets - Cuddalore (Manjakuppam)\nTech Zone Mobiles\nXPRESS MOBILES\nA to Z mobile Accessories\nPoorvika Mobiles Cuddalore\nSATHYA ENTERPRISES\nFaas Mobile World\nSri bairavi mobile service in Cuddalore\nBikaner Cellulars\nAvengers Mobile\nReliance Digital\nNew JK Mobiles Cuddalore\nMatricx Mobiles\nJai Mobiles & Computers\nVVS MOBILE PLAZA\nB-AAD Cell Point\nR.B Mobiles\nJayam Mobiles Laptops\nSathya Agencies, Cuddalore - Electronics and Home Appliances Store\nGlobo Green\nVANI MOBILES\nMi Service Center\nBLUE MOON MOBILES\nSmart Tech\nSRI HARI MOBILES\nOmega Mobile Point\nCarlcare Service\nI Star Mobiles\nSMART CARE SOLUTION\nKaviya Mobile\nSj mobiles panruti\nGiri Mobile accessories and Electronics\nStar Mobiles sales and service\nPulse Mobile Care Training institute\nGiri Mobile Acc Store\nV Service\nStar Mobile prt\nSri kumaran mobiles\nSTAR MOBILES\nS.V Mobile Service\nMi Store - Panruti (Sri Meenakshi Cellulars)\nMUBARAK MOBILES\nOmega Communication\nVAM SERVICES\nGreen Systems\nM-Tech Mobile Accessories & Service\nSri Meenakshi Jewellers And Cellulars\nSathya Enterprises Multibrand Mobile Showroom\nVAM SERVICES\nFone Galaxy Mobiles\nKishor max\nUdhayaa Mobiles & Electronics\nJJ MOBILES\nDeva Computers\nRS Communication\nBismi mobiles and computers\nSathya times & mobiles\nLakshmi Electronics\nThe Chennai Mobiles\nMobitool_panruti\nStarking mobile\nMLD MOBILES\nThiru moblies\nSathya Enterprises Jio Mart Digital Panruti\nPoorvika Mobiles Pvt Ltd\nSathya Agencies, Panruti - Electronics and Home Appliances Store\nRavi Mobile Service\nMobile Service in Panruti\nArulperumjothi mobile Service\nHappy mobile\nMohan Mobile Service\nV mobile care\nVAITHEESWARAN MOBILE\nSRI VELAVAN MOBILES AND ELECTRONICS\nBarathi Mobiles Sales and Service Center\nRaj Cellcom\nRytham Cell Sales & Service\nASLINA MOBILES\nAnu mobiles\nA2S COMMUNICATION\nVS Mobiles\nAmma mobile's vijay\nDazzle Mobile Service center\nI Tech Mobile Service Center\nEASHWER MOBILE SERVICE AND ACCESSORIES\nThaj Mobile Care\nS.A Mobile Care\nRescue mobiles - Motorola and Lenovo Authorized Service Centre\nNearby Mobiles\nMission Gadgets\nDr. Phone technologies\nPondy Mobiles\nMe service solutions\nYM-tech mobiles pvt service center\nSri Hari mobiles service center\nMathew Mobile Care\nMAze Technology\nFOX Mobile Accessories and Service\nKayal Communications\nvimal communication\nManoj Mobiles\nSky Mobile & Electronics\nAaron Mobile Care\nnpm mobile phone repair service centre\nR P MOBILE SERVICES\nJAZZ MOBILE SERVICE AND ACCESSORIES\nKS Mobile Sales & Service centre\nAnnai Mobiles\nAuthorised Samsung Service Center - Mobile Rescue\nVISHA MOBILE FIX\nRamana Communication\nA To Z Mobile Accessories\nMobiTek\nAPPLE IPHONE SERVICE CENTRE i-Tech\nK R PHONE SERVICE CENTRE\nApple Authorised Service Provider - iPlanet Care\nSairam mobile care\nMr.jee mobile service\nFriends Mobile\nSbk mobiles service centre\nSri sai mobile service\nNaveen mobile and service accessories\nMetro mobile sales & service"
  },
  {
    "id": "1788430656736-9jggs",
    "name": "initial msg taml",
    "passage": "வணக்கம் Sir/Madam, நான் Forge & Flint நிறுவனத்திலிருந்து அருள் பேசுகிறேன்.\n\nசிறிய மற்றும் வளர்ந்து வரும் வணிகங்கள் வாடிக்கையாளர் நிர்வாகம், பில்லிங், சரக்கு மேலாண்மை, இணையதளம் மற்றும் அன்றாட வணிக செயல்பாடுகளை சிறப்பாக நிர்வகிக்க நடைமுறை டிஜிட்டல் தீர்வுகளை வழங்குகிறோம்.\n\nxyxz பற்றி பார்த்தபோது, தொழில்நுட்பத்தின் மூலம் உங்கள் அன்றாட வணிகப் பணிகளை இன்னும் எளிதாகவும் திறமையாகவும் செய்யக்கூடிய சில வாய்ப்புகள் இருக்கலாம் என்று நினைத்தேன்.\n\nதற்போது உங்கள் வணிகத்தை எவ்வாறு நிர்வகித்து வருகிறீர்கள் என்பதைப் புரிந்துகொண்டு, எங்களால் எந்த வகையில் உதவ முடியும் என்பதைப் பற்றி தெரிந்துகொள்ள விரும்புகிறேன்.\n\nஇந்த வாரம் 10 நிமிடங்கள் பேசுவதற்கு உங்களுக்கு வசதியான நேரம் இருக்குமா?",
    "marker": "xyxz",
    "seed": "Rainbow Mobiles\nPAVITHRA MOBILES MULTI BRAND MOBILE SERVICE CENTER\nMobishoppi\nHello Mobiles\nJAY MOBILES\nMobishoppi\nFalcon Applefix\nRJ MOBILE SERVICE CENTER\nMCD Communication\nSRI SELVA VINAYAGAR MOBILES OR SSV MOBILES\nUdhaya Cell Service\nvivo & iQOO Authorised Service Center\nMobile Care\nSamsung Customer Services\nSangeetha Gadgets - Cuddalore (Manjakuppam)\nTech Zone Mobiles\nXPRESS MOBILES\nA to Z mobile Accessories\nPoorvika Mobiles Cuddalore\nSATHYA ENTERPRISES\nFaas Mobile World\nSri bairavi mobile service in Cuddalore\nBikaner Cellulars\nAvengers Mobile\nReliance Digital\nNew JK Mobiles Cuddalore\nMatricx Mobiles\nJai Mobiles & Computers\nVVS MOBILE PLAZA\nB-AAD Cell Point\nR.B Mobiles\nJayam Mobiles Laptops\nSathya Agencies, Cuddalore - Electronics and Home Appliances Store\nGlobo Green\nVANI MOBILES\nMi Service Center\nBLUE MOON MOBILES\nSmart Tech\nSRI HARI MOBILES\nOmega Mobile Point\nCarlcare Service\nI Star Mobiles\nSMART CARE SOLUTION\nKaviya Mobile\nSj mobiles panruti\nGiri Mobile accessories and Electronics\nStar Mobiles sales and service\nPulse Mobile Care Training institute\nGiri Mobile Acc Store\nV Service\nStar Mobile prt\nSri kumaran mobiles\nSTAR MOBILES\nS.V Mobile Service\nMi Store - Panruti (Sri Meenakshi Cellulars)\nMUBARAK MOBILES\nOmega Communication\nVAM SERVICES\nGreen Systems\nM-Tech Mobile Accessories & Service\nSri Meenakshi Jewellers And Cellulars\nSathya Enterprises Multibrand Mobile Showroom\nVAM SERVICES\nFone Galaxy Mobiles\nKishor max\nUdhayaa Mobiles & Electronics\nJJ MOBILES\nDeva Computers\nRS Communication\nBismi mobiles and computers\nSathya times & mobiles\nLakshmi Electronics\nThe Chennai Mobiles\nMobitool_panruti\nStarking mobile\nMLD MOBILES\nThiru moblies\nSathya Enterprises Jio Mart Digital Panruti\nPoorvika Mobiles Pvt Ltd\nSathya Agencies, Panruti - Electronics and Home Appliances Store\nRavi Mobile Service\nMobile Service in Panruti\nArulperumjothi mobile Service\nHappy mobile\nMohan Mobile Service\nV mobile care\nVAITHEESWARAN MOBILE\nSRI VELAVAN MOBILES AND ELECTRONICS\nBarathi Mobiles Sales and Service Center\nRaj Cellcom\nRytham Cell Sales & Service\nASLINA MOBILES\nAnu mobiles\nA2S COMMUNICATION\nVS Mobiles\nAmma mobile's vijay\nDazzle Mobile Service center\nI Tech Mobile Service Center\nEASHWER MOBILE SERVICE AND ACCESSORIES\nThaj Mobile Care\nS.A Mobile Care\nRescue mobiles - Motorola and Lenovo Authorized Service Centre\nNearby Mobiles\nMission Gadgets\nDr. Phone technologies\nPondy Mobiles\nMe service solutions\nYM-tech mobiles pvt service center\nSri Hari mobiles service center\nMathew Mobile Care\nMAze Technology\nFOX Mobile Accessories and Service\nKayal Communications\nvimal communication\nManoj Mobiles\nSky Mobile & Electronics\nAaron Mobile Care\nnpm mobile phone repair service centre\nR P MOBILE SERVICES\nJAZZ MOBILE SERVICE AND ACCESSORIES\nKS Mobile Sales & Service centre\nAnnai Mobiles\nAuthorised Samsung Service Center - Mobile Rescue\nVISHA MOBILE FIX\nRamana Communication\nA To Z Mobile Accessories\nMobiTek\nAPPLE IPHONE SERVICE CENTRE i-Tech\nK R PHONE SERVICE CENTRE\nApple Authorised Service Provider - iPlanet Care\nSairam mobile care\nMr.jee mobile service\nFriends Mobile\nSbk mobiles service centre\nSri sai mobile service\nNaveen mobile and service accessories\nMetro mobile sales & service"
  },
  {
    "id": "1788430756955-gluxg",
    "name": "follow up - 1 eng",
    "passage": "Hi Sir/Madam, just following up on my previous message.\n\nI wanted to understand how you currently manage your customers, billing, inventory and day-to-day business operations at xyzzzz.\n\nIf you're available, I'd be happy to have a quick 10-minute call sometime this week.",
    "marker": "xyzzzz",
    "seed": "Rainbow Mobiles\nPAVITHRA MOBILES MULTI BRAND MOBILE SERVICE CENTER\nMobishoppi\nHello Mobiles\nJAY MOBILES\nMobishoppi\nFalcon Applefix\nRJ MOBILE SERVICE CENTER\nMCD Communication\nSRI SELVA VINAYAGAR MOBILES OR SSV MOBILES\nUdhaya Cell Service\nvivo & iQOO Authorised Service Center\nMobile Care\nSamsung Customer Services\nSangeetha Gadgets - Cuddalore (Manjakuppam)\nTech Zone Mobiles\nXPRESS MOBILES\nA to Z mobile Accessories\nPoorvika Mobiles Cuddalore\nSATHYA ENTERPRISES\nFaas Mobile World\nSri bairavi mobile service in Cuddalore\nBikaner Cellulars\nAvengers Mobile\nReliance Digital\nNew JK Mobiles Cuddalore\nMatricx Mobiles\nJai Mobiles & Computers\nVVS MOBILE PLAZA\nB-AAD Cell Point\nR.B Mobiles\nJayam Mobiles Laptops\nSathya Agencies, Cuddalore - Electronics and Home Appliances Store\nGlobo Green\nVANI MOBILES\nMi Service Center\nBLUE MOON MOBILES\nSmart Tech\nSRI HARI MOBILES\nOmega Mobile Point\nCarlcare Service\nI Star Mobiles\nSMART CARE SOLUTION\nKaviya Mobile\nSj mobiles panruti\nGiri Mobile accessories and Electronics\nStar Mobiles sales and service\nPulse Mobile Care Training institute\nGiri Mobile Acc Store\nV Service\nStar Mobile prt\nSri kumaran mobiles\nSTAR MOBILES\nS.V Mobile Service\nMi Store - Panruti (Sri Meenakshi Cellulars)\nMUBARAK MOBILES\nOmega Communication\nVAM SERVICES\nGreen Systems\nM-Tech Mobile Accessories & Service\nSri Meenakshi Jewellers And Cellulars\nSathya Enterprises Multibrand Mobile Showroom\nVAM SERVICES\nFone Galaxy Mobiles\nKishor max\nUdhayaa Mobiles & Electronics\nJJ MOBILES\nDeva Computers\nRS Communication\nBismi mobiles and computers\nSathya times & mobiles\nLakshmi Electronics\nThe Chennai Mobiles\nMobitool_panruti\nStarking mobile\nMLD MOBILES\nThiru moblies\nSathya Enterprises Jio Mart Digital Panruti\nPoorvika Mobiles Pvt Ltd\nSathya Agencies, Panruti - Electronics and Home Appliances Store\nRavi Mobile Service\nMobile Service in Panruti\nArulperumjothi mobile Service\nHappy mobile\nMohan Mobile Service\nV mobile care\nVAITHEESWARAN MOBILE\nSRI VELAVAN MOBILES AND ELECTRONICS\nBarathi Mobiles Sales and Service Center\nRaj Cellcom\nRytham Cell Sales & Service\nASLINA MOBILES\nAnu mobiles\nA2S COMMUNICATION\nVS Mobiles\nAmma mobile's vijay\nDazzle Mobile Service center\nI Tech Mobile Service Center\nEASHWER MOBILE SERVICE AND ACCESSORIES\nThaj Mobile Care\nS.A Mobile Care\nRescue mobiles - Motorola and Lenovo Authorized Service Centre\nNearby Mobiles\nMission Gadgets\nDr. Phone technologies\nPondy Mobiles\nMe service solutions\nYM-tech mobiles pvt service center\nSri Hari mobiles service center\nMathew Mobile Care\nMAze Technology\nFOX Mobile Accessories and Service\nKayal Communications\nvimal communication\nManoj Mobiles\nSky Mobile & Electronics\nAaron Mobile Care\nnpm mobile phone repair service centre\nR P MOBILE SERVICES\nJAZZ MOBILE SERVICE AND ACCESSORIES\nKS Mobile Sales & Service centre\nAnnai Mobiles\nAuthorised Samsung Service Center - Mobile Rescue\nVISHA MOBILE FIX\nRamana Communication\nA To Z Mobile Accessories\nMobiTek\nAPPLE IPHONE SERVICE CENTRE i-Tech\nK R PHONE SERVICE CENTRE\nApple Authorised Service Provider - iPlanet Care\nSairam mobile care\nMr.jee mobile service\nFriends Mobile\nSbk mobiles service centre\nSri sai mobile service\nNaveen mobile and service accessories\nMetro mobile sales & service"
  },
  {
    "id": "1788430869771-ee4d9",
    "name": "follow up -1 tam",
    "passage": "வணக்கம் Sir/Madam, முன்பு அனுப்பிய செய்தியைத் தொடர்ந்து தொடர்பு கொள்கிறேன்.\n\nxyzzz -ல் தற்போது வாடிக்கையாளர்கள், பில்லிங், சரக்கு மற்றும் அன்றாட வணிக செயல்பாடுகளை எவ்வாறு நிர்வகித்து வருகிறீர்கள் என்பதைப் புரிந்துகொள்ள விரும்புகிறேன்.\n\nஉங்களுக்கு வசதியாக இருந்தால், இந்த வாரம் 10 நிமிடங்கள் சுருக்கமாக பேசலாம்.",
    "marker": "xyzzz",
    "seed": "Rainbow Mobiles\nPAVITHRA MOBILES MULTI BRAND MOBILE SERVICE CENTER\nMobishoppi\nHello Mobiles\nJAY MOBILES\nMobishoppi\nFalcon Applefix\nRJ MOBILE SERVICE CENTER\nMCD Communication\nSRI SELVA VINAYAGAR MOBILES OR SSV MOBILES\nUdhaya Cell Service\nvivo & iQOO Authorised Service Center\nMobile Care\nSamsung Customer Services\nSangeetha Gadgets - Cuddalore (Manjakuppam)\nTech Zone Mobiles\nXPRESS MOBILES\nA to Z mobile Accessories\nPoorvika Mobiles Cuddalore\nSATHYA ENTERPRISES\nFaas Mobile World\nSri bairavi mobile service in Cuddalore\nBikaner Cellulars\nAvengers Mobile\nReliance Digital\nNew JK Mobiles Cuddalore\nMatricx Mobiles\nJai Mobiles & Computers\nVVS MOBILE PLAZA\nB-AAD Cell Point\nR.B Mobiles\nJayam Mobiles Laptops\nSathya Agencies, Cuddalore - Electronics and Home Appliances Store\nGlobo Green\nVANI MOBILES\nMi Service Center\nBLUE MOON MOBILES\nSmart Tech\nSRI HARI MOBILES\nOmega Mobile Point\nCarlcare Service\nI Star Mobiles\nSMART CARE SOLUTION\nKaviya Mobile\nSj mobiles panruti\nGiri Mobile accessories and Electronics\nStar Mobiles sales and service\nPulse Mobile Care Training institute\nGiri Mobile Acc Store\nV Service\nStar Mobile prt\nSri kumaran mobiles\nSTAR MOBILES\nS.V Mobile Service\nMi Store - Panruti (Sri Meenakshi Cellulars)\nMUBARAK MOBILES\nOmega Communication\nVAM SERVICES\nGreen Systems\nM-Tech Mobile Accessories & Service\nSri Meenakshi Jewellers And Cellulars\nSathya Enterprises Multibrand Mobile Showroom\nVAM SERVICES\nFone Galaxy Mobiles\nKishor max\nUdhayaa Mobiles & Electronics\nJJ MOBILES\nDeva Computers\nRS Communication\nBismi mobiles and computers\nSathya times & mobiles\nLakshmi Electronics\nThe Chennai Mobiles\nMobitool_panruti\nStarking mobile\nMLD MOBILES\nThiru moblies\nSathya Enterprises Jio Mart Digital Panruti\nPoorvika Mobiles Pvt Ltd\nSathya Agencies, Panruti - Electronics and Home Appliances Store\nRavi Mobile Service\nMobile Service in Panruti\nArulperumjothi mobile Service\nHappy mobile\nMohan Mobile Service\nV mobile care\nVAITHEESWARAN MOBILE\nSRI VELAVAN MOBILES AND ELECTRONICS\nBarathi Mobiles Sales and Service Center\nRaj Cellcom\nRytham Cell Sales & Service\nASLINA MOBILES\nAnu mobiles\nA2S COMMUNICATION\nVS Mobiles\nAmma mobile's vijay\nDazzle Mobile Service center\nI Tech Mobile Service Center\nEASHWER MOBILE SERVICE AND ACCESSORIES\nThaj Mobile Care\nS.A Mobile Care\nRescue mobiles - Motorola and Lenovo Authorized Service Centre\nNearby Mobiles\nMission Gadgets\nDr. Phone technologies\nPondy Mobiles\nMe service solutions\nYM-tech mobiles pvt service center\nSri Hari mobiles service center\nMathew Mobile Care\nMAze Technology\nFOX Mobile Accessories and Service\nKayal Communications\nvimal communication\nManoj Mobiles\nSky Mobile & Electronics\nAaron Mobile Care\nnpm mobile phone repair service centre\nR P MOBILE SERVICES\nJAZZ MOBILE SERVICE AND ACCESSORIES\nKS Mobile Sales & Service centre\nAnnai Mobiles\nAuthorised Samsung Service Center - Mobile Rescue\nVISHA MOBILE FIX\nRamana Communication\nA To Z Mobile Accessories\nMobiTek\nAPPLE IPHONE SERVICE CENTRE i-Tech\nK R PHONE SERVICE CENTRE\nApple Authorised Service Provider - iPlanet Care\nSairam mobile care\nMr.jee mobile service\nFriends Mobile\nSbk mobiles service centre\nSri sai mobile service\nNaveen mobile and service accessories\nMetro mobile sales & service"
  },
  {
    "id": "1788430960363-r3xj4",
    "name": "follow-up - final eng",
    "passage": "Hi xyz , just one last follow-up from my side.\n\nIf you're looking to improve any part of your business management, billing, inventory, customer handling or online presence, I'd be happy to understand your requirements and see if we can help.\n\nIf this isn't something you're looking for right now, no problem at all.",
    "marker": "xyz",
    "seed": "Rainbow Mobiles\nPAVITHRA MOBILES MULTI BRAND MOBILE SERVICE CENTER\nMobishoppi\nHello Mobiles\nJAY MOBILES\nMobishoppi\nFalcon Applefix\nRJ MOBILE SERVICE CENTER\nMCD Communication\nSRI SELVA VINAYAGAR MOBILES OR SSV MOBILES\nUdhaya Cell Service\nvivo & iQOO Authorised Service Center\nMobile Care\nSamsung Customer Services\nSangeetha Gadgets - Cuddalore (Manjakuppam)\nTech Zone Mobiles\nXPRESS MOBILES\nA to Z mobile Accessories\nPoorvika Mobiles Cuddalore\nSATHYA ENTERPRISES\nFaas Mobile World\nSri bairavi mobile service in Cuddalore\nBikaner Cellulars\nAvengers Mobile\nReliance Digital\nNew JK Mobiles Cuddalore\nMatricx Mobiles\nJai Mobiles & Computers\nVVS MOBILE PLAZA\nB-AAD Cell Point\nR.B Mobiles\nJayam Mobiles Laptops\nSathya Agencies, Cuddalore - Electronics and Home Appliances Store\nGlobo Green\nVANI MOBILES\nMi Service Center\nBLUE MOON MOBILES\nSmart Tech\nSRI HARI MOBILES\nOmega Mobile Point\nCarlcare Service\nI Star Mobiles\nSMART CARE SOLUTION\nKaviya Mobile\nSj mobiles panruti\nGiri Mobile accessories and Electronics\nStar Mobiles sales and service\nPulse Mobile Care Training institute\nGiri Mobile Acc Store\nV Service\nStar Mobile prt\nSri kumaran mobiles\nSTAR MOBILES\nS.V Mobile Service\nMi Store - Panruti (Sri Meenakshi Cellulars)\nMUBARAK MOBILES\nOmega Communication\nVAM SERVICES\nGreen Systems\nM-Tech Mobile Accessories & Service\nSri Meenakshi Jewellers And Cellulars\nSathya Enterprises Multibrand Mobile Showroom\nVAM SERVICES\nFone Galaxy Mobiles\nKishor max\nUdhayaa Mobiles & Electronics\nJJ MOBILES\nDeva Computers\nRS Communication\nBismi mobiles and computers\nSathya times & mobiles\nLakshmi Electronics\nThe Chennai Mobiles\nMobitool_panruti\nStarking mobile\nMLD MOBILES\nThiru moblies\nSathya Enterprises Jio Mart Digital Panruti\nPoorvika Mobiles Pvt Ltd\nSathya Agencies, Panruti - Electronics and Home Appliances Store\nRavi Mobile Service\nMobile Service in Panruti\nArulperumjothi mobile Service\nHappy mobile\nMohan Mobile Service\nV mobile care\nVAITHEESWARAN MOBILE\nSRI VELAVAN MOBILES AND ELECTRONICS\nBarathi Mobiles Sales and Service Center\nRaj Cellcom\nRytham Cell Sales & Service\nASLINA MOBILES\nAnu mobiles\nA2S COMMUNICATION\nVS Mobiles\nAmma mobile's vijay\nDazzle Mobile Service center\nI Tech Mobile Service Center\nEASHWER MOBILE SERVICE AND ACCESSORIES\nThaj Mobile Care\nS.A Mobile Care\nRescue mobiles - Motorola and Lenovo Authorized Service Centre\nNearby Mobiles\nMission Gadgets\nDr. Phone technologies\nPondy Mobiles\nMe service solutions\nYM-tech mobiles pvt service center\nSri Hari mobiles service center\nMathew Mobile Care\nMAze Technology\nFOX Mobile Accessories and Service\nKayal Communications\nvimal communication\nManoj Mobiles\nSky Mobile & Electronics\nAaron Mobile Care\nnpm mobile phone repair service centre\nR P MOBILE SERVICES\nJAZZ MOBILE SERVICE AND ACCESSORIES\nKS Mobile Sales & Service centre\nAnnai Mobiles\nAuthorised Samsung Service Center - Mobile Rescue\nVISHA MOBILE FIX\nRamana Communication\nA To Z Mobile Accessories\nMobiTek\nAPPLE IPHONE SERVICE CENTRE i-Tech\nK R PHONE SERVICE CENTRE\nApple Authorised Service Provider - iPlanet Care\nSairam mobile care\nMr.jee mobile service\nFriends Mobile\nSbk mobiles service centre\nSri sai mobile service\nNaveen mobile and service accessories\nMetro mobile sales & service"
  },
  {
    "id": "1788431030539-9cdsu",
    "name": "follow up_final -tamil",
    "passage": "வணக்கம் xyz, என்னுடைய தரப்பிலிருந்து இது ஒரு இறுதி follow-up.\n\nஉங்கள் வணிக நிர்வாகம், பில்லிங், சரக்கு மேலாண்மை, வாடிக்கையாளர் நிர்வாகம் அல்லது ஆன்லைன் செயல்பாடுகளில் ஏதேனும் பகுதியை மேம்படுத்த திட்டமிட்டு இருந்தால், உங்கள் தேவைகளைப் புரிந்துகொண்டு எங்களால் உதவ முடியுமா என்பதைப் பற்றி பேச விரும்புகிறேன்.\n\nதற்போது இதற்கான தேவை இல்லை என்றாலும் பரவாயில்லை.",
    "marker": "xyz",
    "seed": "Rainbow Mobiles\nPAVITHRA MOBILES MULTI BRAND MOBILE SERVICE CENTER\nMobishoppi\nHello Mobiles\nJAY MOBILES\nMobishoppi\nFalcon Applefix\nRJ MOBILE SERVICE CENTER\nMCD Communication\nSRI SELVA VINAYAGAR MOBILES OR SSV MOBILES\nUdhaya Cell Service\nvivo & iQOO Authorised Service Center\nMobile Care\nSamsung Customer Services\nSangeetha Gadgets - Cuddalore (Manjakuppam)\nTech Zone Mobiles\nXPRESS MOBILES\nA to Z mobile Accessories\nPoorvika Mobiles Cuddalore\nSATHYA ENTERPRISES\nFaas Mobile World\nSri bairavi mobile service in Cuddalore\nBikaner Cellulars\nAvengers Mobile\nReliance Digital\nNew JK Mobiles Cuddalore\nMatricx Mobiles\nJai Mobiles & Computers\nVVS MOBILE PLAZA\nB-AAD Cell Point\nR.B Mobiles\nJayam Mobiles Laptops\nSathya Agencies, Cuddalore - Electronics and Home Appliances Store\nGlobo Green\nVANI MOBILES\nMi Service Center\nBLUE MOON MOBILES\nSmart Tech\nSRI HARI MOBILES\nOmega Mobile Point\nCarlcare Service\nI Star Mobiles\nSMART CARE SOLUTION\nKaviya Mobile\nSj mobiles panruti\nGiri Mobile accessories and Electronics\nStar Mobiles sales and service\nPulse Mobile Care Training institute\nGiri Mobile Acc Store\nV Service\nStar Mobile prt\nSri kumaran mobiles\nSTAR MOBILES\nS.V Mobile Service\nMi Store - Panruti (Sri Meenakshi Cellulars)\nMUBARAK MOBILES\nOmega Communication\nVAM SERVICES\nGreen Systems\nM-Tech Mobile Accessories & Service\nSri Meenakshi Jewellers And Cellulars\nSathya Enterprises Multibrand Mobile Showroom\nVAM SERVICES\nFone Galaxy Mobiles\nKishor max\nUdhayaa Mobiles & Electronics\nJJ MOBILES\nDeva Computers\nRS Communication\nBismi mobiles and computers\nSathya times & mobiles\nLakshmi Electronics\nThe Chennai Mobiles\nMobitool_panruti\nStarking mobile\nMLD MOBILES\nThiru moblies\nSathya Enterprises Jio Mart Digital Panruti\nPoorvika Mobiles Pvt Ltd\nSathya Agencies, Panruti - Electronics and Home Appliances Store\nRavi Mobile Service\nMobile Service in Panruti\nArulperumjothi mobile Service\nHappy mobile\nMohan Mobile Service\nV mobile care\nVAITHEESWARAN MOBILE\nSRI VELAVAN MOBILES AND ELECTRONICS\nBarathi Mobiles Sales and Service Center\nRaj Cellcom\nRytham Cell Sales & Service\nASLINA MOBILES\nAnu mobiles\nA2S COMMUNICATION\nVS Mobiles\nAmma mobile's vijay\nDazzle Mobile Service center\nI Tech Mobile Service Center\nEASHWER MOBILE SERVICE AND ACCESSORIES\nThaj Mobile Care\nS.A Mobile Care\nRescue mobiles - Motorola and Lenovo Authorized Service Centre\nNearby Mobiles\nMission Gadgets\nDr. Phone technologies\nPondy Mobiles\nMe service solutions\nYM-tech mobiles pvt service center\nSri Hari mobiles service center\nMathew Mobile Care\nMAze Technology\nFOX Mobile Accessories and Service\nKayal Communications\nvimal communication\nManoj Mobiles\nSky Mobile & Electronics\nAaron Mobile Care\nnpm mobile phone repair service centre\nR P MOBILE SERVICES\nJAZZ MOBILE SERVICE AND ACCESSORIES\nKS Mobile Sales & Service centre\nAnnai Mobiles\nAuthorised Samsung Service Center - Mobile Rescue\nVISHA MOBILE FIX\nRamana Communication\nA To Z Mobile Accessories\nMobiTek\nAPPLE IPHONE SERVICE CENTRE i-Tech\nK R PHONE SERVICE CENTRE\nApple Authorised Service Provider - iPlanet Care\nSairam mobile care\nMr.jee mobile service\nFriends Mobile\nSbk mobiles service centre\nSri sai mobile service\nNaveen mobile and service accessories\nMetro mobile sales & service"
  }
];

// Templates are shared across both panels and saved in this browser only
// (localStorage) — nothing is uploaded anywhere.
const TemplateStore = (() => {
  const KEY = "swapsheet:templates";
  const SEEDED_KEY = "swapsheet:defaultsSeeded";
  let listeners = [];

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (err) {
      return [];
    }
  }

  function save(list) {
    try {
      localStorage.setItem(KEY, JSON.stringify(list));
    } catch (err) {
      // Storage unavailable (private browsing, quota, etc.) — templates
      // just won't persist for this session; the rest of the app still works.
    }
    listeners.forEach((fn) => fn(list));
  }

  return {
    all() {
      return load();
    },
    add(template) {
      const list = load();
      list.push({ id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, ...template });
      save(list);
    },
    remove(id) {
      save(load().filter((t) => t.id !== id));
    },
    onChange(fn) {
      listeners.push(fn);
    },
    // Runs once ever per browser: if the built-in defaults haven't been
    // loaded in yet, add them. Marking SEEDED_KEY (not "list is empty")
    // means deleting all templates later doesn't bring them back.
    ensureSeeded() {
      let seeded;
      try {
        seeded = localStorage.getItem(SEEDED_KEY);
      } catch (err) {
        return;
      }
      if (seeded) return;
      const list = load();
      DEFAULT_TEMPLATES.forEach((t) => {
        if (!list.some((existing) => existing.id === t.id)) list.push(t);
      });
      save(list);
      try {
        localStorage.setItem(SEEDED_KEY, "1");
      } catch (err) {
        // ignore
      }
    },
  };
})();

TemplateStore.ensureSeeded();

function initPanel(panelEl) {
  const state = {
    template: "",
    marker: null,
    options: [],
    optionRanges: [],
    activeIndex: null,
  };

  const copyBtn = panelEl.querySelector(".copy-btn");
  const statusEl = panelEl.querySelector(".status");
  const passageBox = panelEl.querySelector(".passage-box");
  const markerSelect = panelEl.querySelector(".marker-select");
  const seedBox = panelEl.querySelector(".seed-box");
  const prevBtn = panelEl.querySelector(".prev-btn");
  const nextBtn = panelEl.querySelector(".next-btn");
  const currentWordEl = panelEl.querySelector(".current-word");
  const templateSelect = panelEl.querySelector(".template-select");
  const templateSaveBtn = panelEl.querySelector(".template-save-btn");
  const templateDeleteBtn = panelEl.querySelector(".template-delete-btn");

  function showStatus(message) {
    statusEl.textContent = message;
    clearTimeout(showStatus._t);
    showStatus._t = setTimeout(() => {
      statusEl.textContent = "";
    }, 2000);
  }

  function renderPreview() {
    if (state.marker === null || state.activeIndex === null) {
      passageBox.value = state.template;
    } else {
      const value = state.options[state.activeIndex];
      const pattern = new RegExp(`\\b${escapeRegExp(state.marker)}\\b`, "g");
      passageBox.value = state.template.replace(pattern, () => value);
    }
  }

  function updateCycleControl() {
    const hasOptions = state.options.length > 0;
    prevBtn.disabled = !hasOptions;
    nextBtn.disabled = !hasOptions;
    currentWordEl.textContent = hasOptions
      ? state.activeIndex === null
        ? `${state.options.length} option${state.options.length === 1 ? "" : "s"} — click ▶ or click a line below`
        : `${state.options[state.activeIndex]} (${state.activeIndex + 1}/${state.options.length})`
      : "No options yet";
    seedBox.classList.toggle("has-active", state.activeIndex !== null);
  }

  function setActive(index) {
    state.activeIndex = index;
    renderPreview();
    updateCycleControl();
  }

  function cycle(step) {
    if (state.options.length === 0) return;
    const base = state.activeIndex === null ? (step > 0 ? -1 : 0) : state.activeIndex;
    const next = (base + step + state.options.length) % state.options.length;
    setActive(next);
  }

  function recomputeOptions() {
    const previousValue =
      state.activeIndex !== null ? state.options[state.activeIndex] : null;

    const parsed = parseOptionsWithRanges(seedBox.value);
    state.options = parsed.map((p) => p.text);
    state.optionRanges = parsed.map((p) => ({ start: p.start, end: p.end }));

    const matchIndex =
      previousValue !== null ? state.options.indexOf(previousValue) : -1;
    if (matchIndex !== -1) {
      setActive(matchIndex);
    } else {
      state.activeIndex = null;
      renderPreview();
      updateCycleControl();
    }
  }

  function selectLineAtCaret() {
    const pos = seedBox.selectionStart;
    const idx = state.optionRanges.findIndex(
      (r) => pos >= r.start && pos <= r.end
    );
    if (idx !== -1) setActive(idx);
  }

  function rebuildMarkerUI() {
    const words = getDistinctWords(state.template);

    markerSelect.innerHTML = "";
    const placeholderOpt = document.createElement("option");
    placeholderOpt.value = "";
    placeholderOpt.disabled = true;
    placeholderOpt.textContent =
      words.length === 0 ? "Paste a passage first…" : "Choose word…";
    markerSelect.appendChild(placeholderOpt);

    words.forEach((word) => {
      const optionEl = document.createElement("option");
      optionEl.value = word;
      optionEl.textContent = word;
      markerSelect.appendChild(optionEl);
    });

    // Marker is reset whenever the underlying passage changes (see the
    // passage-box "input" handler) — a marker from a previous passage may
    // no longer make sense, so the user re-picks it for the new passage.
    state.marker = null;
    markerSelect.value = "";
    placeholderOpt.selected = true;
    renderPreview();
  }

  seedBox.addEventListener("input", recomputeOptions);
  // Click (or keyboard-move the caret) onto a line to make it the active
  // replacement — this box is both where you edit the list AND where you
  // pick from it, no separate list widget.
  seedBox.addEventListener("click", selectLineAtCaret);
  seedBox.addEventListener("keyup", (e) => {
    if (e.key.startsWith("Arrow") || e.key === "Home" || e.key === "End") {
      selectLineAtCaret();
    }
  });

  markerSelect.addEventListener("change", () => {
    state.marker = markerSelect.value === "" ? null : markerSelect.value;
    renderPreview();
  });

  prevBtn.addEventListener("click", () => cycle(-1));
  nextBtn.addEventListener("click", () => cycle(1));

  // Programmatic writes to passageBox.value (in renderPreview) don't fire
  // "input", so this only fires on genuine user typing/pasting — that's
  // what tells us the user is (re)defining the whole passage, at which
  // point the marker choice and any active replacement are stale.
  passageBox.addEventListener("input", () => {
    state.template = passageBox.value;
    state.activeIndex = null;
    rebuildMarkerUI();
    updateCycleControl();
  });

  copyBtn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(passageBox.value);
      showStatus("Copied!");
    } catch (err) {
      passageBox.focus();
      passageBox.select();
      showStatus("Selected — press Ctrl+C to copy.");
    }
  });

  function refreshTemplateOptions() {
    const templates = TemplateStore.all();
    const previousValue = templateSelect.value;

    templateSelect.innerHTML = "";
    const placeholderOpt = document.createElement("option");
    placeholderOpt.value = "";
    placeholderOpt.textContent =
      templates.length === 0 ? "No saved templates yet" : "Load a saved template…";
    templateSelect.appendChild(placeholderOpt);

    templates.forEach((t) => {
      const optionEl = document.createElement("option");
      optionEl.value = t.id;
      optionEl.textContent = t.name;
      templateSelect.appendChild(optionEl);
    });

    const stillExists = templates.some((t) => t.id === previousValue);
    templateSelect.value = stillExists ? previousValue : "";
    templateDeleteBtn.disabled = !stillExists;
  }

  templateSelect.addEventListener("change", () => {
    templateDeleteBtn.disabled = templateSelect.value === "";
    if (templateSelect.value === "") return;

    const template = TemplateStore.all().find((t) => t.id === templateSelect.value);
    if (!template) return;

    passageBox.value = template.passage;
    state.template = template.passage;
    rebuildMarkerUI();
    state.marker = template.marker;
    markerSelect.value = template.marker;
    seedBox.value = template.seed;
    recomputeOptions();
    showStatus(`Loaded "${template.name}"`);
  });

  templateSaveBtn.addEventListener("click", () => {
    if (!state.template.trim()) {
      showStatus("Paste a passage before saving a template.");
      return;
    }
    const suggested = state.template.trim().slice(0, 40);
    const name = window.prompt("Name this template:", suggested);
    if (!name || !name.trim()) return;

    TemplateStore.add({
      name: name.trim(),
      passage: state.template,
      marker: state.marker || "",
      seed: seedBox.value,
    });
    showStatus("Template saved!");
  });

  templateDeleteBtn.addEventListener("click", () => {
    if (!templateSelect.value) return;
    const template = TemplateStore.all().find((t) => t.id === templateSelect.value);
    if (template && window.confirm(`Delete template "${template.name}"?`)) {
      TemplateStore.remove(template.id);
    }
  });

  TemplateStore.onChange(refreshTemplateOptions);
  refreshTemplateOptions();

  updateCycleControl();
}

document.querySelectorAll(".panel").forEach(initPanel);

(function initGlobalTemplateTransfer() {
  const exportBtn = document.getElementById("exportTemplatesBtn");
  const importInput = document.getElementById("importTemplatesInput");
  const statusEl = document.getElementById("globalStatus");

  function showStatus(message) {
    statusEl.textContent = message;
    clearTimeout(showStatus._t);
    showStatus._t = setTimeout(() => {
      statusEl.textContent = "";
    }, 2500);
  }

  exportBtn.addEventListener("click", () => {
    const templates = TemplateStore.all();
    if (templates.length === 0) {
      showStatus("No templates saved yet.");
      return;
    }
    const blob = new Blob([JSON.stringify(templates, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "swapsheet-templates.json";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    showStatus(`Exported ${templates.length} template${templates.length === 1 ? "" : "s"}.`);
  });

  importInput.addEventListener("change", () => {
    const file = importInput.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      let incoming;
      try {
        incoming = JSON.parse(reader.result);
        if (!Array.isArray(incoming)) throw new Error("not an array");
      } catch (err) {
        showStatus("That file isn't a valid templates export.");
        importInput.value = "";
        return;
      }

      const existing = TemplateStore.all();
      const isDuplicate = (t) =>
        existing.some(
          (e) => e.name === t.name && e.passage === t.passage && e.seed === t.seed
        );

      let added = 0;
      incoming.forEach((t) => {
        if (
          t &&
          typeof t.name === "string" &&
          typeof t.passage === "string" &&
          typeof t.seed === "string" &&
          !isDuplicate(t)
        ) {
          TemplateStore.add({
            name: t.name,
            passage: t.passage,
            marker: typeof t.marker === "string" ? t.marker : "",
            seed: t.seed,
          });
          added += 1;
        }
      });

      showStatus(
        added === 0
          ? "Nothing new to import (already had these)."
          : `Imported ${added} template${added === 1 ? "" : "s"}.`
      );
      importInput.value = "";
    };
    reader.readAsText(file);
  });
})();
