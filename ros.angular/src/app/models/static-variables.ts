import { IdValuePair, IValidationMessages } from '@models/common.model';

export const versionNumber = 0.11;

export const Config = {
  baseURL: 'https://localhost:4200',
  productionURL: 'https://provisioners-cookbook.herokuapp.com/',
  authUrl: 'https://dev-bow02e7o.auth0.com',
  authURLDomain: 'dev-bow02e7o.auth0.com',
  productionApiURL: 'https://provisioners-cookbook-api.herokuapp.com/'
};

export const NutritionUnits: IdValuePair[] = [
  { id: 1, value: 'g' },
  { id: 2, value: 'mg' },
  { id: 3, value: 'cal' }
];

export const IngredientState: IdValuePair[] = [
  { id: 1, value: 'Chopped' },
  { id: 2, value: 'Sliced' },
  { id: 3, value: 'Diced' },
  { id: 4, value: 'Shredded' },
  { id: 5, value: 'Whole' },
  { id: 6, value: 'Firmly Packed' },
  { id: 7, value: 'Loose' },
  { id: 8, value: 'Ground' },
  { id: 9, value: 'Boiling' },
  { id: 10, value: 'Solid' },
  { id: 11, value: 'Liquid' }
];
export const AllergyArray = [
  { name: 'Gluten', symbol: 'nothing' },
  { name: 'Lactose', symbol: 'nothing' },
  { name: 'Shellfish', symbol: 'nothing' },
  { name: 'SeaFood', symbol: 'nothing' },
  { name: 'Nut', symbol: 'nothing' },
  { name: 'Sesame', symbol: 'nothing' },
  { name: 'Soy', symbol: 'nothing' },
  { name: 'Eggs', symbol: 'nothing' }
];
export const ParentTypes: IdValuePair[] = [
  { id: 1, value: 'Flour' },
  { id: 2, value: 'Vegetable' },
  { id: 3, value: 'Fruit' },
  { id: 4, value: 'Baking' },
  { id: 5, value: 'Oil' },
  { id: 6, value: 'Spice' },
  { id: 7, value: 'Meat' },
  { id: 8, value: 'Sauce' },
  { id: 9, value: 'Condiment' }
];

export const DecimalTwoPlaces = new RegExp(/^\d+(\.\d{1,2})?$/);
export const DecimalThreePlaces = new RegExp(/^\d+(\.\d{1,3})?$/);
export const ValidationMessages: IValidationMessages = {
  username: [
    { type: 'required', message: 'Your Name is <strong>required</strong>' },
    { type: 'minlength', message: 'Your Name is a little longer' },
    { type: 'maxlength', message: 'Is your Name really THAT long?' },
    { type: 'pattern', message: 'Your username must contain only numbers and letters' }
  ],
  email: [
    { type: 'required', message: 'Email is <strong>required</strong>' },
    { type: 'minlength', message: 'Your Email is a little longer' },
    { type: 'maxlength', message: 'Is your Email really THAT long?' },
    { type: 'pattern', message: 'Enter a valid email' },
    { type: 'email', message: 'Please provide a valid email address.' },
    { type: 'googleLogin', message: 'This is a google address, please login through the Google Login button.' },
    { type: 'registrationRequired', message: 'Email account not found, would you like to register now?' },
    { type: 'emailConflict', message: 'Email already registered, please try resetting password?' }
  ],
  password: [
    { type: 'required', message: 'Password is <strong>required</strong>' },
    { type: 'minlength', message: 'Your password must be a little longer.' },
    { type: 'maxlength', message: 'Are you going to remember a password THAT long?' },
    { type: 'pattern', message: 'Must meet a certain pattern.' },
    { type: 'wrongPassword', message: 'Please check your password and try again.' }
  ],
  phone: [
    { type: 'required', message: 'A contact number is required' },
    { type: 'validCountryPhone', message: 'Must be an Australian mobile or fixed line (08)' }
  ],
  intPassNumbers: [
    { type: 'required', message: 'Passenger numbers are required' },
    { type: 'pattern', message: 'Passengers must be a whole number - no decimal places' },
    { type: 'min', message: 'Passengers cannot be negative' },
    { type: 'max', message: 'HCC Bus will only legally fit 27 passengers plus teacher and driver' }
  ],
  reasonControl: [{ type: 'required', message: 'At least one destination is required' }],
  repeatBookingNumberControl: [
    { type: 'min', message: `Don't be so negative` },
    { type: 'max', message: `Please complete a future booking` },
    { type: 'pattern', message: 'Repeats must be a whole number' }
  ],
  terms: [{ type: 'pattern', message: 'You must accept terms and conditions' }]
};
export const OrderRecipesBy: Array<{ key: string; value: string }> = [
  { key: 'Name', value: 'name' },
  { key: 'Times Cooked', value: 'numberOfTimesCooked' },
  { key: 'Rating', value: 'numberStars' },
  { key: 'Cooking Time', value: 'readyInMinutes' },
  { key: 'Cost', value: 'priceEstimate' },
  { key: 'Calories', value: 'calorieCount' }
];
