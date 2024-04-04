


const filterByMonthGeneral = (spendings) => {
    const currentMonth = new Date().getMonth() + 1;
    const filteredSpendings = spendings.filter(item => {
        const itemDate = new Date(item.date);
        return itemDate.getMonth() + 1 === currentMonth;
    });

    let totalSum = 0;

    filteredSpendings.forEach(item => {
        totalSum += parseFloat(item.sum);
    });


    return { totalSum, filteredSpendings };
};

export default filterByMonthGeneral;