import  { useEffect} from 'react';

const GoogleTranslateButton = () => {


  useEffect(() => {
    const addGoogleTranslateScript = () => {
      const script = document.createElement('script');
      script.src =
        'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);
    };

    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        { pageLanguage: 'en', autoDisplay: false },
        'google_translate_element'
      );

      // Hide the Google branding text
      const googleBranding = document.querySelector('.VIpgJd-ZVi9od-l4eHX-hSRGPd');
      if (googleBranding) googleBranding.style.display = 'none';

      const poweredByText = document.querySelector('.goog-te-gadget span');
      if (poweredByText) {
        poweredByText.innerHTML = '<b>Google</b>';
      }

      const fontData = document.querySelector('.goog-te-combo');
      if(fontData){ 
        fontData.style.fontSize='7pt';
        fontData.addEventListener('change', (event) => {
          const selectedLanguage = event.target.value;
          console.log('Selected Language:', selectedLanguage);
        });
      }
    };

    addGoogleTranslateScript();
  }, []);

  return (
    <div className="relative">
      <div id="google_translate_element" className="hidden"></div>
    </div>
  );
};

export default GoogleTranslateButton;


