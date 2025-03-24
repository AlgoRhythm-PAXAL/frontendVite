// Data derived from https://gs.statcounter.com/os-market-share/desktop/worldwide/2023
// And https://gs.statcounter.com/os-market-share/mobile/worldwide/2023
// And https://gs.statcounter.com/platform-market-share/desktop-mobile-tablet/worldwide/2023
// For the month of December 2023

export const desktopOS = [
    {
      label: 'Windows',
      value: 30.00,
    },
    {
      label: 'OS X',
      value: 16.38,
    },
    {
      label: 'Linux',
      value: 8.83,
    },
    {
      label: 'Chrome OS',
      value: 8.42,
    },
    {
      label: 'Other',
      value: 10,
    },
  ];
  
  
  
  export const platforms = [
    {
      label: 'Desktop',
      value: 40.88,
    },
  ];
  
  const normalize = (v, v2) => Number.parseFloat(((v * v2) / 100).toFixed(2));
  
  export const mobileAndDesktopOS = [
  
    ...desktopOS.map((v) => ({
      ...v,
      label: v.label === 'Other' ? 'Other (Desktop)' : v.label,
      value: normalize(v.value, platforms[0].value),
    })),
  ];
  
  export const valueFormatter = (item) => `${item.value}%`;
  