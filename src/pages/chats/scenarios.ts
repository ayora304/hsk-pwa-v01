export type Line = [hanzi: string, pinyin: string, english: string];
export type Choice = { line: Line; reply: Line };
export type Scenario = { id: string; title: string; goal: string; steps: { prompt: Line; choices: Choice[] }[] };
export const SCENARIOS: Scenario[] = [
  { id: 'introduction', title: 'Self-introduction', goal: 'Introduce yourself and talk about learning.', steps: [
    { prompt: ['你好！你叫什么名字？', 'Nǐ hǎo! Nǐ jiào shénme míngzi?', 'Hello! What is your name?'], choices: [
      { line: ['我叫小明。', 'Wǒ jiào Xiǎomíng.', 'My name is Xiaoming.'], reply: ['小明，很高兴认识你！', 'Xiǎomíng, hěn gāoxìng rènshi nǐ!', 'Xiaoming, nice to meet you!'] },
      { line: ['你可以叫我小林。', 'Nǐ kěyǐ jiào wǒ Xiǎolín.', 'You can call me Xiaolin.'], reply: ['小林，欢迎你！', 'Xiǎolín, huānyíng nǐ!', 'Xiaolin, welcome!'] }] },
    { prompt: ['你喜欢学汉语吗？', 'Nǐ xǐhuan xué Hànyǔ ma?', 'Do you like learning Chinese?'], choices: [
      { line: ['喜欢！我每天学习。', 'Xǐhuan! Wǒ měitiān xuéxí.', 'Yes! I study every day.'], reply: ['太好了！一起学习吧。', 'Tài hǎo le! Yìqǐ xuéxí ba.', 'Great! Let’s learn together.'] },
      { line: ['喜欢，但是有一点难。', 'Xǐhuan, dànshì yǒu yìdiǎn nán.', 'Yes, but it is a little difficult.'], reply: ['慢慢来，你可以的！', 'Mànman lái, nǐ kěyǐ de!', 'Take your time. You can do it!'] }] }] },
  { id: 'restaurant', title: 'At the Restaurant', goal: 'Order a drink and ask for the bill.', steps: [
    { prompt: ['欢迎！你想喝什么？', 'Huānyíng! Nǐ xiǎng hē shénme?', 'Welcome! What would you like to drink?'], choices: [
      { line: ['我要一杯茶。', 'Wǒ yào yì bēi chá.', 'I would like a cup of tea.'], reply: ['好的，一杯热茶。', 'Hǎo de, yì bēi rè chá.', 'Of course, one hot tea.'] },
      { line: ['请给我一杯水。', 'Qǐng gěi wǒ yì bēi shuǐ.', 'Please give me a glass of water.'], reply: ['好的，水马上来。', 'Hǎo de, shuǐ mǎshàng lái.', 'Of course, the water is coming.'] }] },
    { prompt: ['还需要什么吗？', 'Hái xūyào shénme ma?', 'Do you need anything else?'], choices: [
      { line: ['不用了，谢谢。请买单。', 'Bú yòng le, xièxie. Qǐng mǎidān.', 'No, thank you. The bill, please.'], reply: ['好的，谢谢光临！', 'Hǎo de, xièxie guānglín!', 'Of course. Thank you for visiting!'] },
      { line: ['请再给我一杯茶。', 'Qǐng zài gěi wǒ yì bēi chá.', 'Please give me another cup of tea.'], reply: ['没问题，请稍等。', 'Méi wèntí, qǐng shāo děng.', 'No problem. Please wait a moment.'] }] }] },
  { id: 'shopping', title: 'Shopping', goal: 'Ask a price and choose an item.', steps: [
    { prompt: ['你好，你想买什么？', 'Nǐ hǎo, nǐ xiǎng mǎi shénme?', 'Hello, what would you like to buy?'], choices: [
      { line: ['这个多少钱？', 'Zhège duōshao qián?', 'How much is this?'], reply: ['这个二十块钱。', 'Zhège èrshí kuài qián.', 'This costs twenty yuan.'] },
      { line: ['我想看看书。', 'Wǒ xiǎng kànkan shū.', 'I would like to look at books.'], reply: ['这些书都是二十块钱。', 'Zhèxiē shū dōu shì èrshí kuài qián.', 'These books all cost twenty yuan.'] }] },
    { prompt: ['你要这个吗？', 'Nǐ yào zhège ma?', 'Would you like this one?'], choices: [
      { line: ['好的，我买这个。', 'Hǎo de, wǒ mǎi zhège.', 'Yes, I will buy this one.'], reply: ['谢谢！欢迎下次再来。', 'Xièxie! Huānyíng xià cì zài lái.', 'Thank you! Please come again.'] },
      { line: ['我再看看，谢谢。', 'Wǒ zài kànkan, xièxie.', 'I will look around some more, thank you.'], reply: ['好的，请慢慢看。', 'Hǎo de, qǐng mànman kàn.', 'Of course, take your time.'] }] }] },
  { id: 'travel', title: 'Travel', goal: 'Ask directions and choose transport.', steps: [
    { prompt: ['你好！你要去哪儿？', 'Nǐ hǎo! Nǐ yào qù nǎr?', 'Hello! Where would you like to go?'], choices: [
      { line: ['我要去火车站。', 'Wǒ yào qù huǒchēzhàn.', 'I would like to go to the railway station.'], reply: ['火车站在前面。', 'Huǒchēzhàn zài qiánmiàn.', 'The railway station is ahead.'] },
      { line: ['请问，学校在哪儿？', 'Qǐngwèn, xuéxiào zài nǎr?', 'Excuse me, where is the school?'], reply: ['学校在左边。', 'Xuéxiào zài zuǒbian.', 'The school is on the left.'] }] },
    { prompt: ['你想坐车吗？', 'Nǐ xiǎng zuò chē ma?', 'Would you like to take a vehicle?'], choices: [
      { line: ['我想坐公共汽车。', 'Wǒ xiǎng zuò gōnggòng qìchē.', 'I would like to take the bus.'], reply: ['车站就在这里。', 'Chēzhàn jiù zài zhèlǐ.', 'The bus stop is right here.'] },
      { line: ['不，我想走路。谢谢！', 'Bù, wǒ xiǎng zǒulù. Xièxie!', 'No, I would like to walk. Thank you!'], reply: ['不客气，祝你一路顺风！', 'Bú kèqi, zhù nǐ yílù shùnfēng!', 'You’re welcome. Have a good journey!'] }] }] },
];
export const encodeLine = (speaker: 'Tutor' | 'You', value: Line) => `${speaker}: ${value.join('\n')}`;
export function scenarioForId(id = '') { return id.startsWith('guided:') ? SCENARIOS.find(s => s.id === id.split(':')[1]) : undefined; }
