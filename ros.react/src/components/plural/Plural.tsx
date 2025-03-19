/**
 * Source - https://gist.github.com/mrcoles/ebd34c3a3ca39614c8ad250e5f83e9be
 * @example `<Plural
      text="watch"
      singularSuffix="es"
      pluralSuffix=""
      num={numWatches}
    />` - watch - watches
 * @example  <Plural text="dog" num={numDogs} /> - dog - dogs
 */
export const Plural = ({
  num,
  text,
  pluralText,
  pluralSuffix,
  singularSuffix
}: {
  num: number;
  text: string;
  pluralText?: string;
  pluralSuffix?: string;
  singularSuffix?: string;
}) => {
  return <>{num === 1 ? text + (singularSuffix || '') : pluralText ? pluralText : text + (pluralSuffix || 's')}</>;
};
