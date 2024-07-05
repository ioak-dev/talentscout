export type Resume = {
  id?: string;
  lastModifiedBy?: string;
  lastModifiedDate?: string;
  createdBy?: string;
  createdDate?: string;
  fileName?:string;
  data?: {
    name: string;
    currentDesignation?: string;
    standardizedDesignation?: string;
    overview?: string;
    totalExperience?: string;
    industryNormalizedExperience?: string;
    averageExperiencePerCompany?: string;
    longestExperience?: string;
    recentExperience?: string;
    technicalSkills?: any;
    domainSkills?: any;
    keyProject?: string;
    keyQuestionsToBeAsked?: any;
  };
};
