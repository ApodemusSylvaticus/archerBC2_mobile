export const velocityFormula = ({
    cMuzzleVelocity,
    powderTemperature,
    cZeroTemperature,
    cTCoeff,
}: {
    cMuzzleVelocity: number;
    powderTemperature: number;
    cZeroTemperature: number;
    cTCoeff: number;
}) => {
    return cMuzzleVelocity * (1 + Math.ceil((powderTemperature - cZeroTemperature) / 15) * cTCoeff);
};
