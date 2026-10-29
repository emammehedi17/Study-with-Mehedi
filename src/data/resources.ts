export type SubjectId = 'bangla' | 'english' | 'math' | 'science' | 'bgs';

export type ResourceCategory =
  | 'মানবণ্টন ও প্রশ্নকাঠামো'
  | 'বহুনির্বাচনি প্রশ্নোত্তর (MCQ)'
  | 'সংক্ষিপ্ত-উত্তর প্রশ্ন'
  | 'সৃজনশীল প্রশ্ন'
  | 'বর্ণনামূলক প্রশ্ন'
  | 'রচনামূলক প্রশ্নোত্তর'
  | 'Reading & Comprehension'
  | 'Grammar Practice'
  | 'Guided Writing'
  | 'মডেল টেস্ট ও প্রশ্নপত্র'
  | 'মডেল টেস্ট (উভয় বিষয়)';

export interface Subject {
  id: SubjectId;
  nameBn: string;
  nameEn: string;
  icon: 'BookOpen' | 'Languages' | 'Calculator' | 'FlaskConical' | 'Globe2';
  accentColor: 'violet' | 'blue' | 'emerald' | 'cyan' | 'amber';
  descriptionBn: string;
  descriptionEn: string;
}

export interface StudyResource {
  id: string;
  subjectId: SubjectId;
  sharedSubjects?: SubjectId[];
  serialNumber: number;
  title: string;
  category: ResourceCategory;
  url: string;
  questionRef?: string;
  keywords: string[];
}

export interface CreatorBranding {
  siteTitle: string;
  creatorName: string;
  email: string;
  facebookUrl: string;
  websiteUrl: string;
  classCaddyLinks: {
    home: string;
    about: string;
    contact: string;
    archives: string;
    studyPlan: string;
  };
}

export const CREATOR_BRANDING: CreatorBranding = {
  siteTitle: 'JSC Scholarship Exam Prep by Emam Mehedi',
  creatorName: 'Emam Mehedi',
  email: 'emammehedi17@gmail.com',
  facebookUrl: 'https://facebook.com/emammehedi17',
  websiteUrl: 'https://classcaddy.netlify.app/',
  classCaddyLinks: {
    home: 'https://classcaddy.netlify.app/',
    about: 'https://classcaddy.netlify.app/about',
    contact: 'https://classcaddy.netlify.app/contact',
    archives: 'https://classcaddy.netlify.app/archives',
    studyPlan: 'https://classcaddy.netlify.app/study_plan',
  },
};

export const SUBJECTS: Subject[] = [
  {
    id: 'bangla',
    nameBn: 'বাংলা',
    nameEn: 'Bangla',
    icon: 'BookOpen',
    accentColor: 'violet',
    descriptionBn: 'মানবণ্টন, বহুনির্বাচনি, সৃজনশীল, আনন্দপাঠ, নির্মিতি ও এক্সক্লুসিভ মডেল টেস্ট।',
    descriptionEn: 'Syllabus distribution, MCQ, CQ, Anandapath, Nirmiti & model tests.',
  },
  {
    id: 'english',
    nameBn: 'ইংরেজি',
    nameEn: 'English',
    icon: 'Languages',
    accentColor: 'blue',
    descriptionBn: 'Seen/Unseen Comprehension, Question No. 1–16 Grammar, Composition ও Model Test।',
    descriptionEn: 'Question-by-question practice (Q1–Q16), comprehension, grammar, writing & model tests.',
  },
  {
    id: 'math',
    nameBn: 'গণিত',
    nameEn: 'Mathematics',
    icon: 'Calculator',
    accentColor: 'emerald',
    descriptionBn: 'মানবণ্টন, বহুনির্বাচনি (MCQ), সংক্ষিপ্ত-উত্তর, সৃজনশীল প্রশ্ন ও সমাধান এবং মডেল টেস্ট।',
    descriptionEn: 'Mark distribution, MCQs, short-answer problems, creative math solutions & model tests.',
  },
  {
    id: 'science',
    nameBn: 'বিজ্ঞান',
    nameEn: 'Science',
    icon: 'FlaskConical',
    accentColor: 'cyan',
    descriptionBn: 'বিগত সালের প্রশ্নপত্র, বহুনির্বাচনি, সংক্ষিপ্ত ও সৃজনশীল প্রশ্নোত্তর এবং সমন্বিত মডেল টেস্ট।',
    descriptionEn: 'Past papers, MCQs, short & creative questions with solutions, plus top school model tests.',
  },
  {
    id: 'bgs',
    nameBn: 'বাংলাদেশ ও বিশ্বপরিচয়',
    nameEn: 'Bangladesh and Global Studies (BGS)',
    icon: 'Globe2',
    accentColor: 'amber',
    descriptionBn: 'মানবণ্টন, বহুনির্বাচনি, সংক্ষিপ্ত-উত্তর, সৃজনশীল প্রশ্ন ও সমাধান এবং সমন্বিত মডেল টেস্ট।',
    descriptionEn: 'Syllabus guide, MCQs, short & creative questions with answers, plus combined model tests.',
  },
];

export const STUDY_RESOURCES: StudyResource[] = [
  // ==========================================
  // Subject 1: বাংলা (Bangla) - 6 resources
  // ==========================================
  {
    id: 'bangla-01',
    subjectId: 'bangla',
    serialNumber: 1,
    title: 'মানবণ্টন, প্রশ্নকাঠামো ও বিগত সালের প্রশ্নপত্র (২০২৫)',
    category: 'মানবণ্টন ও প্রশ্নকাঠামো',
    url: 'https://drive.google.com/open?id=1PGwRpo6h03VmVVzxg0ypco4eGcp0k24G&usp=drive_copy',
    keywords: ['bangla', 'বাংলা', 'মানবণ্টন', 'প্রশ্নকাঠামো', 'বিগত সালের প্রশ্নপত্র', '২০২৫', '2025', 'syllabus', 'previous question'],
  },
  {
    id: 'bangla-02',
    subjectId: 'bangla',
    serialNumber: 2,
    title: 'বহুনির্বাচনি প্রশ্নোত্তর (MCQ)',
    category: 'বহুনির্বাচনি প্রশ্নোত্তর (MCQ)',
    url: 'https://drive.google.com/open?id=1XOBq6Kk9A4JonJnNBWNxBKDVmKIE99wT&usp=drive_copy',
    keywords: ['bangla', 'বাংলা', 'বহুনির্বাচনি', 'mcq', 'objective', 'প্রশ্নোত্তর'],
  },
  {
    id: 'bangla-03',
    subjectId: 'bangla',
    serialNumber: 3,
    title: 'সৃজনশীল প্রশ্নোত্তর',
    category: 'সৃজনশীল প্রশ্ন',
    url: 'https://drive.google.com/open?id=1SfkunmDQGZE7PYAhWsFMkEjNh_KvYmCr&usp=drive_copy',
    keywords: ['bangla', 'বাংলা', 'সৃজনশীল', 'cq', 'creative question', 'প্রশ্নোত্তর'],
  },
  {
    id: 'bangla-04',
    subjectId: 'bangla',
    serialNumber: 4,
    title: 'বর্ণনামূলক প্রশ্ন (আনন্দপাঠ)',
    category: 'বর্ণনামূলক প্রশ্ন',
    url: 'https://drive.google.com/open?id=1NAvR0UbZSFGF6a8Eg95yMh_Uiwhv0EfE&usp=drive_copy',
    keywords: ['bangla', 'বাংলা', 'বর্ণনামূলক', 'আনন্দপাঠ', 'anandapath', 'rapid reader', 'descriptive'],
  },
  {
    id: 'bangla-05',
    subjectId: 'bangla',
    serialNumber: 5,
    title: 'রচনামূলক প্রশ্নোত্তর (নির্মিতি)',
    category: 'রচনামূলক প্রশ্নোত্তর',
    url: 'https://drive.google.com/open?id=1LT1paUw2tr9eU9gR4td6GF7BmEeqo3lF&usp=drive_copy',
    keywords: ['bangla', 'বাংলা', 'রচনামূলক', 'নির্মিতি', 'nirmiti', 'essay', 'composition', 'চিঠি', 'সারাংশ', 'ভাবসম্প্রসারণ'],
  },
  {
    id: 'bangla-06',
    subjectId: 'bangla',
    serialNumber: 6,
    title: 'শীর্ষস্থানীয় স্কুলের প্রশ্নপত্র ও এক্সক্লুসিভ মডেল টেস্ট',
    category: 'মডেল টেস্ট ও প্রশ্নপত্র',
    url: 'https://drive.google.com/open?id=117p979gPD2u3vdvawByARlShjddHxq89&usp=drive_copy',
    keywords: ['bangla', 'বাংলা', 'শীর্ষস্থানীয় স্কুল', 'মডেল টেস্ট', 'model test', 'exclusive', 'প্রশ্নপত্র'],
  },

  // ==========================================
  // Subject 2: ইংরেজি (English) - 14 resources
  // ==========================================
  {
    id: 'english-01',
    subjectId: 'english',
    serialNumber: 1,
    title: 'মানবণ্টন, প্রশ্নকাঠামো ও বিগত সালের প্রশ্নপত্র (২০২৫)',
    category: 'মানবণ্টন ও প্রশ্নকাঠামো',
    url: 'https://drive.google.com/open?id=15wsmupMIaXdF-fhuLWETVYeZzAay8J8I&usp=drive_copy',
    keywords: ['english', 'ইংরেজি', 'মানবণ্টন', 'প্রশ্নকাঠামো', 'বিগত সালের প্রশ্নপত্র', '২০২৫', '2025', 'syllabus', 'marks distribution'],
  },
  {
    id: 'english-02',
    subjectId: 'english',
    serialNumber: 2,
    title: 'Question No. 1-4: Seen Comprehension',
    category: 'Reading & Comprehension',
    questionRef: 'Q1–4',
    url: 'https://drive.google.com/open?id=1umI1B7xYnjHAKwJneZ4qWdhpJOWHM-mQ&usp=drive_copy',
    keywords: ['english', 'ইংরেজি', 'question 1', 'question 2', 'question 3', 'question 4', '1-4', 'seen comprehension', 'passage'],
  },
  {
    id: 'english-03',
    subjectId: 'english',
    serialNumber: 3,
    title: 'Question No. 5-6: Unseen Comprehension',
    category: 'Reading & Comprehension',
    questionRef: 'Q5–6',
    url: 'https://drive.google.com/open?id=1fHYHqUrT34LyFgHM4Sy_lW4hUx54hlh6&usp=drive_copy',
    keywords: ['english', 'ইংরেজি', 'question 5', 'question 6', '5-6', 'unseen comprehension', 'information transfer', 'summary'],
  },
  {
    id: 'english-04',
    subjectId: 'english',
    serialNumber: 4,
    title: 'Question No. 7: Matching',
    category: 'Reading & Comprehension',
    questionRef: 'Q7',
    url: 'https://drive.google.com/open?id=1asZnu4iskGWicd19jXHgkHFaLPMApJ5y&usp=drive_copy',
    keywords: ['english', 'ইংরেজি', 'question 7', 'q7', 'matching', 'sentence matching', 'column'],
  },
  {
    id: 'english-05',
    subjectId: 'english',
    serialNumber: 5,
    title: 'Question No. 8: Answering Questions from Poems',
    category: 'Reading & Comprehension',
    questionRef: 'Q8',
    url: 'https://drive.google.com/open?id=1zyNiYbVFxPgEY5gZDnudpro1bfonAlmg&usp=drive_copy',
    keywords: ['english', 'ইংরেজি', 'question 8', 'q8', 'poems', 'answering questions from poems', 'poetry', 'কবিতা'],
  },
  {
    id: 'english-06',
    subjectId: 'english',
    serialNumber: 6,
    title: 'Question No. 9: Gap Filling Activities with Clues/without Clues',
    category: 'Grammar Practice',
    questionRef: 'Q9',
    url: 'https://drive.google.com/open?id=1GddUwaoPNYwE_36o-6fcKNKCKIPsCItr&usp=drive_copy',
    keywords: ['english', 'ইংরেজি', 'question 9', 'q9', 'gap filling', 'with clues', 'without clues', 'grammar', 'cloze test'],
  },
  {
    id: 'english-07',
    subjectId: 'english',
    serialNumber: 7,
    title: 'Question No. 10: Substitution Table',
    category: 'Grammar Practice',
    questionRef: 'Q10',
    url: 'https://drive.google.com/open?id=1EUvr958ZUjMtgXkBksBlvcQUuPqU-dyt&usp=drive_copy',
    keywords: ['english', 'ইংরেজি', 'question 10', 'q10', 'substitution table', 'grammar'],
  },
  {
    id: 'english-08',
    subjectId: 'english',
    serialNumber: 8,
    title: 'Question No. 11: Right Form of Verbs',
    category: 'Grammar Practice',
    questionRef: 'Q11',
    url: 'https://drive.google.com/open?id=1PGgkmehChoIElGJ_NW5eVWTj4mU-M5Rx&usp=drive_copy',
    keywords: ['english', 'ইংরেজি', 'question 11', 'q11', 'right form of verbs', 'verbs', 'tense', 'grammar'],
  },
  {
    id: 'english-09',
    subjectId: 'english',
    serialNumber: 9,
    title: 'Question No. 12: Changing Sentences',
    category: 'Grammar Practice',
    questionRef: 'Q12',
    url: 'https://drive.google.com/open?id=1HRIIDGtGSeN0pUuPkwCmGRjIwUK8mXw-&usp=drive_copy',
    keywords: ['english', 'ইংরেজি', 'question 12', 'q12', 'changing sentences', 'transformation of sentences', 'voice', 'degree', 'grammar'],
  },
  {
    id: 'english-10',
    subjectId: 'english',
    serialNumber: 10,
    title: 'Question No. 13: Punctuation and Capitalization',
    category: 'Grammar Practice',
    questionRef: 'Q13',
    url: 'https://drive.google.com/open?id=1epvlSkBg0h6TzEQIQ0PD148mLghFP9kA&usp=drive_copy',
    keywords: ['english', 'ইংরেজি', 'question 13', 'q13', 'punctuation', 'capitalization', 'grammar'],
  },
  {
    id: 'english-11',
    subjectId: 'english',
    serialNumber: 11,
    title: 'Question No. 14 & 14 (Or): Letter & E-mail',
    category: 'Guided Writing',
    questionRef: 'Q14',
    url: 'https://drive.google.com/open?id=1HXP4p_SqAnT4AcjblI7DQS8TivvvcyiW&usp=drive_copy',
    keywords: ['english', 'ইংরেজি', 'question 14', 'q14', 'letter', 'e-mail', 'email', 'writing', 'formal letter', 'informal letter'],
  },
  {
    id: 'english-12',
    subjectId: 'english',
    serialNumber: 12,
    title: 'Question No. 15 & 15 (Or): Completing Stories & Writing Dialogue',
    category: 'Guided Writing',
    questionRef: 'Q15',
    url: 'https://drive.google.com/open?id=1v91mXTWp7JMvqMCc7nRaDmBPv3RmQvcW&usp=drive_copy',
    keywords: ['english', 'ইংরেজি', 'question 15', 'q15', 'completing stories', 'story writing', 'writing dialogue', 'dialogue'],
  },
  {
    id: 'english-13',
    subjectId: 'english',
    serialNumber: 13,
    title: 'Question No. 16: Writing Composition',
    category: 'Guided Writing',
    questionRef: 'Q16',
    url: 'https://drive.google.com/open?id=1KWMNhFSBbQrPPN5D5fcf2eNN1C8q5Yfl&usp=drive_copy',
    keywords: ['english', 'ইংরেজি', 'question 16', 'q16', 'writing composition', 'essay', 'paragraph', 'composition'],
  },
  {
    id: 'english-14',
    subjectId: 'english',
    serialNumber: 14,
    title: 'এক্সক্লুসিভ মডেল প্রশ্নপত্র ও উত্তর',
    category: 'মডেল টেস্ট ও প্রশ্নপত্র',
    url: 'https://drive.google.com/open?id=1XI6jayRnDezJDcDtKsWAHAhP4yu8oFLB&usp=drive_copy',
    keywords: ['english', 'ইংরেজি', 'এক্সক্লুসিভ মডেল প্রশ্নপত্র ও উত্তর', 'model test', 'exclusive', 'solution'],
  },

  // ==========================================
  // Subject 3: গণিত (Mathematics) - 5 resources
  // ==========================================
  {
    id: 'math-01',
    subjectId: 'math',
    serialNumber: 1,
    title: 'মানবণ্টন, প্রশ্নকাঠামো ও বিগত সালের প্রশ্নপত্র (২০২৫)',
    category: 'মানবণ্টন ও প্রশ্নকাঠামো',
    url: 'https://drive.google.com/open?id=1PPcYAZeNN5CTrbVswCFPjnF5d7jr5YSN&usp=drive_copy',
    keywords: ['math', 'mathematics', 'গণিত', 'মানবণ্টন', 'প্রশ্নকাঠামো', 'বিগত সালের প্রশ্নপত্র', '২০২৫', '2025'],
  },
  {
    id: 'math-02',
    subjectId: 'math',
    serialNumber: 2,
    title: 'বহুনির্বাচনি প্রশ্নোত্তর (MCQ)',
    category: 'বহুনির্বাচনি প্রশ্নোত্তর (MCQ)',
    url: 'https://drive.google.com/open?id=1hBa6lNu90GOl5Ue1A2ZAupBUcDa0N3wf&usp=drive_copy',
    keywords: ['math', 'mathematics', 'গণিত', 'বহুনির্বাচনি', 'mcq', 'প্রশ্নোত্তর'],
  },
  {
    id: 'math-03',
    subjectId: 'math',
    serialNumber: 3,
    title: 'সংক্ষিপ্ত-উত্তর প্রশ্ন ও সমাধান',
    category: 'সংক্ষিপ্ত-উত্তর প্রশ্ন',
    url: 'https://drive.google.com/open?id=1X0xWAfzDjSt0fENuvaOmzfYiftC-tjdZ&usp=drive_copy',
    keywords: ['math', 'mathematics', 'গণিত', 'সংক্ষিপ্ত-উত্তর', 'short question', 'সমাধান', 'solution'],
  },
  {
    id: 'math-04',
    subjectId: 'math',
    serialNumber: 4,
    title: 'সৃজনশীল প্রশ্ন ও সমাধান',
    category: 'সৃজনশীল প্রশ্ন',
    url: 'https://drive.google.com/open?id=1tHwy03TZ-kDXaD9Q_qPbtgoIsSiRIPtq&usp=drive_copy',
    keywords: ['math', 'mathematics', 'গণিত', 'সৃজনশীল', 'cq', 'creative question', 'সমাধান'],
  },
  {
    id: 'math-05',
    subjectId: 'math',
    serialNumber: 5,
    title: 'শীর্ষস্থানীয় স্কুলের প্রশ্নপত্র ও এক্সক্লুসিভ মডেল টেস্ট',
    category: 'মডেল টেস্ট ও প্রশ্নপত্র',
    url: 'https://drive.google.com/open?id=1_P234_qJhwhy0KNPDAxB1bhvpVn6WqUQ&usp=drive_copy',
    keywords: ['math', 'mathematics', 'গণিত', 'শীর্ষস্থানীয় স্কুল', 'মডেল টেস্ট', 'model test'],
  },

  // ==========================================
  // Subject 4: বিজ্ঞান (Science) - 4 dedicated resources
  // ==========================================
  {
    id: 'science-01',
    subjectId: 'science',
    serialNumber: 1,
    title: 'মানবণ্টন, প্রশ্নকাঠামো ও বিগত সালের প্রশ্নপত্র (২০২৫)',
    category: 'মানবণ্টন ও প্রশ্নকাঠামো',
    url: 'https://drive.google.com/open?id=19WvwNap4S1wwh0er_gXJ1aOdfqB8kp3F&usp=drive_copy',
    keywords: ['science', 'বিজ্ঞান', 'মানবণ্টন', 'প্রশ্নকাঠামো', 'বিগত সালের প্রশ্নপত্র', '২০২৫', '2025'],
  },
  {
    id: 'science-02',
    subjectId: 'science',
    serialNumber: 2,
    title: 'বহুনির্বাচনি প্রশ্নোত্তর (MCQ)',
    category: 'বহুনির্বাচনি প্রশ্নোত্তর (MCQ)',
    url: 'https://drive.google.com/open?id=1t7ZJnff7kuhI0AtaKv0SHOSKlozu-4Vw&usp=drive_copy',
    keywords: ['science', 'বিজ্ঞান', 'বহুনির্বাচনি', 'mcq', 'প্রশ্নোত্তর'],
  },
  {
    id: 'science-03',
    subjectId: 'science',
    serialNumber: 3,
    title: 'সংক্ষিপ্ত-উত্তর প্রশ্ন ও সমাধান',
    category: 'সংক্ষিপ্ত-উত্তর প্রশ্ন',
    url: 'https://drive.google.com/open?id=1pG2KW4Bvm0TQCtUqJrxcpZCd2Btex6qt&usp=drive_copy',
    keywords: ['science', 'বিজ্ঞান', 'সংক্ষিপ্ত-উত্তর', 'short question', 'সমাধান'],
  },
  {
    id: 'science-04',
    subjectId: 'science',
    serialNumber: 4,
    title: 'সৃজনশীল প্রশ্ন ও সমাধান',
    category: 'সৃজনশীল প্রশ্ন',
    url: 'https://drive.google.com/open?id=1IbP1SgR9fwH7BejWC9XxGI6GiICqnmft&usp=drive_copy',
    keywords: ['science', 'বিজ্ঞান', 'সৃজনশীল', 'cq', 'creative question', 'সমাধান'],
  },

  // ==========================================
  // Subject 5: বাংলাদেশ ও বিশ্বপরিচয় (BGS) - 4 dedicated resources
  // ==========================================
  {
    id: 'bgs-01',
    subjectId: 'bgs',
    serialNumber: 1,
    title: 'মানবণ্টন, প্রশ্নকাঠামো ও বিগত সালের প্রশ্নপত্র (২০২৫)',
    category: 'মানবণ্টন ও প্রশ্নকাঠামো',
    url: 'https://drive.google.com/open?id=17yaCqa6rjOqq_IxyC6UYlCtJNaU2H1Z8&usp=drive_copy',
    keywords: ['bgs', 'বাংলাদেশ ও বিশ্বপরিচয়', 'বাওবি', 'মানবণ্টন', 'প্রশ্নকাঠামো', 'বিগত সালের প্রশ্নপত্র', '২০২৫', '2025'],
  },
  {
    id: 'bgs-02',
    subjectId: 'bgs',
    serialNumber: 2,
    title: 'বহুনির্বাচনি প্রশ্নোত্তর (MCQ)',
    category: 'বহুনির্বাচনি প্রশ্নোত্তর (MCQ)',
    url: 'https://drive.google.com/open?id=1nDfIP3Utj3hoypLnB0_vBZCjrm6vyQY9&usp=drive_copy',
    keywords: ['bgs', 'বাংলাদেশ ও বিশ্বপরিচয়', 'বাওবি', 'বহুনির্বাচনি', 'mcq', 'প্রশ্নোত্তর'],
  },
  {
    id: 'bgs-03',
    subjectId: 'bgs',
    serialNumber: 3,
    title: 'সংক্ষিপ্ত-উত্তর প্রশ্ন ও সমাধান',
    category: 'সংক্ষিপ্ত-উত্তর প্রশ্ন',
    url: 'https://drive.google.com/open?id=15RrEJdAhMryeh5ttpm6cVpKhnfoXOmvi&usp=drive_copy',
    keywords: ['bgs', 'বাংলাদেশ ও বিশ্বপরিচয়', 'বাওবি', 'সংক্ষিপ্ত-উত্তর', 'short question', 'সমাধান'],
  },
  {
    id: 'bgs-04',
    subjectId: 'bgs',
    serialNumber: 4,
    title: 'সৃজনশীল প্রশ্ন ও সমাধান',
    category: 'সৃজনশীল প্রশ্ন',
    url: 'https://drive.google.com/open?id=1X2krRNLD-VTwOfpzcnhsc-1pjpYHViL7&usp=drive_copy',
    keywords: ['bgs', 'বাংলাদেশ ও বিশ্বপরিচয়', 'বাওবি', 'সৃজনশীল', 'cq', 'creative question', 'সমাধান'],
  },

  // ==========================================
  // Shared Science and BGS Model Test - 1 unique resource
  // Accessible from both Science and BGS subject views
  // ==========================================
  {
    id: 'shared-science-bgs-model-test',
    subjectId: 'science',
    sharedSubjects: ['science', 'bgs'],
    serialNumber: 5,
    title: 'বিজ্ঞান ও বাওবি শীর্ষস্থানীয় স্কুলের প্রশ্নপত্র ও এক্সক্লুসিভ মডেল টেস্ট',
    category: 'মডেল টেস্ট (উভয় বিষয়)',
    url: 'https://drive.google.com/open?id=1cjjBmtEZSo8GvNoGmC8j6gUsXQAVH_GJ&usp=drive_copy',
    keywords: [
      'science',
      'bgs',
      'বিজ্ঞান',
      'বাওবি',
      'বাংলাদেশ ও বিশ্বপরিচয়',
      'শীর্ষস্থানীয় স্কুল',
      'মডেল টেস্ট',
      'উভয় বিষয়',
      'shared model test',
    ],
  },
];

/**
 * Helper to get all resources belonging to a specific subject
 * (includes shared resources where sharedSubjects contains subjectId).
 */
export function getResourcesBySubject(subjectId: SubjectId): StudyResource[] {
  return STUDY_RESOURCES.filter(
    (res) =>
      res.subjectId === subjectId ||
      (res.sharedSubjects && res.sharedSubjects.includes(subjectId))
  ).sort((a, b) => a.serialNumber - b.serialNumber);
}

/**
 * Extracts Google Drive File ID from a supplied URL
 * e.g. https://drive.google.com/open?id=1PGwRpo6h03VmVVzxg0ypco4eGcp0k24G&usp=drive_copy
 */
export function extractDriveFileId(url: string): string | null {
  try {
    const parsed = new URL(url);
    const idParam = parsed.searchParams.get('id');
    if (idParam) return idParam;
    const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    return match ? match[1] : null;
  } catch {
    const match = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    return match ? match[1] : null;
  }
}

/**
 * Generates an embeddable Google Drive preview URL from the original resource URL.
 */
export function getDrivePreviewUrl(url: string): string | null {
  const fileId = extractDriveFileId(url);
  if (!fileId) return null;
  return `https://drive.google.com/file/d/${fileId}/preview`;
}

/**
 * Returns subject object by SubjectId.
 */
export function getSubjectById(subjectId: SubjectId): Subject | undefined {
  return SUBJECTS.find((s) => s.id === subjectId);
}

/**
 * Dynamically calculates dataset statistics.
 */
export function getGlobalDatasetStats() {
  const totalSubjects = SUBJECTS.length;
  // Unique resources count (30)
  const uniqueResourceIds = new Set(STUDY_RESOURCES.map((r) => r.id));
  const totalUniqueResources = uniqueResourceIds.size;
  const totalPdfResources = STUDY_RESOURCES.filter((r) => Boolean(r.url)).length;
  // Total subject-level assignments (6 + 14 + 5 + 5 + 5 = 35 with shared appearing in both Science and BGS)
  const totalSubjectAssignments = SUBJECTS.reduce(
    (sum, subj) => sum + getResourcesBySubject(subj.id).length,
    0
  );

  return {
    totalSubjects,
    totalUniqueResources,
    totalPdfResources,
    totalSubjectAssignments,
  };
}

/**
 * Returns all unique categories present in a list of resources.
 */
export function getCategoriesForResources(resources: StudyResource[]): ResourceCategory[] {
  const seen = new Set<ResourceCategory>();
  resources.forEach((r) => seen.add(r.category));
  return Array.from(seen);
}
