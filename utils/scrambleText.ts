export const scrambleText = (text: string): string => {
    if (text.length < 5) {
      return text.split('').sort(() => 0.5 - Math.random()).join('');
    }
  
    let scrambled = text;
    const errorCount = Math.floor(text.length * 0.1); // 10% errors
  
    for (let i = 0; i < errorCount; i++) {
      const type = Math.random();
      const index = Math.floor(Math.random() * scrambled.length);
      const char = String.fromCharCode(97 + Math.floor(Math.random() * 26));
  
      if (type < 0.33 && scrambled.length > 1) {
        scrambled = scrambled.substring(0, index) + scrambled.substring(index + 1);
      } else if (type < 0.66) {
        scrambled = scrambled.substring(0, index) + char + scrambled.substring(index);
      } else {
        scrambled = scrambled.substring(0, index) + char + scrambled.substring(index + 1);
      }
    }
  
    return scrambled;
  };
  