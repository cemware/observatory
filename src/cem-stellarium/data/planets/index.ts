function parsePlanetIni(planetText: string) {
  const result: Record<string, any> = {};
  const [nameLine, ...lines] = planetText.split('\n');
  result.name = nameLine.replace(/\[|\]/g, '').trim();
  for (let line of lines) {
    const [key, value] = line.split(/=|;/g).map((s) => s.trim());
    if (key && value) {
      const valueAsNumber = Number(value.replace('km', ''));
      if (Number.isNaN(valueAsNumber)) {
        result[key] = value;
      } else {
        result[key] = valueAsNumber;
      }
    }
  }
  return result;
}

const result: Record<string, any> = {};

fetch('/data/planets.ini')
  .then((res) => res.text())
  .then((data) => {
    const planets = data.split('\n\n').map(parsePlanetIni);
    for (const planet of planets) {
      const { name, ...rest } = planet;
      result[name] = rest;
    }
  });

export default result;