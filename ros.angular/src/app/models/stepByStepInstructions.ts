export interface StepByStepInstructions {
  id?: number;
  recipeId?: number;
  /**
   * Which step number
   */
  stepNumber: number;

  /**
   * Step instructions
   */
  stepDescription: string;
  /**
   * Array of ingredient IDs used in this step
   */
  ingredients?: Array<number>;
  /**
   * Array of ingredient names (just strings) used in this step
   */
  equipment?: Array<string>;
}
