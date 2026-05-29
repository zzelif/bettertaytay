export function formatGovName(text: string, _type: 'department' | 'barangay') {
  if (!text) return '';

  // 1. Remove the "Noisy" prefixes
  const cleanText =
    _type === 'department'
      ? text.replace(/DEPARTMENT OF /gi, '').trim()
      : text.replace(/BARANGAY /gi, '').trim();

  // 2. Define words that should stay lowercase
  const minorWords = ['of', 'the', 'and', 'for', 'in', 'on', 'with'];

  // 3. Define acronyms that should stay uppercase
  const acronyms = [
    'GAD',
    'ICT',
    'HR',
    'BFP',
    'PNP',
    'MDRRMO',
    'MSWDO',
    'MPDC',
    'NDRRMC',
    'GSO',
    'DILG',
    'COA',
    'CCTV',
    'COMELEC',
    'I.T.',
    'SB',
    'MBSS',
    'TECH4ED',
    'MENRO',
    'BAC',
    'PLEB',
  ];

  return cleanText
    .toLowerCase()
    .split(' ')
    .map((word, index) => {
      // Strip out parentheses, commas, periods, etc., for the acronym check
      const cleanUpperWord = word.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();

      // If the cleaned word is an acronym, uppercase the entire original word (preserving punctuation)
      if (acronyms.includes(cleanUpperWord)) return word.toUpperCase();

      // Always capitalize the first word
      if (index === 0) return word.charAt(0).toUpperCase() + word.slice(1);

      // Keep minor words lowercase
      if (minorWords.includes(word)) return word;

      // Default Title Case
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
}

export function toTitleCase(text: string) {
  if (!text) return '';

  // Words that should stay lowercase
  const minorWords = ['of', 'and', 'the', 'in', 'for', 'on', 'with'];
  // Acronyms that should stay uppercase
  const acronyms = [
    'GAD',
    'BPLO',
    'MDRRMO',
    'ICT',
    'MSWDO',
    'MPDC',
    'HR',
    'BFP',
    'PNP',
    'RHU',
    'NDRRMC',
    'GSO',
    'DILG',
    'COA',
    'CCTV',
    'COMELEC',
    'I.T.',
    'SB',
    'MBSS',
    'TECH4ED',
    'MENRO',
    'BAC',
    'MADAC',
    'LCR',
    'EEDM',
    'NTPM',
    'LEDIPO',
    'MESU',
    'MISSO',
    'OSCA',
    'OTPM',
    'PLEB',
    'PDAO',
    'MPDO',
    'LPRAO',
    'MPSD',
    'STACS',
    'STAG',
    'TMTFRO',
    'UPAO',
  ];

  return text
    .toLowerCase()
    .split(' ')
    .map((word, index) => {
      const upperWord = word.toUpperCase();

      // If it's an acronym, keep it all caps
      if (acronyms.includes(upperWord)) return upperWord;

      // If it's a minor word and not the first word, keep it lowercase
      if (minorWords.includes(word) && index !== 0) return word;

      // Capitalize first letter
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
}

export function getShortHotlineName(name: string) {
  const upperName = name.toUpperCase();
  if (upperName.includes('NATIONAL DISASTER RISK REDUCTION')) return 'NDRRMC';
  if (upperName.includes('PHILIPPINE NATIONAL POLICE') || upperName === 'PNP')
    return 'PNP';
  if (upperName.includes('BUREAU OF FIRE PROTECTION') || upperName === 'BFP')
    return 'BFP';
  if (upperName.includes('RED CROSS')) return 'Red Cross';
  if (upperName.includes('MENTAL HEALTH')) return 'Mental Health';
  if (upperName.includes('WOMEN') || upperName.includes('VAWC')) return 'VAWC';
  if (upperName.includes('COAST GUARD')) return 'Coast Guard';

  return name;
}
