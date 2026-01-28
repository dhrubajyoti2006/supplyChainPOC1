export type ContextualModule = {
  title: string;
  stat: string;
  description: string;
  detail: string;
};

export type ContextualAnalysis = {
  entityName: string;
  contextAggregation: number;
  modules: ContextualModule[];
};
