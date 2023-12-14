const time = new Date();
const timeZone = time.getTimezoneOffset();
const hour = time.getHours();

console.log(time);
console.log(timeZone);
console.log(hour);

const currentDateTime = new Date();

// 현재 시스템 시간대 확인
const systemTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
console.log('현재 시스템 시간대:', systemTimeZone);

// 특정 시간대로 변경
const targetTimeZone = 'Asia/Seoul';
const formattedDate = new Intl.DateTimeFormat('en-US', { timeZone: targetTimeZone }).format(currentDateTime);
console.log('변경된 시간대:', formattedDate);
