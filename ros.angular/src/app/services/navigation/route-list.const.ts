import { IDictionary } from '@models/common.model';

export const CRouteList: IDictionary<string> = {
  account: 'account',
  login: 'account/login',
  register: 'account/register',

  savoury: 'savoury',
  ingredients: 'savoury/ingredients',
  ingredient: 'savoury/ingredients/item',

  recipes: 'savoury/recipes/browse',
  recipe: 'savoury/recipes/item'
};
