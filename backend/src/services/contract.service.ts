export function calculateNextPaymentDate(): number {
    const nextDate = new Date();
    nextDate.setMonth(nextDate.getMonth() + 1);
    return nextDate.getTime();
}