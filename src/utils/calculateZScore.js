export const calculateZ = (data) => {
    let mean = data.reduce((a, b) => a + b.value, 0) / data.length;
    let stdev = Math.sqrt(data.reduce((sq, n) => sq + Math.pow(n.value - mean, 2), 0) / data.length);

    return data.map((value, index) => ({
        id: index,
        value: value.value,
        name: value.name,
        zScore: (value.value - mean) / stdev,
    }));
}