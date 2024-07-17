export type AssessmentQuestion = {
  assessmentId?: string;
  type?: string;
  data?: {
    question?: string;
    answer?: string;
    choices?: string[];
  };
  _id?: string;
  lastModifiedBy?: string;
  lastModifiedDate?: string;
  createdBy?: string;
  createdDate?: string;
};
