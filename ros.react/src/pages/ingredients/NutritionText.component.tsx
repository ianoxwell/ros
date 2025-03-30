import { IMinerals, IVitamins } from '@domain/ingredient.dto';
import { CVitaminsMinerals } from '@domain/vitamin-mineral-const';
import { fixWholeNumber } from '@utils/numberUtils';

interface IDisplayVitMin {
  value: string;
  percentRda: number;
  name: string;
  measure: string;
  shortName: string;
}

const NutritionText = ({ data, reverse }: { data: IMinerals | IVitamins | undefined; reverse: boolean }) => {
  if (!data) return <></>;

  const keyValuePair: IDisplayVitMin[] = Object.entries(data)
    .map(([key, value]) => {
      if (!(key in CVitaminsMinerals)) return null;

      const nutrient = CVitaminsMinerals[key as keyof (IVitamins & IMinerals)];
      if (!nutrient) return null;

      return {
        value: fixWholeNumber(value), // Round only if not an integer
        percentRda: parseFloat(((value / nutrient.rda) * 100).toFixed(1)), // Percentage of RDA
        name: nutrient.name,
        measure: nutrient.measure,
        shortName: nutrient.shortName
      };
    })
    .filter((nutrient) => nutrient !== null) // Remove nulls
    .sort((a, b) => b!.percentRda - a!.percentRda); // Sort by percentRda descending

  return (
    <>
      {keyValuePair.map((item, index) => {
        if (index > 8) return null;

        const spacingArray = [11, 13, 14.5, 15.5, 16.25, 15.5, 14.5, 13, 11];
        const marginStyle = reverse
          ? { paddingLeft: `${spacingArray[index]}rem` }
          : { paddingRight: `${spacingArray[index]}rem` };
        return (
          <div key={`${item.name}-${index}`} className="nutrient-line" style={marginStyle}>
            <span className="nutrient-short">{item.shortName}</span>
            <div className="nutrient-details">
              <span className="nutrient-value">
                {item.value} <b>{item.measure}</b> <span className="rda">({item.percentRda}% rda)</span>
              </span>
              <span className="nutrient-name">{item.name}</span>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default NutritionText;
