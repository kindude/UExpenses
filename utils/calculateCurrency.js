const calculateCurrency = (rate, sum) => {
    let sumNew = sum;
    let rateN = rate;
    console.log(sumNew, rateN);
    
    sumNew = parseFloat((parseFloat(sumNew) / parseFloat(rateN)).toFixed(0));
    console.log(sumNew);
    return sumNew;
};

export default calculateCurrency;