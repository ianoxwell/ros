/* eslint-disable max-len */
import { PagedResult } from '@models/common.model';
import { Recipe } from '@models/recipe.model';

export const fakeRecipe1: Recipe = {
  numberOfServings: 8,
  priceEstimate: 0,
  priceServing: 0,
  recipeDishTags: [],
  recipeHealthLabels: [],
  recipeCuisineTypes: [],
  allergyWarnings: [],
  numberStars: 0,
  numberReviews: 0,
  numberFavourites: 0,
  numberOfTimesCooked: 0,
  id: 1,
  name: 'Fresh Strawberry Lemonade',
  readyInMinutes: 10,
  rawInstructions:
    'Add  cup sugar and 1 cup water in a small saucepan.\nHeat over medium high heat until sugar is dissolved. Stir occasionally.\nBlend strawberries in a blender with 2 cups of water.\nPour into a large pitcher. Add lemon juice to pitcher.\nAdd 1 cup of water and simple syrup.\nStir to blend.',
  sourceOfRecipeName: 'https://pickfreshfoods.com/fresh-strawberry-lemonade/',
  creditsText: 'Pick Fresh Foods',
  recipePictures: [
    {
      id: 1,
      title: 'Fresh Strawberry Lemonade',
      fileLink: 'https://spoonacular.com/recipeImages/1005366-556x370.jpg',
      positionPic: 'left'
    }
  ],
  recipeIngredientLists: [
    {
      allergies: [],
      preference: 0,
      id: 1,
      ingredientId: 1,
      ingredient: {
        name: 'Lemon Juice'
      },
      text: 'fresh lemon juice',
      quantity: 157.725
    },
    {
      allergies: [],
      preference: 1,
      id: 1,
      ingredientId: 1,
      ingredient: {
        name: 'Strawberries'
      },
      text: 'fresh strawberries',
      quantity: 453.592
    },
    {
      allergies: [],
      preference: 2,
      id: 2,
      ingredientId: 1,
      ingredient: {
        name: 'Sugar'
      },
      text: 'sugar',
      quantity: 78.863
    },
    {
      allergies: [],
      preference: 3,
      id: 3,
      ingredientId: 1,
      ingredient: { name: 'Water' },
      text: 'water',
      quantity: 236.588
    }
  ],
  steppedInstructions: [
    {
      ingredients: [],
      equipment: ['Sauce Pan'],
      id: 1,
      stepNumber: 1,
      stepDescription: 'Add  cup sugar and 1 cup water in a small saucepan.'
    },
    {
      ingredients: [],
      equipment: [],
      id: 2,
      stepNumber: 2,
      stepDescription: 'Heat over medium high heat until sugar is dissolved. Stir occasionally.'
    },
    {
      ingredients: [],
      equipment: ['Blender'],
      id: 3,
      stepNumber: 3,
      stepDescription: 'Blend strawberries in a blender with 2 cups of water.'
    },
    {
      ingredients: [],
      equipment: [],
      id: 4,
      stepNumber: 4,
      stepDescription: 'Pour into a large pitcher.'
    },
    {
      ingredients: [],
      equipment: [],
      id: 5,
      stepNumber: 5,
      stepDescription: 'Add lemon juice to pitcher.'
    },
    {
      ingredients: [],
      equipment: [],
      id: 6,
      stepNumber: 6,
      stepDescription: 'Add 1 cup of water and simple syrup.'
    },
    {
      ingredients: [],
      equipment: [],
      id: 7,
      stepNumber: 7,
      stepDescription: 'Stir to blend.'
    }
  ],
  history: [],
  createdAt: '2019-12-08T06:53:28.495Z',
  updatedAt: '2019-12-09T05:36:06.938Z'
};

export const fakeRecipe2: Recipe = {
  numberOfServings: 22,
  priceEstimate: 0,
  priceServing: 0,
  recipeCuisineTypes: [],
  recipeDishTags: [],
  recipeHealthLabels: [],
  allergyWarnings: [],
  numberStars: 0,
  numberReviews: 0,
  numberFavourites: 0,
  numberOfTimesCooked: 0,
  id: 2,
  name: 'Almond Cookie Bar',
  readyInMinutes: 45,
  rawInstructions:
    '<ol><li>Beat butter and sugar until light and fluffy.</li><li>In a bowl combine wholemeal flour and plain flour together, then mix in the butter mixture with a rubber spatula and knead gently to a soft dough.</li><li>Turn out the dough on to a flour surface or line with a plastic sheet below and with another plastic sheet on top. Then roll to a square. Chill for at least 1 hour.</li><li>Transfer the dough on a non grease paper and cover with a plastic sheet on top, then roll to dough to about 3mm thick.</li><li>Prick the dough with a fork and bake for about 15-18 minutes until brown at preheated oven 180C and leave biscuit to cool.</li><li>Spread the apricot jam over the top of the biscuit, set aside.</li><li>Mix topping ingredients and spread evenly on the biscuit with a palette knife.</li><li>Bake for 15 minutes until golden.</li><li>Remove cooked biscuit from the oven and leave to cool completely, then cut into bars.</li></ol>',
  sourceOfRecipeName: 'http://www.foodista.com/recipe/F3QRLC6D/almond-cookie-bar',
  creditsText: 'Foodista.com – The Cooking Encyclopedia Everyone Can Edit',
  recipePictures: [
    {
      id: 1,
      title: 'Almond Cookie Bar',
      fileLink: 'https://spoonacular.com/recipeImages/632116-556x370.jpg',
      positionPic: 'left'
    }
  ],
  recipeIngredientLists: [
    {
      allergies: [],
      preference: 0,
      id: 1,
      ingredientId: 3,
      ingredient: { name: 'Almond' },
      text: 'Almond flakes',
      quantity: 35
    },
    {
      allergies: [],
      preference: 1,
      id: 3,
      ingredientId: 4,
      ingredient: { name: 'Apricot Jam' },
      text: 'Apricot Gel/Jam, as needed',
      quantity: 22
    },
    {
      allergies: [],
      preference: 2,
      id: 4,
      ingredientId: 5,
      ingredient: { name: 'Brown Sugar' },
      text: 'Brown sugar',
      quantity: 25
    },
    {
      allergies: [],
      preference: 3,
      id: 6,
      ingredientId: 6,
      ingredient: { name: 'Butter' },
      text: 'Cold butter, cut to cubes',
      quantity: 50
    },
    {
      allergies: [],
      preference: 4,
      id: 4,
      ingredientId: 5,
      ingredient: { name: 'Cookie' },
      text: 'Cookie Base',
      quantity: 22
    },
    {
      allergies: [],
      preference: 5,
      id: 4,
      ingredientId: 5,
      ingredient: { name: 'Milk' },
      text: 'Fresh milk',
      quantity: 1
    },
    {
      allergies: [],
      preference: 6,
      id: 6,
      ingredientId: 6,
      ingredient: { name: 'Oatmeal' },
      text: 'Oatmeal Crushed cornflakes',
      quantity: 20
    },
    {
      allergies: [],
      preference: 7,
      id: 6,
      ingredientId: 6,
      ingredient: { name: 'Plain Flour' },
      text: 'Plain flour',
      quantity: 100
    },
    {
      allergies: [],
      preference: 8,
      id: 6,
      ingredientId: 6,
      ingredient: { name: 'Wholemeal Flour' },
      text: 'Wholemeal flour',
      quantity: 80
    }
  ],
  steppedInstructions: [
    {
      ingredients: [],
      equipment: ['Spatula', 'Bowl'],
      id: 7,
      stepNumber: 1,
      stepDescription:
        'Beat butter and sugar until light and fluffy.In a bowl combine wholemeal flour and plain flour together, then mix in the butter mixture with a rubber spatula and knead gently to a soft dough.Turn out the dough on to a flour surface or line with a plastic sheet below and with another plastic sheet on top. Then roll to a square. Chill for at least 1 hour.'
    },
    {
      ingredients: [],
      equipment: ['Oven'],
      id: 7,
      stepNumber: 2,
      stepDescription:
        'Transfer the dough on a non grease paper and cover with a plastic sheet on top, then roll to dough to about 3mm thick.Prick the dough with a fork and bake for about 15-18 minutes until brown at preheated oven 180C and leave biscuit to cool.'
    },
    {
      ingredients: [],
      equipment: [],
      id: 7,
      stepNumber: 3,
      stepDescription: 'Spread the apricot jam over the top of the biscuit, set aside.'
    },
    {
      ingredients: [],
      equipment: ['Palette Knife'],
      id: 7,
      stepNumber: 4,
      stepDescription: 'Mix topping ingredients and spread evenly on the biscuit with a palette knife.'
    },
    {
      ingredients: [],
      equipment: [],
      id: 7,
      stepNumber: 5,
      stepDescription: 'Bake for 15 minutes until golden.'
    },
    {
      ingredients: [],
      equipment: ['Oven'],
      id: 7,
      stepNumber: 6,
      stepDescription: 'Remove cooked biscuit from the oven and leave to cool completely, then cut into bars.'
    }
  ],
  history: [],
  createdAt: '2019-12-08T06:53:28.523Z',
  updatedAt: '2019-12-09T05:55:59.710Z'
};

export const fakeRecipeReturn: PagedResult<Recipe> = {
  items: [fakeRecipe1, fakeRecipe2],
  totalCount: 2
};
