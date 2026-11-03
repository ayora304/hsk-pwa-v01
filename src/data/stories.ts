export interface Story { id: string; level: number; title: string; english: string; theme: string; lines: [string, string][] }
/** Original practice passages. Levels are suggested reading difficulty. */
export const STORIES: Story[] = [
  { id: 'tea', level: 1, title: '一杯茶', english: 'A cup of tea', theme: 'Small kindnesses', lines: [
    ['今天很冷。我和妈妈在家。', 'It is cold today. Mum and I are at home.'],
    ['妈妈说：“你想喝什么？”', 'Mum asks, “What would you like to drink?”'],
    ['我说：“我想喝茶。”', 'I say, “I would like some tea.”'],
    ['妈妈给我一杯茶。我说：“谢谢妈妈！”', 'Mum gives me a cup of tea. I say, “Thank you, Mum!”'],
  ] },
  { id: 'home', level: 2, title: '回家的路', english: 'The way home', theme: 'Family', lines: [
    ['下班以后，我坐公共汽车回家。', 'After work, I take the bus home.'],
    ['今天车上的人很多，我有点儿累。', 'There are many people on the bus today, and I am a little tired.'],
    ['爸爸打电话问我：“你到哪儿了？”', 'Dad calls and asks, “Where are you now?”'],
    ['“快到了！”我说。想到家里的晚饭，我笑了。', '“Almost there!” I say. Thinking of dinner at home, I smile.'],
  ] },
  { id: 'rain', level: 3, title: '雨中的朋友', english: 'A friend in the rain', theme: 'Friendship', lines: [
    ['我走出图书馆的时候，突然下雨了。', 'As I walk out of the library, it suddenly starts to rain.'],
    ['我忘了带伞，只好站在门口等。', 'I forgot my umbrella, so I have to wait by the entrance.'],
    ['这时，一个同学走过来，把伞举到我头上。', 'Just then, a classmate comes over and holds an umbrella above my head.'],
    ['“一起走吧，”她说，“我们住得很近。”', '“Let’s walk together,” she says. “We live close to each other.”'],
    ['那天的雨很大，可是我觉得很温暖。', 'It rains heavily that day, but I feel warm inside.'],
  ] },
  { id: 'shop', level: 4, title: '街角的小店', english: 'The shop on the corner', theme: 'Daily life', lines: [
    ['街角有一家小店，老板总是记得每位客人的名字。', 'There is a small shop on the corner whose owner always remembers every customer’s name.'],
    ['搬到这里以后，我每天早上都会去买一份早餐。', 'Since moving here, I have gone there every morning to buy breakfast.'],
    ['有一天，我发现自己忘带钱包了，觉得十分尴尬。', 'One day, I realise I have forgotten my wallet and feel terribly embarrassed.'],
    ['老板却笑着说：“没关系，下次再付吧。”', 'The owner smiles and says, “It’s all right. Pay next time.”'],
    ['原来，让人喜欢一个地方的，往往是那里的人。', 'It turns out that what makes us love a place is often its people.'],
  ] },
  { id: 'letter', level: 5, title: '写给未来的信', english: 'A letter to the future', theme: 'Growing up', lines: [
    ['整理旧书时，我偶然发现了一封十年前写给自己的信。', 'While sorting old books, I happen upon a letter I wrote to myself ten years ago.'],
    ['信里的我对未来充满期待，似乎一切梦想都触手可及。', 'The person in the letter is full of hope for the future, as though every dream were within reach.'],
    ['虽然如今的生活与当初的想象截然不同，我却并不失望。', 'Although life now is entirely different from what I imagined, I am not disappointed.'],
    ['那些意料之外的经历，让我逐渐明白了自己真正珍惜的东西。', 'Those unexpected experiences have gradually taught me what I truly cherish.'],
    ['我拿起笔，决定再写一封信，留给十年后的自己。', 'I pick up a pen and decide to write another letter for myself ten years from now.'],
  ] },
  { id: 'city', level: 6, title: '城市的留白', english: 'Room to breathe', theme: 'A different perspective', lines: [
    ['城市不断扩张，仿佛每一寸土地都必须证明自己的价值。', 'The city keeps expanding, as if every inch of land must justify its worth.'],
    ['然而，我最留恋的，却是两栋高楼之间那片不起眼的空地。', 'Yet what I cherish most is an unassuming patch of open ground between two towers.'],
    ['黄昏时，邻居们在那里闲聊，孩子们追逐着彼此的影子。', 'At dusk, neighbours chat there while children chase one another’s shadows.'],
    ['它没有被精心规划，却容纳了最自然的相遇。', 'It was never carefully planned, yet it makes room for the most natural encounters.'],
    ['也许，一座宜居的城市，不仅需要宏伟的建筑，更需要允许生活自由发生的留白。', 'Perhaps a liveable city needs not only grand buildings but also open spaces where life can unfold freely.'],
  ] },
];
