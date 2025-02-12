import { HealthLabel } from './health-label.entity';

export const CHealthLabel: HealthLabel[] = [
  {
    description:
      'A vegetarian diet focuses on plants for food. These include fruits, vegetables,dried beans and peas, grains, seeds and nuts. Includes both diary products and eggs.',
    altName: 'vegetarian',
    name: 'lacto-ovo vegetarian'
  },
  {
    description:
      'A vegetarian diet focuses on plants for food. These include fruits, vegetables,dried beans and peas, grains, seeds and nuts. Includes both diary products.',
    name: 'lacto vegetarian'
  },
  {
    description:
      'A vegetarian diet focuses on plants for food. These include fruits, vegetables,dried beans and peas, grains, seeds and nuts. Specifically excludes all meat and animal products.',
    altName: 'vegan',
    name: 'vegan'
  },
  {
    description:
      'On a gluten-free diet, you do not eat wheat, rye, and barley. These foods contain gluten, a type of protein. A gluten-free diet is the main treatment for celiac disease.',
    altName: 'glutenFree',
    name: 'gluten Free'
  },
  {
    description:
      'A diet that excludes all lactose based products, generally cows milk, cheeses and yoghurts. A Dairy Free diet is generally used by people with Lactose Intolerance.',
    altName: 'dairyFree',
    name: 'dairy free'
  },
  {
    description:
      'FODMAP stands for Fermentable Oligosaccharides, Disaccharides, Monosaccharides, and Polyols, which are short chain carbohydrates and sugar alcohols that are poorly absorbed by the body, resulting in abdominal pain and bloating.',
    altName: 'lowFodmap',
    name: 'low fodmap'
  },
  {
    description: 'Keto is a very low-carb diet with less than 20g of carbohydrates per day. Substituting fats and oils for carbs.',
    altName: 'ketogenic',
    name: 'keto'
  },
  {
    description:
      'The Whole30 is a 30-day fad diet that emphasizes whole foods and the elimination of sugar, alcohol, grains, legumes, soy, and dairy. The Whole30 is similar to but more restrictive than the paleo diet, as adherents may not eat natural sweeteners like honey or maple syrup.',
    altName: 'whole30',
    name: 'whole 30'
  }
];
